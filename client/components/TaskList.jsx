
export default function TaskList({ tasks, onDelete, onEdit }) {
  if (!tasks.length) return (
    <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
      <p>No tasks yet. Add a task to get started.</p>
    </div>
  );

  const getUrgencyColor = (u) => {
    if (u >= 5) return "var(--danger)";
    if (u >= 3) return "var(--warning)";
    return "var(--success)";
  };

  const getWorkloadColor = (w) => {
    if (w >= 4) return "#8b5cf6"; // Violet
    if (w >= 3) return "#a855f7"; // Purple
    return "#3b82f6"; // Blue
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
      {tasks.map((task, index) => {
        const isRanked = task.priority_score != null;

        return (
          <div
            key={task.id}
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
          >
            {/* Actions (Top Right) */}
            <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 10, display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => onEdit && onEdit(task)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  color: "var(--primary)",
                  padding: "0",
                  lineHeight: "1",
                  opacity: 0.7,
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.opacity = "1"}
                onMouseLeave={(e) => e.target.style.opacity = "0.7"}
                title="Edit Task"
              >
                ✎
              </button>
              <button
                onClick={() => onDelete && onDelete(task.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  padding: "0",
                  lineHeight: "0.8",
                  opacity: 0.6,
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.opacity = "1"}
                onMouseLeave={(e) => e.target.style.opacity = "0.6"}
                title="Delete Task"
              >
                ×
              </button>
            </div>

            {/* Rank Badge (Top Left) */}
            {isRanked && (
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  backgroundColor: index === 0 ? "var(--primary)" : "var(--text-secondary)",
                  color: "white",
                  padding: "0.25rem 1rem",
                  borderBottomRightRadius: "12px",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                }}
              >
                Rank #{index + 1}
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{task.title}</h3>
              {task.description && (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  {task.description}
                </p>
              )}
            </div>

            {/* Badges Row */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <span
                style={{
                  backgroundColor: `${getUrgencyColor(task.urgency)}20`,
                  color: getUrgencyColor(task.urgency),
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                Urgency: {task.urgency}/5
              </span>
              <span
                style={{
                  backgroundColor: `${getWorkloadColor(task.workload)}20`,
                  color: getWorkloadColor(task.workload),
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                Workload: {task.workload}/5
              </span>
              {task.due_date && (
                <span
                  style={{
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "999px",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem"
                  }}
                >
                  📅 {new Date(task.due_date).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Priority Section */}
            {isRanked && (
              <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                    AI Priority Score
                  </span>
                  <span style={{ fontSize: "0.875rem", fontWeight: "bold", color: "var(--primary)" }}>
                    {task.priority_score}/100
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{ width: "100%", height: "8px", backgroundColor: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${task.priority_score}%`,
                      height: "100%",
                      backgroundColor: "var(--primary)",
                      borderRadius: "999px",
                      transition: "width 1s ease-in-out"
                    }}
                  />
                </div>

                <p style={{ fontSize: "0.9rem", marginTop: "0.75rem", fontStyle: "italic", color: "var(--text-secondary)" }}>
                  "{task.priority_reason}"
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
