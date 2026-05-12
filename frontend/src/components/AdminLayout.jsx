import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard",       to: "/admin" },
  { label: "Plans",           to: "/admin/plans" },
  { label: "Members",         to: "/admin/members" },
  { label: "Classes",         to: "/admin/classes" },
  { label: "Equipment",       to: "/admin/equipment" },
  { label: "Market Products", to: "/admin/products" },
  { label: "Feedback",        to: "/admin/feedback" },
];

const s = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#09090b",
  },
  sidebar: {
    width: "170px",
    flexShrink: 0,
    backgroundColor: "#0f0f11",
    borderRight: "1px solid #1a1a1a",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 50,
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1.1rem 1.1rem 0.75rem",
    textDecoration: "none",
  },
  logoText: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#ffffff",
  },
  sectionLabel: {
    fontSize: "0.65rem",
    fontWeight: "600",
    letterSpacing: "0.1em",
    color: "#555",
    textTransform: "uppercase",
    padding: "1rem 1.1rem 0.4rem",
  },
  navLink: {
    display: "block",
    padding: "0.5rem 1.1rem",
    fontSize: "0.875rem",
    textDecoration: "none",
    borderRadius: "6px",
    margin: "1px 0.5rem",
    transition: "background 0.15s, color 0.15s",
    color: "#888",
  },
  navLinkActive: {
    backgroundColor: "#1a2e0a",
    color: "#a3e635",
    fontWeight: "500",
  },
  bottom: {
    marginTop: "auto",
    padding: "1rem 1.1rem",
    borderTop: "1px solid #1a1a1a",
  },
  adminName: {
    fontSize: "0.8rem",
    fontWeight: "500",
    color: "#ccc",
    marginBottom: "0.15rem",
  },
  adminEmail: {
    fontSize: "0.72rem",
    color: "#555",
    marginBottom: "0.75rem",
  },
  bottomLinks: {
    display: "flex",
    gap: "0.75rem",
  },
  bottomLink: {
    fontSize: "0.78rem",
    color: "#888",
    textDecoration: "none",
    transition: "color 0.15s",
  },
  main: {
    marginLeft: "170px",
    flex: 1,
    padding: "2rem 2.5rem",
    minHeight: "100vh",
  },
};

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={s.wrapper}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <Link to="/admin" style={s.logoWrap}>
         <img src="/logo.svg" alt="PulseFit logo" width="40" height="40" />
         <span style={s.logoText}>PulseFit</span>
        </Link>

        <span style={s.sectionLabel}>Manage</span>

        <nav>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.to === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{ ...s.navLink, ...(isActive ? s.navLinkActive : {}) }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={s.bottom}>
          <div style={s.adminName}>{user?.fullName}</div>
          <div style={s.adminEmail}>{user?.email}</div>
          <div style={s.bottomLinks}>
            <Link to="/" style={s.bottomLink}>Public site</Link>
            <button
              onClick={handleSignOut}
              style={{ ...s.bottomLink, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={s.main}>{children}</main>
    </div>
  );
}

export default AdminLayout;