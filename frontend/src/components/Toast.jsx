import { useEffect, useState } from "react";

const s = {
  container: {
    position: "fixed",
    top: "80px",           // just below navbar
    right: "1.5rem",
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    pointerEvents: "none",
  },
  toast: {
    backgroundColor: "#16161a",
    borderLeft: "3px solid #a3e635",
    borderRadius: "8px",
    padding: "0.85rem 1.1rem",
    maxWidth: "320px",
    fontSize: "0.875rem",
    color: "#ffffff",
    lineHeight: "1.5",
    boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
    pointerEvents: "auto",
    animation: "slideIn 0.2s ease",
  },
  errorToast: {
    borderLeft: "3px solid #ff6b6b",
  },
};

// Global toast state — simple singleton approach
let _addToast = null;

export function showToast(message, type = "success") {
  if (_addToast) _addToast(message, type);
}

function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _addToast = (message, type) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => { _addToast = null; };
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div style={s.container}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{ ...s.toast, ...(t.type === "error" ? s.errorToast : {}) }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}

export default Toast;