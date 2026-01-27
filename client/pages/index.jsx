import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Dashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user && token) {
      fetch(`${BACKEND_BASE}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setTasks(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user, token]);

  if (loading || authLoading) return <p style={{ padding: "2rem" }}>Loading dashboard...</p>;

  // Calculate Stats
  const totalTasks = tasks.length;
  const highPriority = tasks.filter(t => (t.priority_score || 0) > 70).length;
  const urgentTasks = tasks.filter(t => t.urgency >= 4).length;
  const recentTasks = tasks.slice(0, 5); // Assuming API returns sorted by recent/priority

  const StatCard = ({ title, value, icon, color }) => (
    <div style={{
      backgroundColor: "white",
      padding: "1.5rem",
      borderRadius: "12px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      border: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    }}>
      <div style={{
        backgroundColor: color,
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        color: "white"
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>{title}</p>
        <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "var(--text-main)" }}>{value}</p>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Dashboard</h1>
        <p style={{ color: "var(--text-secondary)" }}>Welcome back, {user?.username}!</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <StatCard title="Total Tasks" value={totalTasks} icon="📝" color="#4f46e5" />
        <StatCard title="High Priority" value={highPriority} icon="🔥" color="#ef4444" />
        <StatCard title="Urgent" value={urgentTasks} icon="⚡" color="#f59e0b" />
      </div>

      {/* Recent Activity */}
      <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid var(--border)", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem" }}>Recent Tasks</h2>
          <Link href="/tasks" style={{ color: "var(--primary)", fontWeight: "600", fontSize: "0.9rem" }}>View All</Link>
        </div>

        {recentTasks.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-secondary)", margin: "2rem 0" }}>No tasks yet. Create one!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentTasks.map(task => (
              <div key={task.id} style={{
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: "600" }}>{task.title}</p>
                  <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {task.category || "General"} • Score: {task.priority_score || "N/A"}
                  </p>
                </div>
                <div style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "99px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  backgroundColor: (task.priority_score || 0) > 70 ? "#fee2e2" : "#f3f4f6", // red-100 vs gray-100
                  color: (task.priority_score || 0) > 70 ? "#b91c1c" : "#374151"
                }}>
                  {task.priority_score ? "Score: " + task.priority_score : "Not Ranked"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
