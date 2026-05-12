import { useEffect, useState } from "react";
import api from "../../utils/api";

const TYPE_OPTIONS      = ["HIIT", "Yoga", "Strength", "Cycling", "Mobility", "Boxing"];
const INTENSITY_OPTIONS = ["low", "moderate", "high"];

const INTENSITY_COLORS = {
  high:     {  backgroundColor: "transparent",
    border: "1px solid #ff6b6b33",
    color: "#ff6b6b",
    borderRadius: "20px",
    fontSize: "0.68rem",
    fontWeight: "600",
    padding: "0.2rem 0.6rem",
    borderRadius: "20px",
    textTransform: "uppercase",
    letterSpacing: "0.05em", },
  moderate: {   backgroundColor: "#2a1a00",
    color: "#f59e0b",
    border: "1px solid #f59e0b33",
    borderRadius: "20px",
    fontSize: "0.68rem",
    fontWeight: "600",
    padding: "0.2rem 0.6rem",
    borderRadius: "20px",
    textTransform: "uppercase",
    letterSpacing: "0.05em", },
  low:      {  backgroundColor: "#0a2a0a",
    color: "#22c55e",
    border: "1px solid #22c55e33",
    borderRadius: "20px",
    fontSize: "0.68rem",
    fontWeight: "600",
    padding: "0.2rem 0.6rem",
    borderRadius: "20px",
    textTransform: "uppercase",
    letterSpacing: "0.05em", },
};

const s = {
  topBar: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", gap: "1rem" },
  pageTitle: { fontSize: "1.5rem", fontWeight: "700", color: "#ffffff", marginBottom: "0.25rem" },
  pageSubtitle: { fontSize: "0.83rem", color: "#666" },
  newBtn: { backgroundColor: "#a3e635", color: "#0a0a0a", border: "none", borderRadius: "8px", padding: "0.5rem 1.1rem", fontSize: "0.875rem", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" },
  tableWrap: { backgroundColor: "#111114", border: "1px solid #1e1e1e", borderRadius: "10px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "0.75rem 1.1rem", fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.07em", textTransform: "uppercase", color: "#555", borderBottom: "1px solid #1e1e1e" },
  td: { padding: "0.8rem 1.1rem", fontSize: "0.875rem", color: "#cccccc", borderBottom: "1px solid #1a1a1a" },
  tdLast: { padding: "0.8rem 1.1rem", fontSize: "0.875rem", color: "#cccccc" },
  badge: { fontSize: "0.65rem", fontWeight: "700", padding: "0.18rem 0.55rem", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em" },
  actionBtn: { background: "none", border: "none", fontSize: "0.83rem", cursor: "pointer", marginLeft: "0.75rem", padding: 0 },
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem" },
  modal: { backgroundColor: "#16161a", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "2rem", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" },
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

function formatWhen(dateStr) {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}

// Convert local datetime-local string to ISO for backend
function toISOLocal(val) {
  if (!val) return "";
  return new Date(val).toISOString();
}

// Convert ISO date to datetime-local input format
function toDatetimeLocal(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const emptyForm = {
  name: "", instructor: "", type: "HIIT", intensity: "moderate",
  scheduledAt: "", durationMinutes: "45", capacity: "16", description: "",
};

function AdminClasses() {
  const [classes,   setClasses]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(emptyForm);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch { setClasses([]); }
    finally  { setLoading(false); }
  };

  const openNew = () => {
    setEditing(null); setForm(emptyForm); setError(""); setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name:            c.name,
      instructor:      c.instructor,
      type:            c.type,
      intensity:       c.intensity,
      scheduledAt:     toDatetimeLocal(c.scheduledAt),
      durationMinutes: String(c.durationMinutes),
      capacity:        String(c.capacity),
      description:     c.description || "",
    });
    setError(""); setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); setError(""); };

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.name || !form.instructor || !form.scheduledAt) {
      setError("Name, instructor and scheduled time are required.");
      return;
    }
    try {
      setSaving(true); setError("");
      const payload = {
        ...form,
        scheduledAt:     toISOLocal(form.scheduledAt),
        durationMinutes: Number(form.durationMinutes),
        capacity:        Number(form.capacity),
      };
      editing
        ? await api.put(`/classes/${editing._id}`, payload)
        : await api.post("/classes", payload);
      await fetchClasses();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      await api.delete(`/classes/${id}`);
      setClasses((p) => p.filter((c) => c._id !== id));
    } catch (err) { alert(err.response?.data?.message || "Failed to delete."); }
  };

  return (
    <>
      <div style={s.topBar}>
        <div>
          <h1 style={s.pageTitle}>Classes</h1>
          <p style={s.pageSubtitle}>Schedule and manage your weekly class lineup.</p>
        </div>
        <button style={s.newBtn} onClick={openNew}>+ New class</button>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {["Class","Instructor","Type","When","Duration","Capacity","Booked","Intensity",""].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ ...s.td, color: "#555", textAlign: "center" }}>Loading...</td></tr>
            ) : classes.length === 0 ? (
              <tr><td colSpan={9} style={{ ...s.td, color: "#555", textAlign: "center" }}>No classes yet.</td></tr>
            ) : classes.map((c, i) => {
              const isLast = i === classes.length - 1;
              const cell   = isLast ? s.tdLast : s.td;
              return (
                <tr key={c._id}>
                  <td style={{ ...cell, fontWeight: "500", color: "#fff" }}>{c.name}</td>
                  <td style={cell}>{c.instructor}</td>
                  <td style={cell}>{c.type}</td>
                  <td style={{ ...cell, whiteSpace: "nowrap" }}>{formatWhen(c.scheduledAt)}</td>
                  <td style={cell}>{c.durationMinutes}m</td>
                  <td style={cell}>{c.capacity}</td>
                  <td style={cell}>{c.enrolled}</td>
                  <td style={cell}>
                    <span style={{ ...s.badge, ...INTENSITY_COLORS[c.intensity] }}>
                      {c.intensity?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...cell, textAlign: "right", whiteSpace: "nowrap" }}>
                    <button style={{ ...s.actionBtn, color: "#888" }}    onClick={() => openEdit(c)}>Edit</button>
                    <button style={{ ...s.actionBtn, color: "#ff6b6b" }} onClick={() => handleDelete(c._id)}>Delete</button>
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
              <span style={s.modalTitle}>{editing ? "Edit class" : "New class"}</span>
              <button style={s.closeBtn} onClick={closeModal}>Close</button>
            </div>
            {error && <div style={s.errorMsg}>{error}</div>}
            <div style={s.formGrid}>
              <div>
                <label style={s.label}>Name</label>
                <input style={s.input} name="name" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Instructor</label>
                <input style={s.input} name="instructor" value={form.instructor} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Type</label>
                <select style={s.select} name="type" value={form.type} onChange={handleChange}>
                  {TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Intensity</label>
                <select style={s.select} name="intensity" value={form.intensity} onChange={handleChange}>
                  {INTENSITY_OPTIONS.map((i) => (
                    <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={s.label}>Scheduled At</label>
                <input
                  style={s.input}
                  name="scheduledAt"
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={s.label}>Duration (min)</label>
                <input style={s.input} name="durationMinutes" type="number" value={form.durationMinutes} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Capacity</label>
                <input style={s.input} name="capacity" type="number" value={form.capacity} onChange={handleChange} />
              </div>
              <div style={s.formFull}>
                <label style={s.label}>Description</label>
                <textarea style={s.textarea} name="description" value={form.description} onChange={handleChange} />
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

export default AdminClasses;