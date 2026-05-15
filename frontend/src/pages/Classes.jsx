import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/Toast";
import ClassCard from "../components/ClassCard";
import api from "../utils/api";

const TYPE_FILTERS = ["All types", "Strength", "Cycling", "Mobility", "Boxing", "Yoga", "HIIT"];

const s = {
  page: {
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#09090b",
    padding: "2.5rem 2rem 4rem",
  },
  inner: { maxWidth: "1100px", margin: "0 auto" },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.02em",
    marginBottom: "0.35rem",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#888",
    marginBottom: "2rem",
  },
  filtersRow: {
    display: "flex",
    gap: "0.4rem",
    flexWrap: "wrap",
    marginBottom: "1.75rem",
  },
  tab: {
    padding: "0.35rem 0.9rem",
    borderRadius: "20px",
    fontSize: "0.82rem",
    fontWeight: "500",
    cursor: "pointer",
    border: "1px solid #2a2a2a",
    backgroundColor: "transparent",
    color: "#888",
    transition: "all 0.15s",
  },
  tabActive: {
    backgroundColor: "#a3e635",
    color: "#0a0a0a",
    border: "1px solid #a3e635",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
  },
  empty: {
    color: "#555",
    fontSize: "0.9rem",
    padding: "3rem 0",
    textAlign: "center",
    gridColumn: "1 / -1",
  },
};

function Classes() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [classes,     setClasses]    = useState([]);
  const [bookedIds,   setBookedIds]  = useState(new Set());
  const [bookingId,   setBookingId]  = useState(null);
  const [activeFilter,setActiveFilter] = useState("All types");
  const [loading,     setLoading]    = useState(true);

  useEffect(() => {
    fetchClasses();
    if (user) fetchMyBookings();
  }, [user]);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch {
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await api.get("/bookings/my");
      const ids = new Set(res.data.map((b) => b.classId?._id || b.classId));
      setBookedIds(ids);
    } catch {
      setBookedIds(new Set());
    }
  };

  const handleBook = async (gymClass) => {
    try {
      setBookingId(gymClass._id);
      await api.post("/bookings", { classId: gymClass._id });

      // Update enrolled count locally
      setClasses((prev) =>
        prev.map((c) =>
          c._id === gymClass._id
            ? { ...c, enrolled: c.enrolled + 1 }
            : c
        )
      );
      setBookedIds((prev) => new Set([...prev, gymClass._id]));
      showToast(`${gymClass.name} booked! See you there.`);
    } catch (err) {
      showToast(err.response?.data?.message || "Booking failed.", "error");
    } finally {
      setBookingId(null);
    }
  };

  const filtered =
    activeFilter === "All types"
      ? classes
      : classes.filter(
          (c) => c.type.toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <h1 style={s.title}>Upcoming classes</h1>
        <p style={s.subtitle}>Discover and join upcoming sessions with ease.</p>

        <div style={s.filtersRow}>
          {TYPE_FILTERS.map((f) => (
            <button
              key={f}
              style={{ ...s.tab, ...(activeFilter === f ? s.tabActive : {}) }}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={s.grid}>
          {loading ? (
            <div style={s.empty}>Loading classes...</div>
          ) : filtered.length === 0 ? (
            <div style={s.empty}>No classes found.</div>
          ) : (
            filtered.map((gymClass) => (
              <ClassCard
                key={gymClass._id}
                gymClass={gymClass}
                user={user}
                isBooked={bookedIds.has(gymClass._id)}
                booking={bookingId}
                onBook={handleBook}
                onSignIn={() => navigate("/login")}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Classes;