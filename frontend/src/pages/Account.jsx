import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const styles = {
  page: {
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#09090b",
    padding: "3rem 2rem",
  },
  inner: { maxWidth: "1100px", margin: "0 auto" },
  welcomeName: {
    fontSize: "2.2rem", fontWeight: "700", color: "#ffffff",
    letterSpacing: "-0.02em", marginBottom: "0.3rem",
  },
  email: { fontSize: "0.9rem", color: "#888", marginBottom: "3rem" },
  section: { marginBottom: "2.5rem" },
  sectionHeader: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: "1rem",
  },
  sectionTitle: { fontSize: "1.25rem", fontWeight: "600", color: "#ffffff" },
  sectionLink: { color: "#a3e635", textDecoration: "none", fontSize: "0.875rem", fontWeight: "500" },
  card: { backgroundColor: "#16161a", borderRadius: "10px", overflow: "hidden" },
  row: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1.1rem 1.5rem", borderBottom: "1px solid #222",
  },
  rowLast: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1.1rem 1.5rem",
  },
  rowTitle: { fontSize: "0.95rem", fontWeight: "500", color: "#ffffff", marginBottom: "0.2rem" },
  rowSub:   { fontSize: "0.82rem", color: "#888" },
  rowRight: { display: "flex", alignItems: "center", gap: "0.75rem" },
  // Badges
  badgeActive: {
    backgroundColor: "#0a2a0a", color: "#22c55e", border: "1px solid #22c55e33",
    fontSize: "0.72rem", fontWeight: "600", padding: "0.25rem 0.65rem",
    borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em",
  },
  badgeBooked: {
    backgroundColor: "#0a2a0a", color: "#22c55e", border: "1px solid #22c55e33",
    fontSize: "0.72rem", fontWeight: "600", padding: "0.25rem 0.65rem",
    borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em",
  },
  badgeReserved: {
    backgroundColor: "#0a1a2a", color: "#60a5fa", border: "1px solid #60a5fa33",
    fontSize: "0.72rem", fontWeight: "600", padding: "0.25rem 0.65rem",
    borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em",
  },
  badgePickedUp: {
    backgroundColor: "#1a2e0a", color: "#a3e635", border: "1px solid #a3e63533",
    fontSize: "0.72rem", fontWeight: "600", padding: "0.25rem 0.65rem",
    borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em",
  },
  badgeCancelled: {
    backgroundColor: "#2a1010", color: "#888", border: "1px solid #33333333",
    fontSize: "0.72rem", fontWeight: "600", padding: "0.25rem 0.65rem",
    borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em",
  },
  cancelBtn: {
    background: "none", border: "none", color: "#888", fontSize: "0.875rem",
    cursor: "pointer", transition: "color 0.15s", padding: "0.2rem 0",
  },
  empty: {
    backgroundColor: "#16161a", borderRadius: "10px",
    padding: "2rem 1.5rem", color: "#555", fontSize: "0.9rem", textAlign: "center",
  },
  errorMsg: { color: "#ff6b6b", fontSize: "0.85rem", marginTop: "0.5rem" },
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function formatDateTime(d) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    + " · " + new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function getResBadge(status) {
  if (status === "reserved")  return styles.badgeReserved;
  if (status === "picked_up") return styles.badgePickedUp;
  return styles.badgeCancelled;
}

