import { useEffect, useState } from "react";
import api from "../../utils/api";

const s = {
  topBar: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "2rem",
    gap: "1rem",
  },
  titleBlock: {},
  pageTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "0.25rem",
  },
  pageSubtitle: { fontSize: "0.83rem", color: "#666" },
  topRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flexShrink: 0,
  },
  searchInput: {
    backgroundColor: "#111114",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    color: "#ffffff",
    fontSize: "0.875rem",
    outline: "none",
    width: "220px",
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
  tdBold: { fontWeight: "500", color: "#ffffff" },
  badgeMember: {
    backgroundColor: "#1a1a2e",
    color: "#818cf8",
    fontSize: "0.68rem",
    fontWeight: "600",
    padding: "0.2rem 0.6rem",
    borderRadius: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  badgeAdmin: {
    backgroundColor: "#1a2e0a",
    color: "#a3e635",
    fontSize: "0.68rem",
    fontWeight: "600",
    padding: "0.2rem 0.6rem",
    borderRadius: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  badgeActive: {
    backgroundColor: "#14532d",
    color: "#4ade80",
    fontSize: "0.68rem",
    fontWeight: "600",
    padding: "0.2rem 0.6rem",
    borderRadius: "20px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  badgeInactive: {
    backgroundColor: "#222",
    color: "#666",
    fontSize: "0.68rem",
    fontWeight: "600",
    padding: "0.2rem 0.6rem",
    borderRadius: "20px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  actionBtn: {
    background: "none",
    border: "none",
    fontSize: "0.83rem",
    cursor: "pointer",
    marginLeft: "0.75rem",
    transition: "color 0.15s",
    padding: 0,
  },
  // ── Modal shared ──
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    padding: "1rem",
  },
  modal: {
    backgroundColor: "#16161a",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "2rem",
    width: "100%",
    maxWidth: "480px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  modalTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#ffffff",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  formFull: { gridColumn: "1 / -1" },
  label: {
    display: "block",
    fontSize: "0.68rem",
    fontWeight: "600",
    letterSpacing: "0.08em",
    color: "#888",
    textTransform: "uppercase",
    marginBottom: "0.4rem",
  },
  input: {
    width: "100%",
    backgroundColor: "#111114",
    border: "1px solid #333",
    borderRadius: "6px",
    padding: "0.6rem 0.8rem",
    color: "#ffffff",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    backgroundColor: "#111114",
    border: "1px solid #333",
    borderRadius: "6px",
    padding: "0.6rem 0.8rem",
    color: "#ffffff",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "1.5rem",
  },
  cancelBtn: {
    background: "none",
    border: "1px solid #333",
    color: "#aaa",
    borderRadius: "7px",
    padding: "0.55rem 1.1rem",
    fontSize: "0.875rem",
    cursor: "pointer",
  },
  saveBtn: {
    backgroundColor: "#a3e635",
    border: "none",
    color: "#0a0a0a",
    borderRadius: "7px",
    padding: "0.55rem 1.25rem",
    fontSize: "0.875rem",
    fontWeight: "700",
    cursor: "pointer",
  },
  errorMsg: {
    color: "#ff6b6b",
    fontSize: "0.82rem",
    marginBottom: "1rem",
  },
  // ── View modal ──
  viewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.25rem",
    marginBottom: "1.5rem",
  },
  viewLabel: {
    fontSize: "0.68rem",
    fontWeight: "600",
    letterSpacing: "0.08em",
    color: "#a3e635",
    textTransform: "uppercase",
    marginBottom: "0.3rem",
  },
  viewValue: {
    fontSize: "0.9rem",
    color: "#cccccc",
  },
  viewSectionTitle: {
    fontSize: "0.68rem",
    fontWeight: "600",
    letterSpacing: "0.08em",
    color: "#a3e635",
    textTransform: "uppercase",
    marginBottom: "0.75rem",
    marginTop: "1.25rem",
    borderTop: "1px solid #222",
    paddingTop: "1.25rem",
  },
  subRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111114",
    borderRadius: "6px",
    padding: "0.65rem 0.9rem",
    marginBottom: "0.5rem",
    fontSize: "0.83rem",
    color: "#cccccc",
  },
  subName: { fontWeight: "500", color: "#ffffff" },
  subDates: { fontSize: "0.78rem", color: "#888" },
  badgeExpired: {
    backgroundColor: "#2a1010",
    color: "#ff6b6b",
    fontSize: "0.65rem",
    fontWeight: "600",
    padding: "0.18rem 0.55rem",
    borderRadius: "20px",
    textTransform: "uppercase",
  },
  noneText: { color: "#555", fontSize: "0.83rem" },
};

