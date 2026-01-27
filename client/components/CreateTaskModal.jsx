import TaskForm from "./TaskForm";

export default function CreateTaskModal({ onClose, onTaskCreated }) {
    const handleSuccess = (task) => {
        onTaskCreated(task);
        onClose();
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(5px)"
        }}>
            <div style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "16px",
                width: "90%",
                maxWidth: "500px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                maxHeight: "90vh",
                overflowY: "auto"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Create New Task</h2>
                    <button
                        onClick={onClose}
                        style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-secondary)" }}
                    >
                        &times;
                    </button>
                </div>

                <TaskForm onTaskCreated={handleSuccess} />
            </div>
        </div>
    );
}
