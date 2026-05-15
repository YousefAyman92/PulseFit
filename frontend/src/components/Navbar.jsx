import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = {
  logoWrap: { display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" },
  logoText: { color: "#ffffff", fontWeight: "700", fontSize: "1rem" },
  nav: {
    background: "transparent",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    height: "60px",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 100,
    backdropFilter: "blur(8px)",
    transition: "transform 0.3s ease-in-out",
  },
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
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "400",
    padding: "0.3rem 0.7rem",
    borderRadius: "6px",
    transition: "color 0.15s",
    whiteSpace: "nowrap",
    color: "#aaaaaa",
  },
  navLinkActive: { color: "#a3e635", fontWeight: "500" },
  navLinkHover: { color: "#ffffff" },
  right: { display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, justifyContent: "flex-end" },
  signInLink: { color: "#aaaaaa", textDecoration: "none", fontSize: "0.9rem", padding: "0.3rem 0.5rem" },
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
  },
  userText: { color: "#aaaaaa", fontSize: "0.875rem" },
  signOutBtn: { background: "none", border: "none", color: "#aaaaaa", fontSize: "0.9rem", cursor: "pointer" },
  adminLink: { color: "#a3e635", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500" },
};

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState("");
  

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Hide if scrolling down
      setHidden(currentY > lastY && currentY > 50);
      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const navLinks = (user ? [
    { label: "Home", to: "/" },
    { label: "Plans", to: "/plans" },
    { label: "Classes", to: "/classes" },
    { label: "Market", to: "/market" },
    { label: "Feedback", to: "/feedback" },
    { label: "My Account", to: "/account" },
  ] : [
    { label: "Home", to: "/" },
    { label: "Plans", to: "/plans" },
    { label: "Classes", to: "/classes" },
    { label: "Market", to: "/market" },
    { label: "Feedback", to: "/feedback" },
  ]);

  const getLinkStyle = (to) => {
    const isActive = location.pathname === to;
    return {
      ...styles.navLink,
      ...(isActive ? styles.navLinkActive : {}),
      ...(hoveredLink === to && !isActive ? styles.navLinkHover : {}),
    };
  };

  return (
    <nav style={{ 
      ...styles.nav, 
      transform: hidden ? "translateY(-100%)" : "translateY(0)" 
    }}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logoWrap}>
          <img src="/logo.svg" alt="logo" width="40" height="40" />
          <span style={styles.logoText}>PulseFit</span>
        </Link>

        <ul style={styles.center}>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                style={getLinkStyle(link.to)}
                onMouseEnter={() => setHoveredLink(link.to)}
                onMouseLeave={() => setHoveredLink("")}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={styles.right}>
          {user ? (
            <>
              {user.role === "admin" && <Link to="/admin" style={styles.adminLink}>Admin</Link>}
              <span style={styles.userText}>{user.fullName}</span>
              <button style={styles.signOutBtn} onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.signInLink}>Sign in</Link>
              <Link to="/signup" style={styles.joinBtn}>Join now</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;