import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import EditTaskModal from "../components/EditTaskModal";
import CreateTaskModal from "../components/CreateTaskModal";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

// Backend API URL
const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function TasksPage() {
    const { user, token, loading: authLoading } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ranking, setRanking] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isCreateOpen, setCreateOpen] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [authLoading, user, router]);

    // Fetch all tasks
    const fetchTasks = async () => {
        if (!token) return;
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_BASE}/api/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                setTasks(await res.json());
            }
        } catch (err) {
            console.error("Network error:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user && token) {
            fetchTasks();
        }
    }, [user, token]);

    const handleRankClick = async () => {
        setRanking(true);
        try {
            const res = await fetch(`${BACKEND_BASE}/api/tasks/rank`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (res.ok) {
                const data = await res.json();
                if (data.tasks) {
                    setTasks(data.tasks);
                }
            }
        } catch (err) {
            console.error("Ranking error:", err);
        }
        setRanking(false);
    };

    const handleDeleteTask = async (id) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            const res = await fetch(`${BACKEND_BASE}/api/tasks/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setTasks((prev) => prev.filter((t) => t.id !== id));
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleUpdateTask = async (updatedTask) => {
        try {
            const res = await fetch(`${BACKEND_BASE}/api/tasks/${updatedTask.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedTask),
            });

            if (res.ok) {
                const result = await res.json();
                setTasks((prev) =>
                    prev.map((t) => (t.id === result.id ? result : t))
                        .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
                );
                setEditingTask(null);
            }
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>My Tasks</h1>
                    <p style={{ color: "var(--text-secondary)" }}>Manage and prioritize your work.</p>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                        onClick={handleRankClick}
                        disabled={ranking || !tasks.length}
                        style={{
                            background: "white",
                            color: "var(--primary)",
                            border: "1px solid var(--border)",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: !tasks.length ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", gap: "0.5rem"
                        }}
                    >
                        {ranking ? "Thinking..." : "✨ AI Rank"}
                    </button>

                    <button
                        onClick={() => setCreateOpen(true)}
                        style={{
                            backgroundColor: "var(--primary)",
                            color: "white",
                            border: "none",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "8px",
                            fontWeight: "600"
                        }}
                    >
                        + New Task
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <TaskList
                    tasks={tasks}
                    onDelete={handleDeleteTask}
                    onEdit={(task) => setEditingTask(task)}
                />
            )}

            {isCreateOpen && (
                <CreateTaskModal
                    onClose={() => setCreateOpen(false)}
                    onTaskCreated={(task) => {
                        setTasks((prev) => [task, ...prev]);
                    }}
                />
            )}

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
