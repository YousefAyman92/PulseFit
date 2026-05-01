import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { label: "Home",     to: "/" },
  { label: "Plans",    to: "/plans" },
  { label: "Classes",  to: "/classes" },
  { label: "Market",   to: "/market" },
  { label: "Feedback", to: "/feedback" },
];

const styles = {
  nav: {
    backgroundColor: "#09090b",
    borderBottom: "1px solid #1a1a1a",
    height: "60px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  // Max-width container centered inside nav
  inner: {
    maxWidth: "1100px",
    margin: "0 auto",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2rem",
    position: "relative",
  },
  left: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
  },
  logoBox: {
    width: "30px",
    height: "30px",
    backgroundColor: "#a3e635",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "0.85rem",
    color: "#0a0a0a",
    flexShrink: 0,
  },
  logoText: {
    fontSize: "1.05rem",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.01em",
  },
  // Absolutely centered inside the inner container
  center: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "0.1rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: "#aaaaaa",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "400",
    padding: "0.3rem 0.7rem",
    borderRadius: "6px",
    transition: "color 0.15s",
    whiteSpace: "nowrap",
  },
  navLinkActive: {
    color: "#ffffff",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flex: 1,
    justifyContent: "flex-end",
  },
  signInLink: {
    color: "#aaaaaa",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "400",
    padding: "0.3rem 0.5rem",
    transition: "color 0.15s",
  },
  joinBtn: {
    backgroundColor: "#a3e635",
    color: "#0a0a0a",
    border: "none",
    borderRadius: "8px",
    padding: "0.4rem 1.1rem",
    fontSize: "0.875rem",
    fontWeight: "700",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    transition: "background-color 0.15s",
    whiteSpace: "nowrap",
  },
  userText: {
    color: "#aaaaaa",
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
  },
  accountLink: {
    color: "#aaaaaa",
    textDecoration: "none",
    fontSize: "0.9rem",
    padding: "0.3rem 0.5rem",
    transition: "color 0.15s",
  },
  adminLink: {
    color: "#a3e635",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    padding: "0.3rem 0.5rem",
  },
  signOutBtn: {
    background: "none",
    border: "1px solid #2a2a2a",
    color: "#aaaaaa",
    borderRadius: "8px",
    padding: "0.35rem 0.85rem",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s",
    whiteSpace: "nowrap",
  },
};

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const currentPath = window.location.pathname;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>

        {/* LEFT — logo */}
        <div style={styles.left}>
          <Link to="/" style={styles.logoWrap}>
            <div style={styles.logoBox}>P</div>
            <span style={styles.logoText}>PulseFit</span>
          </Link>
        </div>

        {/* CENTER — nav links */}
        <ul style={styles.center}>
          {NAV_LINKS.map((link) => {
            const isActive  = currentPath === link.to;
            const isHovered = hoveredLink === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  style={{
                    ...styles.navLink,
                    ...(isActive || isHovered ? styles.navLinkActive : {}),
                  }}
                  onMouseEnter={() => setHoveredLink(link.to)}
                  onMouseLeave={() => setHoveredLink("")}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* RIGHT — auth */}
        <div style={styles.right}>
          {user ? (
            <>
              <span style={styles.userText}>{user.fullName}</span>
              {user.role === "admin" && (
                <Link to="/admin" style={styles.adminLink}>Admin</Link>
              )}
              <Link to="/account" style={styles.accountLink}>My Account</Link>
              <button style={styles.signOutBtn} onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"  style={styles.signInLink}>Sign in</Link>
              <Link to="/signup" style={styles.joinBtn}>Join now</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;