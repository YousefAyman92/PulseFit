function getPeriod(plan) {
  if (plan.category === "Drop-in") return "/day";
  if (plan.category === "Annual")  return "/year";
  return "/month";
}

function isPopular(plan) {
  return plan.title === "Premium Athlete";
}

const s = {
  card: {
    backgroundColor: "#16161a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
  },
  cardPopular: {
    backgroundColor: "#16161a",
    border: "1px solid #a3e635",
    borderRadius: "10px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
  },
  popularBadge: {
    display: "inline-block",
    backgroundColor: "#a3e635",
    color: "#0a0a0a",
    fontSize: "0.65rem",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "0.2rem 0.6rem",
    borderRadius: "20px",
    marginBottom: "0.6rem",
    alignSelf: "flex-start",
  },
  categoryLabel: {
    fontSize: "0.68rem",
    fontWeight: "600",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#a3e635",
    marginBottom: "0.3rem",
  },
  planTitle: {
    fontSize: "1.15rem",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "0.5rem",
  },
  description: {
    fontSize: "0.82rem",
    color: "#888",
    lineHeight: "1.5",
    marginBottom: "1.25rem",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.15rem",
    marginBottom: "1.25rem",
  },
  priceDollar: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.02em",
  },
  pricePeriod: {
    fontSize: "0.8rem",
    color: "#888",
  },
  featuresList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.45rem",
    flexGrow: 1,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.83rem",
    color: "#cccccc",
  },
  check: {
    color: "#a3e635",
    fontSize: "0.85rem",
    flexShrink: 0,
  },
  btnOutline: {
    width: "100%",
    backgroundColor: "transparent",
    border: "1px solid #333",
    color: "#ffffff",
    borderRadius: "7px",
    padding: "0.65rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "auto",
  },
  btnGreen: {
    width: "100%",
    backgroundColor: "#a3e635",
    border: "none",
    color: "#0a0a0a",
    borderRadius: "7px",
    padding: "0.65rem",
    fontSize: "0.875rem",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "auto",
  },
};

function PlanCard({ plan, onSubscribe, subscribing }) {
  const popular = isPopular(plan);
  return (
    <div style={popular ? s.cardPopular : s.card}>
      {popular && <span style={s.popularBadge}>Most Popular</span>}
      <div style={s.categoryLabel}>{plan.category}</div>
      <div style={s.planTitle}>{plan.title}</div>
      <div style={s.description}>{plan.description}</div>
      <div style={s.priceRow}>
        <span style={s.priceDollar}>${plan.price}</span>
        <span style={s.pricePeriod}>{getPeriod(plan)}</span>
      </div>
      <ul style={s.featuresList}>
        {plan.features.map((f, i) => (
          <li key={i} style={s.featureItem}>
            <span style={s.check}>✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button
        style={popular ? s.btnGreen : s.btnOutline}
        onClick={() => onSubscribe(plan)}
        disabled={subscribing === plan._id}
      >
        {subscribing === plan._id ? "Processing..." : "Subscribe"}
      </button>
    </div>
  );
}

export default PlanCard;