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
      backgroundColor: "#111114",
      border: "1px solid #333333",
      borderRadius: "6px",
      padding: "0.65rem 0.9rem",
      color: "#ffffff",
      fontSize: "0.95rem",
      outline: "none",
      transition: "border-color 0.15s",
    },
    inputFocus: { borderColor: "#a3e635" },
    inputError: { borderColor: "#ff6b6b" },
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
    errorMsg: { fontSize: "0.78rem", color: "#ff6b6b", marginTop: "0.3rem" },
    globalError: {
      backgroundColor: "#2a1010",
      border: "1px solid #5a1a1a",
      color: "#ff6b6b",
      borderRadius: "6px",
      padding: "0.65rem 0.9rem",
      fontSize: "0.85rem",
      marginBottom: "1.25rem",
    },
  };

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Enter a valid email.";
  if (!form.password) errors.password = "Password is required.";
  else if (form.password.length < 8) errors.password = "Password must be at least 8 characters.";
  return errors;
}

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [focused, setFocused] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    setGlobalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent refresh
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/account");
    } catch (err) {
      setGlobalError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    ...styles.input,
    ...(focused === name ? styles.inputFocus : {}),
    ...(fieldErrors[name] ? styles.inputError : {}),
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>Free to join. Pick a plan when you're ready.</p>

        {globalError && <div style={styles.globalError}>{globalError}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputWrap}>
            <label style={styles.label}>Full Name</label>
            <input
              style={inputStyle("fullName")}
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              onFocus={() => setFocused("fullName")}
              onBlur={() => setFocused("")}
            />
            {fieldErrors.fullName && <p style={styles.errorMsg}>{fieldErrors.fullName}</p>}
          </div>

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
            />
            {fieldErrors.email && <p style={styles.errorMsg}>{fieldErrors.email}</p>}
          </div>

          <div style={styles.inputWrap}>
            <label style={styles.label}>Phone (Optional)</label>
            <input
              style={inputStyle("phone")}
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onFocus={() => setFocused("phone")}
              onBlur={() => setFocused("")}
            />
          </div>

          <div style={styles.inputWrap}>
            <label style={styles.label}>Password (Min 8 Chars)</label>
            <input
              style={inputStyle("password")}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              autoComplete="new-password"
            />
            {fieldErrors.password && <p style={styles.errorMsg}>{fieldErrors.password}</p>}
          </div>

          <button
            type="submit"
            style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have one?{" "}
          <Link to="/login" style={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;