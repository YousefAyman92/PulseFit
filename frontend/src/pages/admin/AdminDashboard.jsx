import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

const s = {
    page: {
        backgroundColor: "#09090b",
        minHeight: "100vh",
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
        marginBottom: "2rem",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem",
        marginBottom: "2rem",
    },
    statCard: {
        backgroundColor: "#16161a",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        padding: "1.25rem 1.5rem",
    },
    statLabel: {
        color: "#888888",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.1em",
        marginBottom: "0.5rem",
    },
    statValue: {
        color: "#ffffff",
        fontSize: "2rem",
        fontWeight: "800",
        lineHeight: 1,
        marginBottom: "0.25rem",
    },
    statSub: {
        color: "#555555",
        fontSize: "12px",
    },
    bottomGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginBottom: "2rem",
    },
    card: {
        backgroundColor: "#16161a",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        padding: "1.5rem",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.25rem",
    },
    cardTitle: {
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: "700",
        margin: 0,
    },
    manageLink: {
        color: "#a3e635",
        fontSize: "12px",
        textDecoration: "none",
    },
    classRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.6rem 0",
        borderBottom: "1px solid #1e1e22",
    },
    className: {
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "500",
    },
    classInfo: {
        color: "#888888",
        fontSize: "12px",
        marginTop: "2px",
    },
    classBadge: {
        color: "#888888",
        fontSize: "12px",
        whiteSpace: "nowrap",
    },
    equipRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 0",
    },
    equipLabel: {
        color: "#888888",
        fontSize: "13px",
        width: "90px",
    },
    equipBar: {
        flex: 1,
        height: "6px",
        backgroundColor: "#1e1e22",
        borderRadius: "3px",
        margin: "0 1rem",
        overflow: "hidden",
    },
    equipCount: {
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: "600",
        whiteSpace: "nowrap",
        width: "60px",
        textAlign: "right",
    },
    activityRow: {
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: "0.5rem 0",
        borderBottom: "1px solid #1e1e22",
    },
    activityDot: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: "#a3e635",
        marginTop: "5px",
        flexShrink: 0,
    },
    activityText: {
        color: "#888888",
        fontSize: "13px",
        lineHeight: 1.5,
    },
    activityTime: {
        color: "#444444",
        fontSize: "11px",
        marginTop: "2px",
    },
    empty: {
        color: "#555555",
        fontSize: "13px",
        padding: "1rem 0",
    },
    loading: {
        color: "#888888",
        fontSize: "14px",
        padding: "2rem 0",
        textAlign: "center",
    },
};

// each equipment status gets a different color in the progress bar
const equipmentColors = {
    Available: "#a3e635",
    In_Use: "#f59e0b",
    Maintenance: "#ff6b6b",
    Retired: "#555555",
};

