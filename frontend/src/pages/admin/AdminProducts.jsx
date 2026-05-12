import { useEffect, useState } from "react";
import api from "../../utils/api";

const CATEGORIES = ["Protein", "Supplements", "Energy Drinks", "Snacks & Bars", "Apparel", "Accessories"];

const s = {
  topBar: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", gap: "1rem" },
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
  newBtn: { backgroundColor: "#a3e635", color: "#0a0a0a", border: "none", borderRadius: "8px", padding: "0.5rem 1.1rem", fontSize: "0.875rem", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" },
  tableWrap: { backgroundColor: "#111114", border: "1px solid #1e1e1e", borderRadius: "10px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "0.75rem 1.25rem", fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.07em", textTransform: "uppercase", color: "#555", borderBottom: "1px solid #1e1e1e" },
  td: { padding: "0.75rem 1.25rem", fontSize: "0.875rem", color: "#cccccc", borderBottom: "1px solid #1a1a1a", verticalAlign: "middle" },
  tdLast: { padding: "0.75rem 1.25rem", fontSize: "0.875rem", color: "#cccccc", verticalAlign: "middle" },
  thumb: { width: "38px", height: "38px", borderRadius: "6px", objectFit: "cover", backgroundColor: "#1a1a1a", display: "block" },
  noThumb: { width: "38px", height: "38px", borderRadius: "6px", backgroundColor: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#333", textTransform: "uppercase" },
  badgeActive: { color: "#22c55e",
    border: "1px solid #22c55e33",
    borderRadius: "20px", fontSize: "0.68rem", fontWeight: "600", padding: "0.2rem 0.6rem", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em" },
  badgeInactive: {  backgroundColor: "transparent",
    border: "1px solid #2a2a2a",
    color: "#aaaaaa", fontSize: "0.68rem", fontWeight: "600", padding: "0.2rem 0.6rem", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em" },
  actionBtn: { background: "none", border: "none", fontSize: "0.83rem", cursor: "pointer", marginLeft: "0.75rem", padding: 0 },
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem" },
  modal: { backgroundColor: "#16161a", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "2rem", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" },
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

const emptyForm = { name: "", category: "Protein", price: "", stock: "0", imageUrl: "", description: "", isActive: true };

function AdminProducts() {
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [catFilter, setCatFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(emptyForm);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products?all=true");
      setProducts(res.data);
    } catch { setProducts([]); }
    finally  { setLoading(false); }
  };

  const displayed = catFilter === "all"
    ? products
    : products.filter((p) => p.category.toLowerCase() === catFilter.toLowerCase());

  const openNew = () => {
    setEditing(null); setForm(emptyForm); setError(""); setModalOpen(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), imageUrl: p.imageUrl || "", description: p.description || "", isActive: p.isActive });
    setError(""); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); setError(""); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "isActive" ? value === "true" : value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { setError("Name and price are required."); return; }
    try {
      setSaving(true); setError("");
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      editing
        ? await api.put(`/products/${editing._id}`, payload)
        : await api.post("/products", payload);
      await fetchProducts();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (err) { alert(err.response?.data?.message || "Failed to delete."); }
  };

  return (
    <>
      <div style={s.topBar}>
        <div>
          <h1 style={s.pageTitle}>Market Products</h1>
          <p style={s.pageSubtitle}>Manage everything sold in the gym market.</p>
        </div>
        <div style={s.topRight}>
          <select style={s.filterSelect} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button style={s.newBtn} onClick={openNew}>+ New product</button>
        </div>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {["Image","Name","Category","Price","Stock","Active",""].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ ...s.td, color: "#555", textAlign: "center" }}>Loading...</td></tr>
            ) : displayed.map((p, i) => {
              const isLast = i === displayed.length - 1;
              const cell = isLast ? s.tdLast : s.td;
              return (
                <tr key={p._id}>
                  <td style={cell}>
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt={p.name} style={s.thumb} onError={(e) => { e.target.style.display = "none"; }} />
                      : <div style={s.noThumb}>—</div>
                    }
                  </td>
                  <td style={{ ...cell, fontWeight: "500", color: "#fff" }}>{p.name}</td>
                  <td style={cell}>{p.category}</td>
                  <td style={cell}>${p.price?.toFixed(2)}</td>
                  <td style={cell}>{p.stock}</td>
                  <td style={cell}>
                    <span style={p.isActive ? s.badgeActive : s.badgeInactive}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ ...cell, textAlign: "right", whiteSpace: "nowrap" }}>
                    <button style={{ ...s.actionBtn, color: "#888" }} onClick={() => openEdit(p)}>Edit</button>
                    <button style={{ ...s.actionBtn, color: "#ff6b6b" }} onClick={() => handleDelete(p._id)}>Delete</button>
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
              <span style={s.modalTitle}>{editing ? "Edit product" : "New product"}</span>
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
                <select style={s.select} name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Price (USD)</label>
                <input style={s.input} name="price" type="number" value={form.price} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Stock</label>
                <input style={s.input} name="stock" type="number" value={form.stock} onChange={handleChange} />
              </div>
              <div style={s.formFull}>
                <label style={s.label}>Image URL (Optional)</label>
                <input style={s.input} name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
              </div>
              <div style={s.formFull}>
                <label style={s.label}>Description</label>
                <textarea style={s.textarea} name="description" value={form.description} onChange={handleChange} />
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

export default AdminProducts;