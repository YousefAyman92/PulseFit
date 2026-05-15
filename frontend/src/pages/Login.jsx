import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const styles = {
    page: {
        minHeight: "calc(100vh - 60px)",
        backgroundColor: "#09090b",
        display: "flex",
        alignItems: "flex-start", 
        justifyContent: "center",
        paddingTop: "80px",
        paddingBottom: "2rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
      card: {
        backgroundColor: "#16161a",
        border: "1px solid #2a2a2a",
        borderRadius: "12px",
        padding: "2.5rem 2rem",
        width: "100%",
        maxWidth: "440px",
      },
  title: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "0.4rem",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#888",
    marginBottom: "2rem",
  },
  label: {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: "600",
    letterSpacing: "0.08em",
    color: "#aaa",
    marginBottom: "0.4rem",
    textTransform: "uppercase",
  },
  inputWrap: { marginBottom: "1.25rem" },
  input: {
    width: "100%",
    backgroundColor: "#141414",
    border: "1px solid #333333",
    borderRadius: "6px",
    padding: "0.65rem 0.9rem",
    color: "#ffffff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.15s",
  },
  inputFocus: { borderColor: "#a3e635" },
  btn: {
    width: "100%",
    backgroundColor: "#a3e635",
    color: "#0a0a0a",
    fontWeight: "700",
    fontSize: "0.95rem",
    border: "none",
    borderRadius: "6px",
    padding: "0.75rem",
    cursor: "pointer",
    marginTop: "0.5rem",
    marginBottom: "1.25rem",
    transition: "opacity 0.15s",
  },
  btnDisabled: { opacity: 0.6, cursor: "not-allowed" },
  footer: { fontSize: "0.875rem", color: "#888" },
  link: { color: "#a3e635", textDecoration: "none", fontWeight: "500" },
  error: {
    backgroundColor: "#2a1010",
    border: "1px solid #5a1a1a",
    color: "#ff6b6b",
    borderRadius: "6px",
    padding: "0.65rem 0.9rem",
    fontSize: "0.85rem",
    marginBottom: "1.25rem",
  },
  demoBox: {
    backgroundColor: "#141414",
    borderLeft: "3px solid #a3e635",
    borderRadius: "4px",
    padding: "0.75rem 1rem",
    marginTop: "1.25rem",
    fontSize: "0.8rem",
    color: "#888",
    lineHeight: "1.7",
  },
  demoTitle: { color: "#ccc", fontWeight: "600", marginBottom: "0.2rem" },
};

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      res.data.user.role === "admin" ? navigate("/admin") : navigate("/account");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    ...styles.input,
    ...(focused === name ? styles.inputFocus : {}),
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sign in</h1>
        <p style={styles.subtitle}>Welcome back. Let's get to work.</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputWrap}>
            <label style={styles.label}>Email</label>
            <input
              style={inputStyle("email")}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              autoComplete="email"
            />
          </div>

          <div style={styles.inputWrap}>
            <label style={styles.label}>Password</label>
            <input
              style={inputStyle("password")}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={styles.footer}>
          New here?{" "}
          <Link to="/signup" style={styles.link}>
            Create an account
          </Link>
        </p>

        <div style={styles.demoBox}>
          <div style={styles.demoTitle}>Demo accounts</div>
          <div>Admin: admin@gmail.com / Test#1234</div>
          <div>Member: member@gmail.com / Test#1234</div>
        </div>
      </div>
    </div>
  );
}

export default Login;