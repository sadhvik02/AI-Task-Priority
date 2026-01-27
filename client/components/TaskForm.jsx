
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function TaskForm({ onTaskCreated }) {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [urgency, setUrgency] = useState(3);
  const [workload, setWorkload] = useState(3);
  const [category, setCategory] = useState("General");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in to create a task.");
      return;
    }
    const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    try {
      const res = await fetch(`${BACKEND_BASE}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          due_date: dueDate || null,
          urgency: Number(urgency),
          workload: Number(workload),
          category
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      const data = await res.json();
      onTaskCreated(data);
      setTitle("");
      setDescription("");
      setDueDate("");
      setUrgency(3);
      setWorkload(3);
      setCategory("General");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to create task.");
    }
  };

  const inputStyle = {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "1rem",
    fontFamily: "inherit"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "var(--text-main)",
    fontSize: "0.95rem"
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
      <div>
        <label style={labelStyle}>Task Title</label>
        <input
          placeholder="e.g., Fix login bug"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Due Date</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Description (optional)</label>
        <textarea
          placeholder="Add more details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Urgency (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Workload (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={workload}
            onChange={(e) => setWorkload(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: "var(--text-main)",
          color: "white",
          border: "none",
          padding: "0.875rem",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "1rem",
          marginTop: "0.5rem",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = "black"}
        onMouseLeave={(e) => e.target.style.backgroundColor = "var(--text-main)"}
      >
        Add Task
      </button>
    </form>
  );
}
