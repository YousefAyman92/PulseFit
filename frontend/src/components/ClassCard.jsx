const s = {
  card: {
    backgroundColor: "#16161a",
    border: "1px solid #1e1e1e",
    borderRadius: "10px",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeLabel: {
    fontSize: "0.65rem",
    fontWeight: "600",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#a3e635",
  },
  intensityBadge: {
    fontSize: "0.65rem",
    fontWeight: "700",
    padding: "0.18rem 0.55rem",
    borderRadius: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  name: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#ffffff",
    lineHeight: "1.3",
  },
  description: {
    fontSize: "0.8rem",
    color: "#888",
    lineHeight: "1.5",
  },
  metaBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
    marginTop: "0.25rem",
  },
  metaRow: {
    fontSize: "0.8rem",
    color: "#888",
  },
  seatsRow: {
    fontSize: "0.8rem",
    color: "#aaa",
    marginTop: "0.1rem",
  },
  bookBtn: {
    width: "100%",
    backgroundColor: "#a3e635",
    color: "#0a0a0a",
    border: "none",
    borderRadius: "6px",
    padding: "0.6rem",
    fontSize: "0.83rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "0.25rem",
    transition: "opacity 0.15s",
  },
  bookBtnLoading: { opacity: 0.6, cursor: "not-allowed" },
  bookBtnFull:   { backgroundColor: "#1e1e1e", color: "#444", cursor: "not-allowed" },
  bookBtnBooked: { backgroundColor: "#14532d", color: "#4ade80", cursor: "default" },
  signInBtn: {
    width: "100%",
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid #333",
    borderRadius: "6px",
    padding: "0.6rem",
    fontSize: "0.83rem",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "0.25rem",
  },
};

const INTENSITY_COLORS = {
  high:     { backgroundColor: "transparent",
    border: "1px solid #ff6b6b33",
    color: "#ff6b6b",
    borderRadius: "20px",
    padding: "4px 12px",
    fontSize: "12px",
    cursor: "pointer", },
  moderate: { backgroundColor: "#2a1a00",
    color: "#f59e0b",
    border: "1px solid #f59e0b33",
    borderRadius: "20px",
    padding: "2px 10px",
    fontSize: "11px",
    fontWeight: "700", },
  low:      { backgroundColor: "#0a2a0a",
    color: "#22c55e",
    border: "1px solid #22c55e33",
    borderRadius: "20px",
    padding: "2px 10px",
    fontSize: "11px",
    fontWeight: "700", },
};

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}

function ClassCard({ gymClass, isBooked, onBook, onSignIn, booking, user }) {
  const seatsLeft = gymClass.capacity - gymClass.enrolled;
  const isFull    = seatsLeft <= 0;
  const isBooking = booking === gymClass._id;

  const getBtn = () => {
    if (!user) {
      return (
        <button style={s.signInBtn} onClick={onSignIn}>
          Sign in to book
        </button>
      );
    }
    if (isBooked) {
      return (
        <button style={{ ...s.bookBtn, ...s.bookBtnBooked }} disabled>
          ✓ Booked
        </button>
      );
    }
    if (isFull) {
      return (
        <button style={{ ...s.bookBtn, ...s.bookBtnFull }} disabled>
          Class full
        </button>
      );
    }
    return (
      <button
        style={{ ...s.bookBtn, ...(isBooking ? s.bookBtnLoading : {}) }}
        disabled={isBooking}
        onClick={() => onBook(gymClass)}
      >
        {isBooking ? "Booking..." : "Book class"}
      </button>
    );
  };

  return (
    <div style={s.card}>
      <div style={s.topRow}>
        <span style={s.typeLabel}>{gymClass.type}</span>
        <span style={{
          ...s.intensityBadge,
          ...INTENSITY_COLORS[gymClass.intensity] || INTENSITY_COLORS.low,
        }}>
          {gymClass.intensity?.toUpperCase()}
        </span>
      </div>

      <div style={s.name}>{gymClass.name}</div>
      {gymClass.description && (
        <div style={s.description}>{gymClass.description}</div>
      )}

      <div style={s.metaBlock}>
        <div style={s.metaRow}>
          {formatDateTime(gymClass.scheduledAt)}
        </div>
        <div style={s.metaRow}>
          {gymClass.durationMinutes} min · {gymClass.instructor}
        </div>
        <div style={s.seatsRow}>
          {isFull ? "No seats left" : `${seatsLeft} of ${gymClass.capacity} seats left`}
        </div>
      </div>

      {getBtn()}
    </div>
  );
}

export default ClassCard;