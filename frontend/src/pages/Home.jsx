import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = {
    hero: {
        minHeight: "calc(100vh - 60px)",
        backgroundColor: "#09090b",
        backgroundImage:
            "linear-gradient(rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.85) 100%), url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 1rem",
    },

    heroLabel: {
        color: "#a3e635",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.15em",
        marginBottom: "1.2rem",
    },

    heroTitle: {
        color: "#ffffff",
        fontSize: "clamp(2.5rem, 7vw, 5rem)",
        fontWeight: "900",
        lineHeight: 1.1,
        margin: "0 0 1.5rem",
    },

    heroAccent: {
        color: "#a3e635",
    },

    heroSub: {
        color: "#888888",
        fontSize: "1.05rem",
        maxWidth: "500px",
        marginBottom: "2.5rem",
        lineHeight: 1.6,
    },

    heroButtons: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        justifyContent: "center",
    },

    btnPrimary: {
        backgroundColor: "#a3e635",
        color: "#000",
        border: "none",
        borderRadius: "8px",
        padding: "14px 28px",
        fontSize: "15px",
        fontWeight: "700",
        cursor: "pointer",
        textDecoration: "none",
        display: "inline-block",
        transition: "all 0.2s ease",
    },

    btnOutline: {
        backgroundColor: "transparent",
        color: "#ffffff",
        border: "1px solid #333333",
        borderRadius: "8px",
        padding: "14px 28px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        textDecoration: "none",
        display: "inline-block",
        transition: "all 0.2s ease",
    },

    features: {
        backgroundColor: "#09090b",
        padding: "5rem 2rem",
        textAlign: "center",
    },

    featuresTitle: {
        color: "#ffffff",
        fontSize: "2rem",
        fontWeight: "800",
        marginBottom: "0.5rem",
    },

    featuresSub: {
        color: "#888888",
        fontSize: "15px",
        marginBottom: "3rem",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem",
        maxWidth: "1100px",
        margin: "0 auto",
    },

    card: {
        backgroundColor: "#16161a",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        padding: "1.5rem",
        textAlign: "left",
        transition: "all 0.25s ease",
    },

    cardLabel: {
        color: "#a3e635",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.12em",
        marginBottom: "0.6rem",
    },

    cardTitle: {
        color: "#ffffff",
        fontSize: "18px",
        fontWeight: "700",
        marginBottom: "0.5rem",
    },

    cardDesc: {
        color: "#888888",
        fontSize: "13px",
        lineHeight: 1.6,
        margin: 0,
    },

    marketWrap: {
        backgroundColor: "#09090b",
        borderTop: "1px solid #2a2a2a",
    },

    market: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "3rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
    },

    marketText: {
        color: "#ffffff",
        fontSize: "1.5rem",
        fontWeight: "800",
        margin: 0,
    },

    marketSub: {
        color: "#888888",
        fontSize: "14px",
        margin: "4px 0 0",
    },

    btnMarket: {
        backgroundColor: "transparent",
        border: "1px solid #333333",
        color: "#ffffff",
        borderRadius: "8px",
        padding: "10px 20px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        textDecoration: "none",
        display: "inline-block",
        transition: "all 0.2s ease",
    },

    cta: {
        backgroundColor: "#09090b",
        borderTop: "1px solid #2a2a2a",
        padding: "5rem 2rem",
        textAlign: "center",
    },

    ctaTitle: {
        color: "#ffffff",
        fontSize: "2rem",
        fontWeight: "800",
        marginBottom: "0.5rem",
    },

    ctaSub: {
        color: "#888888",
        fontSize: "15px",
        marginBottom: "2rem",
    },

    ctaButtons: {
        display: "flex",
        gap: "12px",
        justifyContent: "center",
        flexWrap: "wrap",
    },
};

const features = [
    {
        label: "EQUIPMENT",
        title: "Premium gear",
        desc: "Rogue racks, Eleiko bars, Concept2 rowers, Echo bikes — maintained by an in-house team.",
    },
    {
        label: "CLASSES",
        title: "60+ weekly sessions",
        desc: "HIIT, yoga, Olympic lifting, boxing, mobility — book in seconds, capacity tracked live.",
    },
    {
        label: "COACHING",
        title: "Coached safety",
        desc: "Every class is led by certified coaches. Beginners get personal onboarding sessions.",
    },
    {
        label: "RECOVERY",
        title: "Built-in recovery",
        desc: "Sauna, cold plunge, percussion guns, and a recovery lounge included on Premium plans.",
    },
    {
        label: "TRACKING",
        title: "See progress",
        desc: "Monthly InBody scans on Elite plans. See body composition trends and PRs over time.",
    },
    {
        label: "COMMUNITY",
        title: "Real community",
        desc: "Open gym culture without ego. Member events, partner workouts, and team competitions.",
    },
];

export default function Home() {
    const { user, loading } = useAuth();
    if (loading) return null;

    const hoverBtn = (e, type) => {
        if (type === "primary") {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.opacity = "0.9";
        } else {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = "#a3e635";
            e.currentTarget.style.color = "#a3e635";
        }
    };

    const leaveBtn = (e, type) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.opacity = "1";
        if (type !== "primary") {
            e.currentTarget.style.borderColor = "#333333";
            e.currentTarget.style.color = "#ffffff";
        }
    };

    return (
        <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#09090b" }}>

            {/* HERO */}
            <section style={styles.hero}>
                <p style={styles.heroLabel}>PULSEFIT GYM</p>

                <h1 style={styles.heroTitle}>
                    Push your <span style={styles.heroAccent}>limits</span>.
                    <br />
                    Define your <span style={styles.heroAccent}>legacy</span>.
                </h1>

                <p style={styles.heroSub}>
                   Goals are Made to be Crushed.
                </p>

                <div style={styles.heroButtons}>
                    <Link
                        to="/plans"
                        style={styles.btnPrimary}
                        onMouseEnter={(e) => hoverBtn(e, "primary")}
                        onMouseLeave={(e) => leaveBtn(e, "primary")}
                    >
                        Explore Plans
                    </Link>

                    <Link
                        to="/classes"
                        style={styles.btnOutline}
                        onMouseEnter={(e) => hoverBtn(e, "outline")}
                        onMouseLeave={(e) => leaveBtn(e, "outline")}
                    >
                        View Classes
                    </Link>
                </div>
            </section>

            {/* FEATURES */}
            <section style={styles.features}>
                <h2 style={styles.featuresTitle}>Everything you need</h2>
                <p style={styles.featuresSub}>Designed for athletes, accessible for beginners.</p>

                <div style={styles.grid}>
                    {features.map((f) => (
                        <div
                            key={f.label}
                            style={styles.card}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#a3e635";
                                e.currentTarget.style.boxShadow = "0 0 14px rgba(163,230,53,0.25)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#2a2a2a";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <p style={styles.cardLabel}>{f.label}</p>
                            <h3 style={styles.cardTitle}>{f.title}</h3>
                            <p style={styles.cardDesc}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* MARKET */}
            <div style={styles.marketWrap}>
                <div style={styles.market}>
                    <div>
                        <p style={styles.marketText}>Fuel your training</p>
                        <p style={styles.marketSub}>Supplements and more.</p>
                    </div>

                    <Link
                        to="/market"
                        style={styles.btnMarket}
                        onMouseEnter={(e) => hoverBtn(e, "outline")}
                        onMouseLeave={(e) => leaveBtn(e, "outline")}
                    >
                        Browse Market
                    </Link>
                </div>
            </div>

            {/* CTA */}
            {!user && (
                <section style={styles.cta}>
                    <h2 style={styles.ctaTitle}>Ready to start?</h2>

                    <div style={styles.ctaButtons}>
                        <Link
                            to="/signup"
                            style={styles.btnPrimary}
                            onMouseEnter={(e) => hoverBtn(e, "primary")}
                            onMouseLeave={(e) => leaveBtn(e, "primary")}
                        >
                            Create account
                        </Link>

                        <Link
                            to="/login"
                            style={styles.btnOutline}
                            onMouseEnter={(e) => hoverBtn(e, "outline")}
                            onMouseLeave={(e) => leaveBtn(e, "outline")}
                        >
                            Login
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}