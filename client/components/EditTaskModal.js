import { useState, useEffect } from "react";

export default function EditTaskModal({ task, onClose, onUpdate }) {
    const [formData, setFormData] = useState({ ...task });

    useEffect(() => {
        setFormData({ ...task });
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({
            ...formData,
            urgency: Number(formData.urgency),
            workload: Number(formData.workload),
            priority_score: formData.priority_score ? Number(formData.priority_score) : null
        });
    };

    const inputStyle = {
        padding: "0.5rem",
        borderRadius: "6px",
        border: "1px solid var(--border)",
        width: "100%",
        marginBottom: "1rem",
        boxSizing: "border-box",
        fontFamily: "inherit"
    };

    const labelStyle = {
        display: "block",
        marginBottom: "0.25rem",
        fontWeight: "bold",
        fontSize: "0.9rem",
        color: "var(--text-main)"
    };

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
            <div style={{
                backgroundColor: "white", padding: "2rem", borderRadius: "12px",
                width: "90%", maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
            }}>
                <h2 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Edit Task</h2>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={labelStyle}>Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} style={inputStyle} required />
                    </div>

                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea name="description" value={formData.description || ""} onChange={handleChange} style={{ ...inputStyle, minHeight: "60px" }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={labelStyle}>Urgency (1-5)</label>
                            <input type="number" name="urgency" min="1" max="5" value={formData.urgency} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Workload (1-5)</label>
                            <input type="number" name="workload" min="1" max="5" value={formData.workload} onChange={handleChange} style={inputStyle} />
                        </div>
                    </div>

                    <div style={{ padding: "1rem", backgroundColor: "#f0f9ff", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid #bae6fd" }}>
                        <label style={{ ...labelStyle, color: "#0369a1" }}>MANUAL PRIORITY OVERRIDE (0-100)</label>
                        <input
                            type="number"
                            name="priority_score"
                            min="0"
                            max="100"
                            value={formData.priority_score || ""}
                            onChange={handleChange}
                            style={{ ...inputStyle, marginBottom: "0.5rem", borderColor: "#bae6fd" }}
                            placeholder="Leave empty to use AI score"
                        />
                        <label style={{ ...labelStyle, fontSize: "0.8rem", fontWeight: "normal" }}>Reason Override (Optional)</label>
                        <input name="priority_reason" value={formData.priority_reason || ""} onChange={handleChange} style={{ ...inputStyle, marginBottom: 0, fontSize: "0.9rem" }} placeholder="e.g. Boss said do it now" />
                    </div>

                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <button type="button" onClick={onClose} style={{ padding: "0.5rem 1rem", border: "none", background: "transparent", cursor: "pointer", color: "var(--text-secondary)" }}>Cancel</button>
                        <button type="submit" style={{ padding: "0.5rem 1.5rem", border: "none", background: "var(--primary)", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
