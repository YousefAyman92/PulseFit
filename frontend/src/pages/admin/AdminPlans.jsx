import { useEffect, useState } from "react";
import api from "../../utils/api";

const s = {
  topBar: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem" },
  pageTitle: { fontSize: "1.5rem", fontWeight: "700", color: "#ffffff", marginBottom: "0.25rem" },
  pageSubtitle: { fontSize: "0.83rem", color: "#666" },
  newBtn: { backgroundColor: "#a3e635", color: "#0a0a0a", border: "none", borderRadius: "8px", padding: "0.5rem 1.1rem", fontSize: "0.875rem", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" },
  tableWrap: { backgroundColor: "#111114", border: "1px solid #1e1e1e", borderRadius: "10px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "0.75rem 1.25rem", fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.07em", textTransform: "uppercase", color: "#555", borderBottom: "1px solid #1e1e1e" },
  td: { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#cccccc", borderBottom: "1px solid #1a1a1a" },
  tdLast: { padding: "0.9rem 1.25rem", fontSize: "0.875rem", color: "#cccccc" },
  badgeActive: { backgroundColor: "#0a2a0a", color: "#22c55e", border: "1px solid #22c55e33", fontSize: "0.68rem", fontWeight: "600", padding: "0.2rem 0.6rem", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em" },
  badgeInactive: { backgroundColor: "transparent", border: "1px solid #2a2a2a", color: "#aaaaaa", fontSize: "0.68rem", fontWeight: "600", padding: "0.2rem 0.6rem", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em" },
  editBtn: { background: "none", border: "none", color: "#888", fontSize: "0.83rem", cursor: "pointer", marginRight: "0.75rem", transition: "color 0.15s" },
  deleteBtn: { background: "none", border: "none", color: "#ff6b6b", fontSize: "0.83rem", cursor: "pointer", transition: "opacity 0.15s" },
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem" },
  modal: { backgroundColor: "#16161a", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "2rem", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" },
  modalTitle: { fontSize: "1.1rem", fontWeight: "600", color: "#ffffff" },
  closeBtn: { background: "none", border: "none", color: "#888", fontSize: "0.9rem", cursor: "pointer" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  formFull: { gridColumn: "1 / -1" },
  label: { display: "block", fontSize: "0.68rem", fontWeight: "600", letterSpacing: "0.08em", color: "#888", textTransform: "uppercase", marginBottom: "0.4rem" },
  input: { width: "100%", backgroundColor: "#111114", border: "1px solid #333", borderRadius: "6px", padding: "0.6rem 0.8rem", color: "#ffffff", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", backgroundColor: "#111114", border: "1px solid #333", borderRadius: "6px", padding: "0.6rem 0.8rem", color: "#ffffff", fontSize: "0.875rem", outline: "none", resize: "vertical", minHeight: "90px", boxSizing: "border-box", fontFamily: "inherit" },
  select: { width: "100%", backgroundColor: "#111114", border: "1px solid #333", borderRadius: "6px", padding: "0.6rem 0.8rem", color: "#ffffff", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" },
  cancelBtn: { background: "none", border: "1px solid #333", color: "#aaa", borderRadius: "7px", padding: "0.55rem 1.1rem", fontSize: "0.875rem", cursor: "pointer" },
  saveBtn: { backgroundColor: "#a3e635", border: "none", color: "#0a0a0a", borderRadius: "7px", padding: "0.55rem 1.25rem", fontSize: "0.875rem", fontWeight: "700", cursor: "pointer" },
  errorMsg: { color: "#ff6b6b", fontSize: "0.82rem", marginBottom: "1rem" },
};

const emptyForm = {
  title: "", category: "Monthly", price: "",
  durationDays: "30", description: "", features: "", isActive: true,
};

function AdminPlans() {

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/plans?all=true");
      setPlans(res.data);
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditingPlan(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      title: plan.title,
      category: plan.category,
      price: String(plan.price),
      durationDays: String(plan.durationDays),
      description: plan.description || "",
      features: plan.features?.join("\n") || "",
      isActive: plan.isActive,
    });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPlan(null);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value,
    }));
  };

  const handleSave = async () => {
    if (!form.title || !form.price) {
      setError("Title and price are required.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const payload = {
        title: form.title,
        category: form.category,
        price: Number(form.price),
        durationDays: Number(form.durationDays),
        description: form.description,
        features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
        isActive: form.isActive,
      };
      if (editingPlan) {
        await api.put(`/plans/${editingPlan._id}`, payload);
      } else {
        await api.post("/plans", payload);
      }
      await fetchPlans();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save plan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await api.delete(`/plans/${id}`);
      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete.");
    }
  };

  return (
    <>
      <div style={s.topBar}>
        <div>
          <h1 style={s.pageTitle}>Plans</h1>
          <p style={s.pageSubtitle}>Manage subscription tiers and pricing options for members.</p>
        </div>
        <button style={s.newBtn} onClick={openNew}>+ New plan</button>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {["Title", "Category", "Price", "Duration", "Features", "Active", ""].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ ...s.td, color: "#555", textAlign: "center" }}>Loading...</td></tr>
            ) : plans.map((plan, i) => {
              const isLast = i === plans.length - 1;
              const cell = isLast ? s.tdLast : s.td;
              return (
                <tr key={plan._id}>
                  <td style={{ ...cell, color: "#ffffff", fontWeight: "500" }}>{plan.title}</td>
                  <td style={cell}>{plan.category}</td>
                  <td style={cell}>${plan.price}</td>
                  <td style={cell}>{plan.durationDays}d</td>
                  <td style={cell}>{plan.features?.length ?? 0} included</td>
                  <td style={cell}>
                    <span style={plan.isActive ? s.badgeActive : s.badgeInactive}>
                      {plan.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ ...cell, textAlign: "right" }}>
                    <button style={s.editBtn} onClick={() => openEdit(plan)}>Edit</button>
                    <button style={s.deleteBtn} onClick={() => handleDelete(plan._id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>{editingPlan ? "Edit plan" : "New plan"}</span>
              <button style={s.closeBtn} onClick={closeModal}>Close</button>
            </div>

            {error && <div style={s.errorMsg}>{error}</div>}

            <div style={s.formGrid}>
              <div>
                <label style={s.label}>Title</label>
                <input style={s.input} name="title" value={form.title} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Category</label>
                <select style={s.select} name="category" value={form.category} onChange={handleChange}>
                  <option>Drop-in</option>
                  <option>Monthly</option>
                  <option>Annual</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Price (USD)</label>
                <input style={s.input} name="price" type="number" value={form.price} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Duration (Days)</label>
                <input style={s.input} name="durationDays" type="number" value={form.durationDays} onChange={handleChange} />
              </div>
              <div style={s.formFull}>
                <label style={s.label}>Description</label>
                <textarea style={s.textarea} name="description" value={form.description} onChange={handleChange} />
              </div>
              <div style={s.formFull}>
                <label style={s.label}>Features (one per line)</label>
                <textarea style={s.textarea} name="features" value={form.features} onChange={handleChange} />
              </div>
              <div style={s.formFull}>
                <label style={s.label}>Active</label>
                <select style={s.select} name="isActive" value={String(form.isActive)} onChange={handleChange}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div style={s.modalFooter}>
              <button style={s.cancelBtn} onClick={closeModal}>Cancel</button>
              <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminPlans;