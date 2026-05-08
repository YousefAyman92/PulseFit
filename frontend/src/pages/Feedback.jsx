import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const styles = {
    page: {
        minHeight: "calc(100vh - 60px)",
        backgroundColor: "#09090b",
        padding: "4rem 1rem",
    },
    container: {
        maxWidth: "640px",
        margin: "0 auto",
    },
    title: {
        color: "#ffffff",
        fontSize: "2rem",
        fontWeight: "800",
        marginBottom: "0.5rem",
    },
    subtitle: {
        color: "#888888",
        fontSize: "15px",
        marginBottom: "2.5rem",
    },
    card: {
        backgroundColor: "#16161a",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        padding: "2rem",
    },
    starsLabel: {
        color: "#aaaaaa",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.1em",
        marginBottom: "0.6rem",
        display: "block",
    },
    starsRow: {
        display: "flex",
        gap: "8px",
        marginBottom: "1.5rem",
    },
    // star color changes based on hover or selected rating
    star: (active) => ({
        fontSize: "28px",
        cursor: "pointer",
        color: active ? "#a3e635" : "#333333",
        transition: "color 0.15s",
        background: "none",
        border: "none",
        padding: 0,
        lineHeight: 1,
    }),
    label: {
        color: "#aaaaaa",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.1em",
        display: "block",
        marginBottom: "0.4rem",
    },
    // border turns red if there's a validation error
    input: (hasError) => ({
        width: "100%",
        backgroundColor: "#111114",
        border: `1px solid ${hasError ? "#ff6b6b" : "#333333"}`,
        borderRadius: "8px",
        padding: "0.65rem 0.9rem",
        color: "#ffffff",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        marginBottom: "1.25rem",
    }),
    textarea: (hasError) => ({
        width: "100%",
        backgroundColor: "#111114",
        border: `1px solid ${hasError ? "#ff6b6b" : "#333333"}`,
        borderRadius: "8px",
        padding: "0.65rem 0.9rem",
        color: "#ffffff",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        resize: "vertical",
        minHeight: "120px",
        marginBottom: "0.4rem",
        fontFamily: "inherit",
    }),
    errorText: {
        color: "#ff6b6b",
        fontSize: "12px",
        marginBottom: "1rem",
        display: "block",
    },
    btnSubmit: {
        width: "100%",
        backgroundColor: "#a3e635",
        color: "#000000",
        border: "none",
        borderRadius: "8px",
        padding: "0.75rem",
        fontSize: "15px",
        fontWeight: "700",
        cursor: "pointer",
        marginTop: "0.5rem",
    },
    // grayed out while request is loading
    btnDisabled: {
        width: "100%",
        backgroundColor: "#333333",
        color: "#666666",
        border: "none",
        borderRadius: "8px",
        padding: "0.75rem",
        fontSize: "15px",
        fontWeight: "700",
        cursor: "not-allowed",
        marginTop: "0.5rem",
    },
    successBox: {
        backgroundColor: "#16161a",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        padding: "3rem 2rem",
        textAlign: "center",
    },
    successIcon: {
        fontSize: "3rem",
        marginBottom: "1rem",
    },
    successTitle: {
        color: "#22c55e",
        fontSize: "1.4rem",
        fontWeight: "700",
        marginBottom: "0.5rem",
    },
    successSub: {
        color: "#888888",
        fontSize: "14px",
    },
};

export default function Feedback() {
    const { user } = useAuth();

    const [rating, setRating] = useState(5);
    const [hovered, setHovered] = useState(0);
    // pre-fill name if user is logged in
    const [memberName, setMemberName] = useState(user?.fullName || "");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    // switches to success screen after submit
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        // basic validation before sending
        if (!message.trim()) {
            setError("Please write a message before sending.");
            return;
        }
        if (message.trim().length < 5) {
            setError("Message is too short.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await api.post("/feedback", {
                rating,
                memberName: memberName.trim() || "Anonymous",
                message: message.trim(),
            });
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>Send us feedback</h1>
                <p style={styles.subtitle}>
                    Anything from praise to tough criticism — we want it.
                </p>

                {/* show success screen after submitting */}
                {submitted ? (
                    <div style={styles.successBox}>
                        <div style={styles.successIcon}>✅</div>
                        <h2 style={styles.successTitle}>Thank you!</h2>
                        <p style={styles.successSub}>Your feedback has been received.</p>
                    </div>
                ) : (
                    <div style={styles.card}>

                        {/* star rating — highlights on hover */}
                        <span style={styles.starsLabel}>HOW WOULD YOU RATE US?</span>
                        <div style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    style={styles.star(hovered ? star <= hovered : star <= rating)}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        {/* optional name field */}
                        <label style={styles.label}>YOUR NAME (OPTIONAL)</label>
                        <input
                            style={styles.input(false)}
                            type="text"
                            placeholder="Anonymous"
                            value={memberName}
                            onChange={(e) => setMemberName(e.target.value)}
                        />

                        {/* message field — required */}
                        <label style={styles.label}>YOUR MESSAGE</label>
                        <textarea
                            style={styles.textarea(!!error && !message.trim())}
                            placeholder="Tell us what's working and what's not..."
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                if (error) setError("");
                            }}
                        />
                        {error && <span style={styles.errorText}>{error}</span>}

                        {/* submit button — disabled while loading */}
                        <button
                            style={loading ? styles.btnDisabled : styles.btnSubmit}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send feedback"}
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
}