// find the plan that has the most active subscriptions
const getMostCommonPlan = (subs) => {
    if (!subs.length) return "—";
    const counts = {};
    subs.forEach((s) => {
        const name = s.plan?.title || "Unknown";
        counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
};

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [classes, setClasses] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // fetch all data at once — if one fails the rest still work
                const [membersRes, classesRes, feedbackRes, equipRes, subsRes] =
                    await Promise.allSettled([
                        api.get("/users"),
                        api.get("/classes"),
                        api.get("/feedback"),
                        api.get("/equipment"),
                        api.get("/subscriptions"),
                    ]);

                // use empty array as fallback if a request fails
                const members = Array.isArray(membersRes.value?.data) ? membersRes.value.data : [];
                const allClasses = Array.isArray(classesRes.value?.data) ? classesRes.value.data : [];
                const allFeedback = Array.isArray(feedbackRes.value?.data) ? feedbackRes.value.data : [];
                const allEquip = Array.isArray(equipRes.value?.data) ? equipRes.value.data : [];
                const allSubs = Array.isArray(subsRes.value?.data) ? subsRes.value.data : [];

                // only count subscriptions that are currently active
                const activeSubs = allSubs.filter((s) => s.status === "active");

                // calculate monthly revenue from active subscriptions
                const mrr = activeSubs.reduce((sum, sub) => {
                    const price = sub.plan?.price || 0;
                    const dur = sub.plan?.duration || 30;
                    return sum + (price / dur) * 30;
                }, 0);

                // count classes scheduled for today
                const today = new Date().toDateString();
                const classesToday = allClasses.filter(
                    (c) => new Date(c.scheduledAt).toDateString() === today
                );

                // group equipment by status
                const equipCounts = {
                    Available: allEquip.filter((e) => e.status === "available").length,
                    In_Use: allEquip.filter((e) => e.status === "in_use").length,
                    Maintenance: allEquip.filter((e) => e.status === "maintenance").length,
                    Retired: allEquip.filter((e) => e.status === "retired").length,
                };

                setStats({
                    members: members.length,
                    activeSubs: activeSubs.length,
                    mrr: mrr.toFixed(2),
                    classesToday: classesToday.length,
                    totalClasses: allClasses.length,
                    inUse: equipCounts.In_Use,
                    maintenance: equipCounts.Maintenance,
                    openFeedback: allFeedback.filter((f) => !f.resolved).length,
                    topPlan: getMostCommonPlan(activeSubs),
                    equipCounts,
                    totalEquip: allEquip.length,
                });

                // show only the next 6 classes and last 5 feedback entries
                setClasses(allClasses.slice(0, 6));
                setFeedback(allFeedback.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    if (loading || !stats) return <div style={s.loading}>Loading dashboard...</div>;

    return (
        <div style={s.page}>
            <h1 style={s.heading}>Dashboard</h1>
            <p style={s.subheading}>Get a real-time overview of your gym’s performance and activity.</p>

            {/* 8 stat cards at the top */}
            <div style={s.statsGrid}>
                {[
                    { label: "MEMBERS", value: stats.members, sub: "Total registered" },
                    { label: "ACTIVE SUBS", value: stats.activeSubs, sub: "Currently active" },
                    { label: "MRR", value: `$${stats.mrr}`, sub: "Normalized monthly" },
                    { label: "CLASSES TODAY", value: stats.classesToday, sub: `${stats.totalClasses} total` },
                    { label: "IN USE", value: stats.inUse, sub: "Equipment" },
                    { label: "MAINTENANCE", value: stats.maintenance, sub: "Equipment" },
                    { label: "OPEN FEEDBACK", value: stats.openFeedback, sub: "Unresolved" },
                    { label: "TOP PLAN", value: stats.topPlan, sub: "Most subscribed" },
                ].map((stat) => (
                    <div key={stat.label} style={s.statCard}>
                        <div style={s.statLabel}>{stat.label}</div>
                        <div style={{ ...s.statValue, fontSize: String(stat.value).length > 6 ? "1.3rem" : "2rem" }}>
                            {stat.value}
                        </div>
                        <div style={s.statSub}>{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div style={s.bottomGrid}>

                {/* upcoming classes list */}
                <div style={s.card}>
                    <div style={s.cardHeader}>
                        <p style={s.cardTitle}>Upcoming classes</p>
                        <Link to="/admin/classes" style={s.manageLink}>Manage →</Link>
                    </div>
                    {classes.length === 0 ? (
                        <p style={s.empty}>No classes scheduled yet.</p>
                    ) : (
                        classes.map((cls) => (
                            <div key={cls._id} style={s.classRow}>
                                <div>
                                    <div style={s.className}>{cls.name}</div>
                                    <div style={s.classInfo}>
                                        {new Date(cls.scheduledAt).toLocaleDateString("en-US", {
                                            weekday: "short", month: "short", day: "numeric",
                                        })}
                                        {" · "}{cls.instructor}
                                    </div>
                                </div>
                                <div style={s.classBadge}>
                                    {cls.booked || 0}/{cls.capacity} booked
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* equipment status with progress bars */}
                <div style={s.card}>
                    <div style={s.cardHeader}>
                        <p style={s.cardTitle}>Equipment status</p>
                        <Link to="/admin/equipment" style={s.manageLink}>Manage →</Link>
                    </div>
                    {Object.entries(stats.equipCounts).map(([label, count]) => (
                        <div key={label} style={s.equipRow}>
                            <div style={s.equipLabel}>{label.replace("_", " ")}</div>
                            <div style={s.equipBar}>
                                <div style={{
                                    height: "100%",
                                    width: stats.totalEquip ? `${(count / stats.totalEquip) * 100}%` : "0%",
                                    backgroundColor: equipmentColors[label] || "#555555",
                                    borderRadius: "3px",
                                }} />
                            </div>
                            <div style={s.equipCount}>
                                {count} · {stats.totalEquip ? Math.round((count / stats.totalEquip) * 100) : 0}%
                            </div>
                        </div>
                    ))}
                </div>

                {/* recent feedback — spans full width */}
                <div style={{ ...s.card, gridColumn: "1 / -1" }}>
                    <div style={s.cardHeader}>
                        <p style={s.cardTitle}>Recent activity</p>
                        <Link to="/admin/feedback" style={s.manageLink}>View all →</Link>
                    </div>
                    {feedback.length === 0 ? (
                        <p style={s.empty}>No feedback yet.</p>
                    ) : (
                        feedback.map((f) => (
                            <div key={f._id} style={s.activityRow}>
                                <div style={s.activityDot} />
                                <div>
                                    <div style={s.activityText}>
                                        <strong style={{ color: "#cccccc" }}>{f.memberName}</strong>
                                        {" "}left {f.rating}★ feedback
                                        {f.resolved && (
                                            <span style={{ color: "#22c55e", marginLeft: "6px", fontSize: "11px" }}>
                                                · Resolved
                                            </span>
                                        )}
                                    </div>
                                    <div style={s.activityTime}>
                                        {new Date(f.createdAt).toLocaleDateString("en-US", {
                                            month: "short", day: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}