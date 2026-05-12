import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import PlanCard from "../components/PlanCard";

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

function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    api
      .get("/plans")
      .then((res) => setPlans(res.data))
      .catch(() => setFetchError("Failed to load plans."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (plan) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setSubscribing(plan._id);
      setActionError("");
      setSuccessMsg("");

      await api.post("/subscriptions", {
        planId: plan._id,
      });

      setSuccessMsg(`Successfully subscribed to ${plan.title}!`);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Subscription failed."
      );
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return <div style={s.loading}>Loading plans...</div>;
  }

  if (fetchError) {
    return <div style={s.error}>{fetchError}</div>;
  }

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <div style={s.header}>
          <h1 style={s.title}>Membership plans</h1>
          <p style={s.subtitle}>
            Flexible options for every level of commitment.
          </p>
        </div>

        {successMsg && (
          <div style={s.successMsg}>{successMsg}</div>
        )}

        {actionError && (
          <div style={s.errorMsg}>{actionError}</div>
        )}

        <div style={s.grid}>
          {plans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              onSubscribe={handleSubscribe}
              subscribing={subscribing}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Plans;