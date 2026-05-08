function FeedbackCard({ name, rating, message, date }) {
  return (
    <div style={{
      backgroundColor: "#16161a",
      border: "1px solid #2a2a2a",
      borderRadius: "12px",
      padding: "1.5rem",
      marginBottom: "1rem",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <span style={{ color: "#ffffff", fontWeight: "600", fontSize: "15px" }}>
          {name || "Anonymous"}
        </span>
        {/* Stars */}
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} style={{ color: star <= rating ? "#a3e635" : "#333333", fontSize: "16px" }}>
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Message */}
      <p style={{ color: "#888888", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
        {message}
      </p>

      {/* Date */}
      {date && (
        <p style={{ color: "#444", fontSize: "12px", marginTop: "0.75rem", marginBottom: 0 }}>
          {new Date(date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export default FeedbackCard;