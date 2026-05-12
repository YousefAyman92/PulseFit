import { useEffect, useState } from "react";
import api from "../../utils/api";

const STATUS_OPTIONS = ["available", "in_use", "maintenance", "retired"];

const s = {
  topBar: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "2rem",
    gap: "1rem",
  },
  pageTitle: { fontSize: "1.5rem", fontWeight: "700", color: "#ffffff", marginBottom: "0.25rem" },
  pageSubtitle: { fontSize: "0.83rem", color: "#666" },
  topRight: { display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 },
  filterSelect: {
    backgroundColor: "#111114",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "0.5rem 2rem 0.5rem 0.9rem",
    color: "#aaa",
    fontSize: "0.875rem",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.7rem center",
  },
  newBtn: {
    backgroundColor: "#a3e635",
    color: "#0a0a0a",
    border: "none",
    borderRadius: "8px",
    padding: "0.5rem 1.1rem",
    fontSize: "0.875rem",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  tableWrap: {
    backgroundColor: "#111114",
    border: "1px solid #1e1e1e",
    borderRadius: "10px",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "0.75rem 1.25rem",
    fontSize: "0.7rem",
    fontWeight: "600",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "#555",
    borderBottom: "1px solid #1e1e1e",
  },
  td: {
    padding: "0.85rem 1.25rem",
    fontSize: "0.875rem",
    color: "#cccccc",
    borderBottom: "1px solid #1a1a1a",
  },
  tdLast: {
    padding: "0.85rem 1.25rem",
    fontSize: "0.875rem",
    color: "#cccccc",
  },
  badgeAvailable:   { backgroundColor: "#0a2a0a",
    color: "#22c55e",
    border: "1px solid #22c55e33",
    borderRadius: "20px",  
    fontSize: "0.68rem", 
    fontWeight: "600", 
    padding: "0.2rem 0.6rem", 
    textTransform: "uppercase", 
    letterSpacing: "0.04em" },
  badgeMaintenance: { backgroundColor: "#431407", color: "#fb923c", border: "1px solid #f59e0b33", fontSize: "0.68rem", fontWeight: "600", padding: "0.2rem 0.6rem", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.04em" },
  badgeInUse:       { backgroundColor: "#2a1a00",
    color: "#f59e0b",
    border: "1px solid #f59e0b33", fontSize: "0.68rem", fontWeight: "600", padding: "0.2rem 0.6rem", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.04em" },
  badgeRetired:     { backgroundColor: "transparent",
    border: "1px solid #2a2a2a",
    color: "#aaaaaa",
      fontSize: "0.68rem", 
      fontWeight: "600", 
      padding: "0.2rem 0.6rem", 
      borderRadius: "20px", 
      textTransform: "uppercase", 
      letterSpacing: "0.04em" },
  actionBtn: { background: "none", border: "none", fontSize: "0.83rem", cursor: "pointer", marginLeft: "0.75rem", padding: 0 },
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem" },
  modal: { backgroundColor: "#16161a", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "2rem", width: "100%", maxWidth: "480px" },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" },
  modalTitle: { fontSize: "1.1rem", fontWeight: "600", color: "#ffffff" },
  closeBtn: { background: "none", border: "none", color: "#888", fontSize: "0.875rem", cursor: "pointer" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  formFull: { gridColumn: "1 / -1" },
  label: { display: "block", fontSize: "0.68rem", fontWeight: "600", letterSpacing: "0.08em", color: "#888", textTransform: "uppercase", marginBottom: "0.4rem" },
  input: { width: "100%", backgroundColor: "#111114", border: "1px solid #333", borderRadius: "6px", padding: "0.6rem 0.8rem", color: "#ffffff", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" },
  select: { width: "100%", backgroundColor: "#111114", border: "1px solid #333", borderRadius: "6px", padding: "0.6rem 0.8rem", color: "#ffffff", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", backgroundColor: "#111114", border: "1px solid #333", borderRadius: "6px", padding: "0.6rem 0.8rem", color: "#ffffff", fontSize: "0.875rem", outline: "none", resize: "vertical", minHeight: "80px", boxSizing: "border-box", fontFamily: "inherit" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" },
  cancelBtn: { background: "none", border: "1px solid #333", color: "#aaa", borderRadius: "7px", padding: "0.55rem 1.1rem", fontSize: "0.875rem", cursor: "pointer" },
  saveBtn: { backgroundColor: "#a3e635", border: "none", color: "#0a0a0a", borderRadius: "7px", padding: "0.55rem 1.25rem", fontSize: "0.875rem", fontWeight: "700", cursor: "pointer" },
  errorMsg: { color: "#ff6b6b", fontSize: "0.82rem", marginBottom: "1rem" },
};

function getStatusBadge(status) {
  switch (status) {
    case "available":   return s.badgeAvailable;
    case "maintenance": return s.badgeMaintenance;
    case "in_use":      return s.badgeInUse;
    case "retired":     return s.badgeRetired;
    default:            return s.badgeRetired;
  }
}

const emptyForm = { name: "", category: "Cardio", location: "", status: "available", notes: "" };

function AdminEquipment() {
  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editing,     setEditing]     = useState(null);
  const [form,        setForm]        = useState(emptyForm);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/equipment");
      setItems(res.data);
    } catch { setItems([]); }
    finally  { setLoading(false); }
  };

  const displayed = statusFilter === "all"
    ? items
    : items.filter((i) => i.status === statusFilter);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, category: item.category, location: item.location, status: item.status, notes: item.notes || "" });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); setError(""); };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.name || !form.location) { setError("Name and location are required."); return; }
    try {
      setSaving(true); setError("");
      editing
        ? await api.put(`/equipment/${editing._id}`, form)
        : await api.post("/equipment", form);
      await fetchItems();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this equipment?")) return;
    try {
      await api.delete(`/equipment/${id}`);
      setItems((p) => p.filter((i) => i._id !== id));
    } catch (err) { alert(err.response?.data?.message || "Failed to delete."); }
  };

  return (
    <>
      <div style={s.topBar}>
        <div>
          <h1 style={s.pageTitle}>Equipment</h1>
          <p style={s.pageSubtitle}>Track every piece of gear and its operational status.</p>
        </div>
        <div style={s.topRight}>
          <select
            style={s.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="available">Available</option>
            <option value="in_use">In use</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
          <button style={s.newBtn} onClick={openNew}>+ New item</button>
        </div>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {["Name","Category","Location","Status","Notes",""].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ ...s.td, color: "#555", textAlign: "center" }}>Loading...</td></tr>
            ) : displayed.map((item, i) => {
              const isLast = i === displayed.length - 1;
              const cell = isLast ? s.tdLast : s.td;
              return (
                <tr key={item._id}>
                  <td style={{ ...cell, fontWeight: "500", color: "#fff" }}>{item.name}</td>
                  <td style={cell}>{item.category}</td>
                  <td style={cell}>{item.location}</td>
                  <td style={cell}>
                    <span style={getStatusBadge(item.status)}>
                      {item.status === "in_use" ? "In Use" : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ ...cell, color: "#555" }}>{item.notes || "—"}</td>
                  <td style={{ ...cell, textAlign: "right", whiteSpace: "nowrap" }}>
                    <button style={{ ...s.actionBtn, color: "#888" }} onClick={() => openEdit(item)}>Edit</button>
                    <button style={{ ...s.actionBtn, color: "#ff6b6b" }} onClick={() => handleDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>{editing ? "Edit equipment" : "New equipment"}</span>
              <button style={s.closeBtn} onClick={closeModal}>Close</button>
            </div>
            {error && <div style={s.errorMsg}>{error}</div>}
            <div style={s.formGrid}>
              <div>
                <label style={s.label}>Name</label>
                <input style={s.input} name="name" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Category</label>
                <input style={s.input} name="category" value={form.category} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Location</label>
                <input style={s.input} name="location" value={form.location} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Status</label>
                <select style={s.select} name="status" value={form.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o === "in_use" ? "In Use" : o.charAt(0).toUpperCase() + o.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div style={s.formFull}>
                <label style={s.label}>Notes</label>
                <textarea style={s.textarea} name="notes" value={form.notes} onChange={handleChange} />
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

export default AdminEquipment;