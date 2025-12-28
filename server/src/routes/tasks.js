// server/src/routes/tasks.js
import express from "express";
import { pool } from "../db.js";
import { getPriorityFromGemini } from "../services/gemini.js";

export const tasksRouter = express.Router();

// GET /api/tasks  -> list tasks
tasksRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY priority_score DESC NULLS LAST, created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST /api/tasks -> create a task
tasksRouter.post("/", async (req, res) => {
  try {
    const { title, description, due_date, urgency, workload } = req.body;
    const r = await pool.query(
      `INSERT INTO tasks (title, description, due_date, urgency, workload)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [title, description, due_date || null, urgency || 1, workload || 1]
    );
    console.log("Created task id=", r.rows[0].id);
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// POST /api/tasks/rank -> call Gemini (or fallback) and update DB
tasksRouter.post("/rank", async (req, res) => {
  try {
    console.log("🔔 /api/tasks/rank called", new Date().toISOString());

    const result = await pool.query("SELECT * FROM tasks ORDER BY created_at ASC");
    const tasks = result.rows;
    if (!tasks.length) return res.json({ updated: 0, tasks: [] });

    // Try calling Gemini
    let aiOutput = [];
    try {
      aiOutput = await getPriorityFromGemini(tasks);
      console.log("Gemini output:", aiOutput);
    } catch (err) {
      console.error("Gemini call failed:", err);
    }

    // Fallback rule-based ranking when AI is not available or returned nothing
    function ruleBasedRanking(tasks) {
      return tasks.map((t) => {
        const now = Date.now();
        const due = t.due_date ? new Date(t.due_date).getTime() : now + 7 * 24 * 3600 * 1000;
        const daysLeft = Math.max(0, Math.round((due - now) / (24 * 3600 * 1000)));
        const deadlineScore = Math.max(0, Math.min(50, Math.round((7 - Math.min(7, daysLeft)) * (50 / 7))));
        const urgencyScore = (t.urgency || 1) * 10; // 10-50
        const workloadScore = Math.max(0, 50 - (t.workload || 1) * 8); // prefer lower workload
        const priority_score = Math.min(100, deadlineScore + urgencyScore + Math.round(workloadScore / 2));
        return {
          id: t.id,
          priority_score,
          reason: `Fallback: ${daysLeft}d left, urgency ${t.urgency}`,
        };
      });
    }

    if (!aiOutput || !Array.isArray(aiOutput) || aiOutput.length === 0) {
      console.log("Using rule-based fallback for ranking");
      aiOutput = ruleBasedRanking(tasks);
    }

    // Update DB with aiOutput
    for (const item of aiOutput) {
      await pool.query(
        `UPDATE tasks
         SET priority_score = $1,
             priority_reason = $2
         WHERE id = $3`,
        [item.priority_score || null, item.reason || null, item.id]
      );
    }

    const updated = await pool.query(
      "SELECT * FROM tasks ORDER BY priority_score DESC NULLS LAST, created_at DESC"
    );
    res.json({ updated: updated.rows.length, tasks: updated.rows });
  } catch (err) {
    console.error("POST /api/tasks/rank error:", err);
    res.status(500).json({ error: "Failed to rank tasks using AI/fallback" });
  }
});

// PUT /api/tasks/:id -> update a task
tasksRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, urgency, workload, priority_score, priority_reason } = req.body;

    const result = await pool.query(
      `UPDATE tasks 
       SET title = $1, description = $2, due_date = $3, urgency = $4, workload = $5, priority_score = $6, priority_reason = $7
       WHERE id = $8 RETURNING *`,
      [title, description, due_date || null, urgency, workload, priority_score, priority_reason, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    console.log(`Updated task id=${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /api/tasks/:id error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE /api/tasks/:id -> delete a task
tasksRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING id", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    console.log(`Deleted task id=${id}`);
    res.json({ message: "Task deleted successfully", id });
  } catch (err) {
    console.error("DELETE /api/tasks/:id error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});
