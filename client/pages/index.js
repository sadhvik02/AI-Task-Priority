import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import EditTaskModal from "../components/EditTaskModal";

// Backend API URL
const BACKEND_BASE = "http://localhost:4000";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState(false);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_BASE}/api/tasks`);

      if (!res.ok) {
        const text = await res.text();
        console.error("Error fetching tasks:", text);
        setError("Failed to load tasks from backend.");
        setTasks([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setTasks(data);

    } catch (err) {
      console.error("Network error:", err);
      setError("Cannot connect to backend server.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // UI callback when a new task is created
  const handleTaskCreated = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  // AI Ranking button
  const handleRankClick = async () => {
    setRanking(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_BASE}/api/tasks/rank`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Rank API error:", text);
        setError("AI ranking failed. Check backend logs.");
        setRanking(false);
        return;
      }

      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }

    } catch (err) {
      console.error("Ranking error:", err);
      setError("Cannot reach the AI ranking API.");
    }

    setRanking(false);
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`${BACKEND_BASE}/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert("Failed to delete task");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting task");
    }
  };

  // Update a task
  const handleUpdateTask = async (updatedTask) => {
    try {
      const res = await fetch(`${BACKEND_BASE}/api/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (res.ok) {
        const result = await res.json();
        // Update list and re-sort manually or just fetch
        setTasks((prev) =>
          prev.map((t) => (t.id === result.id ? result : t))
            .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
        );
        setEditingTask(null);
      } else {
        alert("Failed to update task");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating task");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "4rem auto", padding: "0 1.5rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", background: "linear-gradient(to right, var(--primary), var(--info))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          AI Task Priority
        </h1>
        <p style={{ fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
          Intelligent task management powered by Gemini AI. Add your tasks and let the AI rank them for you.
        </p>
      </div>

      {/* Task Form */}
      <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", border: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Add New Task</h2>
        <TaskForm onTaskCreated={handleTaskCreated} />
      </div>

      {/* AI Ranking Button */}
      <div style={{ display: "flex", justifyContent: "center", margin: "2.5rem 0" }}>
        <button
          onClick={handleRankClick}
          disabled={ranking || !tasks.length}
          style={{
            background: ranking ? "var(--text-secondary)" : "linear-gradient(135deg, var(--primary), var(--primary-hover))",
            color: "white",
            border: "none",
            padding: "1rem 2rem",
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: "999px",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
            opacity: !tasks.length ? 0.5 : 1,
            cursor: !tasks.length ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          {ranking ? (
            <>Thinking...</>
          ) : (
            <>✨ Analyze & Rank Tasks with AI</>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          ⚠️ {error}
        </p>
      )}

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onDelete={handleDeleteTask}
          onEdit={(task) => setEditingTask(task)}
        />
      )}

      {/* Edit Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={handleUpdateTask}
        />
      )}
    </div>
  );
}