function Account() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [subscription,   setSubscription]   = useState(null);
  const [bookings,       setBookings]        = useState([]);
  const [reservations,   setReservations]    = useState([]);
  const [loadingSub,     setLoadingSub]      = useState(true);
  const [loadingBook,    setLoadingBook]     = useState(true);
  const [loadingRes,     setLoadingRes]      = useState(true);
  const [error,          setError]           = useState("");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchSubscription();
    fetchBookings();
    fetchReservations();
  }, [user]);

  const fetchSubscription = async () => {
    try { const r = await api.get("/subscriptions/my"); setSubscription(r.data); }
    catch { setSubscription(null); }
    finally { setLoadingSub(false); }
  };
  const fetchBookings = async () => {
    try { const r = await api.get("/bookings/my"); setBookings(r.data); }
    catch { setBookings([]); }
    finally { setLoadingBook(false); }
  };
  const fetchReservations = async () => {
    try { const r = await api.get("/reservations/my"); setReservations(r.data); }
    catch { setReservations([]); }
    finally { setLoadingRes(false); }
  };

  const cancelSubscription = async (id) => {
    try {
      setError("");
      await api.patch(`/subscriptions/${id}/cancel`);
      setSubscription(null);
    } catch (err) { setError(err.response?.data?.message || "Failed to cancel."); }
  };

  const cancelBooking = async (id) => {
    try {
      setError("");
      await api.patch(`/bookings/${id}/cancel`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) { setError(err.response?.data?.message || "Failed to cancel."); }
  };

  const cancelReservation = async (id) => {
    try {
      setError("");
      await api.patch(`/reservations/${id}/cancel`);
      setReservations((prev) =>
        prev.map((r) => r._id === id ? { ...r, status: "cancelled" } : r)
      );
    } catch (err) { setError(err.response?.data?.message || "Failed to cancel."); }
  };

  if (!user) return null;
  const firstName = user.fullName?.split(" ")[0] || user.fullName;

  return (
    <div style={styles.page}>
      <div style={styles.inner}>

        <h1 style={styles.welcomeName}>Welcome, {firstName}</h1>
        <p style={styles.email}>{user.email}</p>
        {error && <p style={styles.errorMsg}>{error}</p>}

        {/* ── Subscriptions ── */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Subscriptions</h2>
            {!subscription && <Link to="/plans" style={styles.sectionLink}>Browse plans</Link>}
          </div>
          {loadingSub ? (
            <div style={styles.empty}>Loading...</div>
          ) : subscription ? (
            <div style={styles.card}>
              <div style={styles.rowLast}>
                <div>
                  <div style={styles.rowTitle}>{subscription.planId?.title}</div>
                  <div style={styles.rowSub}>
                    {formatDate(subscription.startDate)} → {formatDate(subscription.endDate)} · ${subscription.price?.toFixed(2)}
                  </div>
                </div>
                <div style={styles.rowRight}>
                  <span style={styles.badgeActive}>Active</span>
                  <button style={styles.cancelBtn} onClick={() => cancelSubscription(subscription._id)}>Cancel</button>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.empty}>
              No active plan. <Link to="/plans" style={styles.sectionLink}>Browse plans →</Link>
            </div>
          )}
        </div>

        {/* ── Class Bookings ── */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Class bookings</h2>
            <Link to="/classes" style={styles.sectionLink}>Book more</Link>
          </div>
          {loadingBook ? (
            <div style={styles.empty}>Loading...</div>
          ) : bookings.length === 0 ? (
            <div style={styles.empty}>
              No class bookings yet. <Link to="/classes" style={styles.sectionLink}>Browse classes →</Link>
            </div>
          ) : (
            <div style={styles.card}>
              {bookings.map((b, i) => {
                const isLast = i === bookings.length - 1;
                return (
                  <div key={b._id} style={isLast ? styles.rowLast : styles.row}>
                    <div>
                      <div style={styles.rowTitle}>{b.classId?.name}</div>
                      <div style={styles.rowSub}>
                        {b.classId?.scheduledAt ? formatDateTime(b.classId.scheduledAt) : "—"}
                        {b.classId?.instructor ? ` · ${b.classId.instructor}` : ""}
                      </div>
                    </div>
                    <div style={styles.rowRight}>
                      <span style={styles.badgeBooked}>Booked</span>
                      <button style={styles.cancelBtn} onClick={() => cancelBooking(b._id)}>Cancel</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Product Reservations ── */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Product reservations</h2>
            <Link to="/market" style={styles.sectionLink}>Browse market</Link>
          </div>
          {loadingRes ? (
            <div style={styles.empty}>Loading...</div>
          ) : reservations.length === 0 ? (
            <div style={styles.empty}>
              No product reservations yet. <Link to="/market" style={styles.sectionLink}>Browse market →</Link>
            </div>
          ) : (
            <div style={styles.card}>
              {reservations.map((r, i) => {
                const isLast = i === reservations.length - 1;
                return (
                  <div key={r._id} style={isLast ? styles.rowLast : styles.row}>
                    <div>
                      <div style={styles.rowTitle}>{r.productName}</div>
                      <div style={styles.rowSub}>
                        ${r.price?.toFixed(2)} · Reserved {formatDate(r.createdAt)}
                        {r.status === "reserved" && (
                          <span style={{ color: "#60a5fa", marginLeft: "0.5rem" }}>
                            · Pick up at the front desk
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={styles.rowRight}>
                      <span style={getResBadge(r.status)}>
                        {r.status === "picked_up" ? "Picked up" : r.status}
                      </span>
                      {r.status === "reserved" && (
                        <button style={styles.cancelBtn} onClick={() => cancelReservation(r._id)}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Account;