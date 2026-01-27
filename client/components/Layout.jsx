import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    if (!user) return <>{children}</>;

    const menuItems = [
        { label: "Dashboard", href: "/", icon: "📊" },
        { label: "My Tasks", href: "/tasks", icon: "✅" },
        { label: "Analytics", href: "/analytics", icon: "📈" },
    ];

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-body)" }}>

            {/* Sidebar */}
            <aside style={{
                width: isSidebarOpen ? "260px" : "80px",
                backgroundColor: "var(--bg-surface)",
                borderRight: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                transition: "width 0.3s ease",
                position: "fixed",
                height: "100vh",
                zIndex: 20
            }}>
                <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>🤖</span>
                    {isSidebarOpen && <span style={{ fontWeight: "bold", fontSize: "1.25rem", color: "var(--text-main)" }}>AI Tasks</span>}
                </div>

                <nav style={{ flex: 1, padding: "1rem" }}>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {menuItems.map((item) => {
                            const isActive = router.pathname === item.href;
                            return (
                                <li key={item.href} style={{ marginBottom: "0.5rem" }}>
                                    <Link href={item.href} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1rem",
                                        padding: "0.75rem 1rem",
                                        borderRadius: "8px",
                                        color: isActive ? "white" : "var(--text-secondary)",
                                        backgroundColor: isActive ? "var(--primary)" : "transparent",
                                        textDecoration: "none",
                                        transition: "all 0.2s",
                                        fontWeight: isActive ? "600" : "500",
                                        justifyContent: isSidebarOpen ? "flex-start" : "center"
                                    }}>
                                        <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                                        {isSidebarOpen && <span>{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div style={{ padding: "1rem", borderTop: "1px solid var(--border)" }}>
                    <button
                        onClick={logout}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            background: "transparent",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                            justifyContent: isSidebarOpen ? "flex-start" : "center"
                        }}
                    >
                        <span>🚪</span>
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: isSidebarOpen ? "260px" : "80px",
                transition: "margin 0.3s ease",
                padding: "2rem",
                overflowY: "auto"
            }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    {/* Top Bar for Mobile/Tablet or just Title */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--text-main)" }}>
                            {menuItems.find(i => i.href === router.pathname)?.label || "Page"}
                        </h2>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ padding: "0.5rem 1rem", background: "white", borderRadius: "99px", border: "1px solid var(--border)" }}>
                                👤 {user.username}
                            </div>
                        </div>
                    </div>

                    {children}
                </div>
            </main>

        </div>
    );
}
