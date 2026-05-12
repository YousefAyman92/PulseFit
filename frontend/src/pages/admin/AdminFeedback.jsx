import { useState, useEffect } from "react";
import api from "../../utils/api";

const s = {
    page: {
        backgroundColor: "#09090b",
        minHeight: "100vh",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
    },
    heading: {
        color: "#ffffff",
        fontSize: "1.6rem",
        fontWeight: "800",
        marginBottom: "0.25rem",
    },
    subheading: {
        color: "#888888",
        fontSize: "13px",
    },
    filterRow: {
        display: "flex",
        gap: "0.5rem",
        marginBottom: "1.5rem",
    },
    // active filter button gets green background
    filterBtn: (active) => ({
        backgroundColor: active ? "#a3e635" : "#16161a",
        color: active ? "#000000" : "#888888",
        border: `1px solid ${active ? "#a3e635" : "#2a2a2a"}`,
        borderRadius: "8px",
        padding: "0.4rem 1rem",
        fontSize: "13px",
        fontWeight: active ? "700" : "400",
        cursor: "pointer",
    }),
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
    },
    card: {
        backgroundColor: "#16161a",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        padding: "1.25rem",
    },
    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "0.75rem",
    },
    cardName: {
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: "600",
    },
    cardDate: {
        color: "#555",
        fontSize: "12px",
        marginTop: "2px",
    },
    stars: {
        display: "flex",
        gap: "2px",
    },
    // filled stars are green, empty ones are dark
    star: (active) => ({
        color: active ? "#a3e635" : "#333333",
        fontSize: "15px",
    }),
    message: {
        color: "#888888",
        fontSize: "14px",
        lineHeight: 1.6,
        marginBottom: "1rem",
    },
    cardBottom: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    badgeOpen: {
        backgroundColor: "#2a1a00",
        color: "#f59e0b",
        border: "1px solid #f59e0b33",
        borderRadius: "20px",
        padding: "2px 10px",
        fontSize: "11px",
        fontWeight: "700",
    },
    badgeResolved: {
        backgroundColor: "#0a2a0a",
        color: "#22c55e",
        border: "1px solid #22c55e33",
        borderRadius: "20px",
        padding: "2px 10px",
        fontSize: "11px",
        fontWeight: "700",
    },
    actions: {
        display: "flex",
        gap: "0.5rem",
    },
    btnResolve: {
        backgroundColor: "transparent",
        border: "1px solid #2a2a2a",
        color: "#aaaaaa",
        borderRadius: "20px",
        padding: "4px 12px",
        fontSize: "12px",
        cursor: "pointer",
    },
    btnDelete: {
        backgroundColor: "transparent",
        border: "1px solid #ff6b6b33",
        color: "#ff6b6b",
        borderRadius: "20px",
        padding: "4px 12px",
        fontSize: "12px",
        cursor: "pointer",
    },
    empty: {
        color: "#555",
        fontSize: "14px",
        textAlign: "center",
        padding: "3rem 0",
    },
    loading: {
        color: "#888888",
        fontSize: "14px",
        padding: "2rem 0",
        textAlign: "center",
    },
};

export default function AdminFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedback();
    }, []);

    // load all feedback from the API
    const fetchFeedback = async () => {
        try {
            const res = await api.get("/feedback");
            setFeedbacks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // mark as resolved without refetching — update state directly
    const handleResolve = async (id) => {
        try {
            await api.patch(`/feedback/${id}/resolve`);
            setFeedbacks((prev) =>
                prev.map((f) => (f._id === id ? { ...f, resolved: true } : f))
            );
        } catch (err) {
            console.error(err);
        }
    };

    // reopen feedback
    const handleReopen = async (id) => {
        try {
            await api.patch(`/feedback/${id}/reopen`);
            setFeedbacks((prev) =>
                prev.map((f) => (f._id === id ? { ...f, resolved: false } : f))
            );
        } catch (err) {
            console.error(err);
        }
    };

    // delete with confirmation popup
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this feedback?")) return;
        try {
            await api.delete(`/feedback/${id}`);
            setFeedbacks((prev) => prev.filter((f) => f._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // filter list based on selected tab
    const filtered = feedbacks.filter((f) => {
        if (filter === "Open") return !f.resolved;
        if (filter === "Resolved") return f.resolved;
        return true;
    });

    if (loading) return <div style={s.loading}>Loading feedback...</div>;

    return (
        <div style={s.page}>
            <div style={s.header}>
                <div>
                    <h1 style={s.heading}>Feedback inbox</h1>
                    <p style={s.subheading}>Review what members are telling you.</p>
                </div>
            </div>

            {/* filter tabs — All / Open / Resolved */}
            <div style={s.filterRow}>
                {["All", "Open", "Resolved"].map((f) => (
                    <button
                        key={f}
                        style={s.filterBtn(filter === f)}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div style={s.empty}>No feedback found.</div>
            ) : (
                <div style={s.grid}>
                    {filtered.map((f) => (
                        <div key={f._id} style={s.card}>

                            {/* name + date on left, stars on right */}
                            <div style={s.cardTop}>
                                <div>
                                    <div style={s.cardName}>{f.memberName || "Anonymous"}</div>
                                    <div style={s.cardDate}>
                                        {new Date(f.createdAt).toLocaleDateString("en-US", {
                                            month: "short", day: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                                <div style={s.stars}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} style={s.star(star <= f.rating)}>★</span>
                                    ))}
                                </div>
                            </div>

                            <p style={s.message}>{f.message}</p>

                            {/* badge + action buttons */}
                            <div style={s.cardBottom}>
                                <span style={f.resolved ? s.badgeResolved : s.badgeOpen}>
                                    {f.resolved ? "RESOLVED" : "OPEN"}
                                </span>
                                <div style={s.actions}>
                                    {f.resolved ? (
                                        <button style={s.btnResolve} onClick={() => handleReopen(f._id)}>
                                            Reopen
                                        </button>
                                    ) : (
                                        <button style={s.btnResolve} onClick={() => handleResolve(f._id)}>
                                            Mark resolved
                                        </button>
                                    )}
                                    <button style={s.btnDelete} onClick={() => handleDelete(f._id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