const emptyNewForm = {
  fullName: "", email: "", phone: "",
  password: "", role: "member", status: "active",
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function AdminMembers() {
  const [members,     setMembers]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");

  // Modal state
  const [newModal,    setNewModal]    = useState(false);
  const [editModal,   setEditModal]   = useState(false);
  const [viewModal,   setViewModal]   = useState(false);

  const [selectedMember, setSelectedMember] = useState(null);
  const [viewData,       setViewData]       = useState(null); // { user, subscriptions, bookings }

  const [newForm,  setNewForm]  = useState(emptyNewForm);
  const [editForm, setEditForm] = useState({});
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async (q = "") => {
    try {
      const res = await api.get(`/users${q ? `?search=${q}` : ""}`);
      setMembers(res.data);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Live search with small debounce
  useEffect(() => {
    const t = setTimeout(() => fetchMembers(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // ── NEW member ──
  const openNew = () => {
    setNewForm(emptyNewForm);
    setError("");
    setNewModal(true);
  };

  const handleNewChange = (e) => {
    setNewForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleNewSave = async () => {
    if (!newForm.fullName || !newForm.email || !newForm.password) {
      setError("Full name, email and password are required.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await api.post("/users", newForm);
      await fetchMembers(search);
      setNewModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create member.");
    } finally {
      setSaving(false);
    }
  };

  // ── EDIT member ──
  const openEdit = (member) => {
    setSelectedMember(member);
    setEditForm({
      fullName: member.fullName,
      email:    member.email,
      phone:    member.phone || "",
      password: "",
      role:     member.role,
      status:   member.status,
    });
    setError("");
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    if (!editForm.fullName || !editForm.email) {
      setError("Full name and email are required.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const payload = { ...editForm };
      if (!payload.password) delete payload.password; // don't send empty password
      await api.put(`/users/${selectedMember._id}`, payload);
      await fetchMembers(search);
      setEditModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update member.");
    } finally {
      setSaving(false);
    }
  };

  // ── VIEW member ──
  const openView = async (member) => {
    setSelectedMember(member);
    setViewData(null);
    setViewModal(true);
    try {
      // Fetch subscriptions and bookings for this user (admin endpoints)
      const [subRes, bookRes] = await Promise.all([
        api.get("/subscriptions"),
        api.get("/bookings"),
      ]);
      const userSubs  = subRes.data.filter(
        (s) => s.userId?._id === member._id || s.userId === member._id
      );
      const userBooks = bookRes.data.filter(
        (b) => b.userId?._id === member._id || b.userId === member._id
      );
      setViewData({ subscriptions: userSubs, bookings: userBooks });
    } catch {
      setViewData({ subscriptions: [], bookings: [] });
    }
  };

  // ── DELETE member ──
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await api.delete(`/users/${id}`);
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete.");
    }
  };

  const closeAll = () => {
    setNewModal(false);
    setEditModal(false);
    setViewModal(false);
    setSelectedMember(null);
    setViewData(null);
    setError("");
  };

  return (
    <>
      {/* ── Top bar ── */}
      <div style={s.topBar}>
        <div style={s.titleBlock}>
          <h1 style={s.pageTitle}>Members</h1>
          <p style={s.pageSubtitle}>Manage member accounts and view their activity.</p>
        </div>
        <div style={s.topRight}>
          <input
            style={s.searchInput}
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={s.newBtn} onClick={openNew}>+ New member</button>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {["Name","Email","Phone","Role","Status","Joined",""].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ ...s.td, color: "#555", textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ ...s.td, color: "#555", textAlign: "center" }}>
                  No members found.
                </td>
              </tr>
            ) : members.map((m, i) => {
              const isLast = i === members.length - 1;
              const cell   = isLast ? s.tdLast : s.td;
              return (
                <tr key={m._id}>
                  <td style={{ ...cell, ...s.tdBold }}>{m.fullName}</td>
                  <td style={cell}>{m.email}</td>
                  <td style={cell}>{m.phone || "—"}</td>
                  <td style={cell}>
                    <span style={m.role === "admin" ? s.badgeAdmin : s.badgeMember}>
                      {m.role}
                    </span>
                  </td>
                  <td style={cell}>
                    <span style={m.status === "active" ? s.badgeActive : s.badgeInactive}>
                      {m.status}
                    </span>
                  </td>
                  <td style={cell}>
                    {new Date(m.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </td>
                  <td style={{ ...cell, textAlign: "right", whiteSpace: "nowrap" }}>
                    <button
                      style={{ ...s.actionBtn, color: "#888" }}
                      onClick={() => openView(m)}
                    >
                      View
                    </button>
                    <button
                      style={{ ...s.actionBtn, color: "#888" }}
                      onClick={() => openEdit(m)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...s.actionBtn, color: "#ff6b6b" }}
                      onClick={() => handleDelete(m._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════
          NEW MEMBER MODAL
      ══════════════════════════════════════ */}
      {newModal && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && closeAll()}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>New member</span>
              <button style={s.closeBtn} onClick={closeAll}>Close</button>
            </div>

            {error && <div style={s.errorMsg}>{error}</div>}

            <div style={s.formGrid}>
              <div>
                <label style={s.label}>Full Name</label>
                <input
                  style={s.input}
                  name="fullName"
                  value={newForm.fullName}
                  onChange={handleNewChange}
                />
              </div>
              <div>
                <label style={s.label}>Email</label>
                <input
                  style={s.input}
                  name="email"
                  type="email"
                  value={newForm.email}
                  onChange={handleNewChange}
                />
              </div>
              <div>
                <label style={s.label}>Phone</label>
                <input
                  style={s.input}
                  name="phone"
                  value={newForm.phone}
                  onChange={handleNewChange}
                />
              </div>
              <div>
                <label style={s.label}>Password</label>
                <input
                  style={s.input}
                  name="password"
                  type="password"
                  value={newForm.password}
                  onChange={handleNewChange}
                />
              </div>
              <div>
                <label style={s.label}>Role</label>
                <select style={s.select} name="role" value={newForm.role} onChange={handleNewChange}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Status</label>
                <select style={s.select} name="status" value={newForm.status} onChange={handleNewChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div style={s.modalFooter}>
              <button style={s.cancelBtn} onClick={closeAll}>Cancel</button>
              <button style={s.saveBtn} onClick={handleNewSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          EDIT MEMBER MODAL
      ══════════════════════════════════════ */}
      {editModal && selectedMember && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && closeAll()}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>Edit member</span>
              <button style={s.closeBtn} onClick={closeAll}>Close</button>
            </div>

            {error && <div style={s.errorMsg}>{error}</div>}

            <div style={s.formGrid}>
              <div>
                <label style={s.label}>Full Name</label>
                <input
                  style={s.input}
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label style={s.label}>Email</label>
                <input
                  style={s.input}
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label style={s.label}>Phone</label>
                <input
                  style={s.input}
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label style={s.label}>New Password (leave blank)</label>
                <input
                  style={s.input}
                  name="password"
                  type="password"
                  value={editForm.password}
                  onChange={handleEditChange}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label style={s.label}>Role</label>
                <select style={s.select} name="role" value={editForm.role} onChange={handleEditChange}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Status</label>
                <select style={s.select} name="status" value={editForm.status} onChange={handleEditChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div style={s.modalFooter}>
              <button style={s.cancelBtn} onClick={closeAll}>Cancel</button>
              <button style={s.saveBtn} onClick={handleEditSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          VIEW MEMBER MODAL
      ══════════════════════════════════════ */}
      {viewModal && selectedMember && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && closeAll()}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>{selectedMember.fullName}</span>
              <button style={s.closeBtn} onClick={closeAll}>Close</button>
            </div>

            {/* Basic info */}
            <div style={s.viewGrid}>
              <div>
                <div style={s.viewLabel}>Email</div>
                <div style={s.viewValue}>{selectedMember.email}</div>
              </div>
              <div>
                <div style={s.viewLabel}>Phone</div>
                <div style={s.viewValue}>{selectedMember.phone || "—"}</div>
              </div>
              <div>
                <div style={s.viewLabel}>Role</div>
                <div style={s.viewValue}>{selectedMember.role}</div>
              </div>
              <div>
                <div style={s.viewLabel}>Status</div>
                <div style={s.viewValue}>{selectedMember.status}</div>
              </div>
            </div>

            {/* Subscriptions */}
            <div style={s.viewSectionTitle}>Subscriptions</div>
            {!viewData ? (
              <div style={s.noneText}>Loading...</div>
            ) : viewData.subscriptions.length === 0 ? (
              <div style={s.noneText}>None</div>
            ) : viewData.subscriptions.map((sub) => (
              <div key={sub._id} style={s.subRow}>
                <div>
                  <div style={s.subName}>{sub.planId?.title || "Plan"}</div>
                  <div style={s.subDates}>
                    {formatDate(sub.startDate)} → {formatDate(sub.endDate)}
                  </div>
                </div>
                <span style={
                  sub.status === "active"    ? s.badgeActive    :
                  sub.status === "cancelled" ? s.badgeInactive  :
                  s.badgeExpired
                }>
                  {sub.status}
                </span>
              </div>
            ))}

            {/* Class bookings */}
            <div style={s.viewSectionTitle}>Class Bookings</div>
            {!viewData ? (
              <div style={s.noneText}>Loading...</div>
            ) : viewData.bookings.length === 0 ? (
              <div style={s.noneText}>None</div>
            ) : viewData.bookings.map((bk) => (
              <div key={bk._id} style={s.subRow}>
                <div>
                  <div style={s.subName}>{bk.classId?.name || "Class"}</div>
                  <div style={s.subDates}>
                    {bk.classId?.scheduledAt
                      ? formatDate(bk.classId.scheduledAt)
                      : "—"}
                    {bk.classId?.instructor
                      ? ` · ${bk.classId.instructor}`
                      : ""}
                  </div>
                </div>
                <span style={bk.status === "booked" ? s.badgeActive : s.badgeInactive}>
                  {bk.status}
                </span>
              </div>
            ))}

          </div>
        </div>
      )}
    </>
  );
}

export default AdminMembers;