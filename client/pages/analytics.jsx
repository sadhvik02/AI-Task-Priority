import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Analytics() {
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
                .then(setTasks)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user, token]);

    if (loading) return <p>Loading analytics...</p>;

    // Data processing
    const urgencyCounts = [0, 0, 0, 0, 0]; // 1 to 5
    const workloadCounts = [0, 0, 0, 0, 0];

    tasks.forEach(t => {
        if (t.urgency >= 1 && t.urgency <= 5) urgencyCounts[t.urgency - 1]++;
        if (t.workload >= 1 && t.workload <= 5) workloadCounts[t.workload - 1]++;
    });

    const maxUrgency = Math.max(...urgencyCounts) || 1;
    const maxWorkload = Math.max(...workloadCounts) || 1;

    const BarChart = ({ title, data, max, color }) => (
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>{title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {data.map((count, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{ width: "20px", fontWeight: "bold" }}>{index + 1}</span>
                        <div style={{ flex: 1, backgroundColor: "var(--bg-body)", borderRadius: "6px", height: "12px", overflow: "hidden" }}>
                            <div style={{
                                width: `${(count / max) * 100}%`,
                                height: "100%",
                                backgroundColor: color,
                                borderRadius: "6px",
                                transition: "width 0.5s ease"
                            }} />
                        </div>
                        <span style={{ width: "30px", textAlign: "right", color: "var(--text-secondary)" }}>{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Analytics</h1>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                <BarChart
                    title="Urgency Distribution"
                    data={urgencyCounts}
                    max={maxUrgency}
                    color="var(--warning)"
                />
                <BarChart
                    title="Workload Distribution"
                    data={workloadCounts}
                    max={maxWorkload}
                    color="var(--primary)"
                />
            </div>
        </div>
    );
}
