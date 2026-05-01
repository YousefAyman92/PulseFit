import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const s = {
  page: {
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#09090b",
    padding: "3rem 2rem",
  },
  inner: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "2.5rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.02em",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#888",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
  },
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
    flexGrow: 0,
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
    transition: "border-color 0.15s, background 0.15s",
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
    transition: "opacity 0.15s",
    marginTop: "auto",
  },
  loading: {
    textAlign: "center",
    color: "#888",
    padding: "3rem",
  },
  error: {
    textAlign: "center",
    color: "#ff6b6b",
    padding: "3rem",
  },
  successMsg: {
    backgroundColor: "#0f2d1a",
    border: "1px solid #166534",
    color: "#4ade80",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  errorMsg: {
    backgroundColor: "#2a1010",
    border: "1px solid #5a1a1a",
    color: "#ff6b6b",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
};

function getPeriod(plan) {
  if (plan.category === "Drop-in") return "/day";
  if (plan.category === "Annual")  return "/year";
  return "/month";
}

function isPopular(plan) {
  return plan.title === "Premium Athlete";
}

function Plans() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [plans, setPlans]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [actionError, setActionError]     = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    api.get("/plans")
      .then((res) => setPlans(res.data))
      .catch(() => setFetchError("Failed to load plans."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (plan) => {
    if (!user) { navigate("/login"); return; }
    try {
      setSubscribing(plan._id);
      setActionError("");
      setSuccessMsg("");
      await api.post("/subscriptions", { planId: plan._id });
      setSuccessMsg(`Successfully subscribed to ${plan.title}!`);
    } catch (err) {
      setActionError(err.response?.data?.message || "Subscription failed.");
    } finally {
      setSubscribing(null);
    }
  };

  if (loading)    return <div style={s.loading}>Loading plans...</div>;
  if (fetchError) return <div style={s.error}>{fetchError}</div>;

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <div style={s.header}>
          <h1 style={s.title}>Membership plans</h1>
          <p style={s.subtitle}>Flexible options for every level of commitment.</p>
        </div>

        {successMsg  && <div style={s.successMsg}>{successMsg}</div>}
        {actionError && <div style={s.errorMsg}>{actionError}</div>}

        <div style={s.grid}>
          {plans.map((plan) => {
            const popular = isPopular(plan);
            const cardStyle = popular ? s.cardPopular : s.card;
            return (
              <div key={plan._id} style={cardStyle}>
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
                  onClick={() => handleSubscribe(plan)}
                  disabled={subscribing === plan._id}
                >
                  {subscribing === plan._id ? "Processing..." : "Subscribe"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Plans;