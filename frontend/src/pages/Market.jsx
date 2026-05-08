import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { showToast } from "../components/Toast";
import api from "../utils/api";

const CATEGORIES = [
  "All", "Protein", "Supplements",
  "Energy Drinks", "Snacks & Bars", "Apparel", "Accessories",
];

const s = {
  page: {
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#09090b",
    padding: "2.5rem 2rem 4rem",
  },
  inner: { maxWidth: "1100px", margin: "0 auto" },
  sectionLabel: {
    fontSize: "0.7rem",
    fontWeight: "600",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#a3e635",
    marginBottom: "0.5rem",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.02em",
    marginBottom: "0.4rem",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#888",
    maxWidth: "380px",
    lineHeight: "1.55",
    marginBottom: "2rem",
  },
  controlsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.75rem",
    gap: "1rem",
    flexWrap: "wrap",
  },
  filterTabs: { display: "flex", gap: "0.4rem", flexWrap: "wrap" },
  tab: {
    padding: "0.35rem 0.9rem",
    borderRadius: "20px",
    fontSize: "0.82rem",
    fontWeight: "500",
    cursor: "pointer",
    border: "1px solid #2a2a2a",
    backgroundColor: "transparent",
    color: "#888",
    transition: "all 0.15s",
  },
  tabActive: {
    backgroundColor: "#a3e635",
    color: "#0a0a0a",
    border: "1px solid #a3e635",
  },
  searchInput: {
    backgroundColor: "#16161a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "0.45rem 1rem",
    color: "#ffffff",
    fontSize: "0.875rem",
    outline: "none",
    width: "200px",
    transition: "border-color 0.15s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
  },
  empty: {
    color: "#555",
    fontSize: "0.9rem",
    padding: "3rem 0",
    textAlign: "center",
    gridColumn: "1 / -1",
  },
  footer: {
    textAlign: "center",
    color: "#333",
    fontSize: "0.8rem",
    marginTop: "3rem",
  },
};

function Market() {
  const [products,      setProducts]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [activeTab,     setActiveTab]     = useState("All");
  const [search,        setSearch]        = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [reserving,     setReserving]     = useState(null); // product._id being reserved

  const fetchProducts = () => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleReserve = async (product) => {
    try {
      setReserving(product._id);
      const res = await api.patch(`/products/${product._id}/buy`);

      // Update stock locally so UI reflects immediately
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id
            ? { ...p, stock: res.data.product.stock }
            : p
        )
      );

      showToast(`${product.name} reserved. Pick up at the front desk.`);
    } catch (err) {
      const msg = err.response?.data?.message || "Reservation failed. Try again.";
      showToast(msg, "error");
    } finally {
      setReserving(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchCat =
      activeTab === "All" ||
      p.category.toLowerCase() === activeTab.toLowerCase();
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <div style={s.sectionLabel}>Market</div>
        <h1 style={s.title}>Fuel your training</h1>
        <p style={s.subtitle}>
          Protein, supplements, energy drinks, snacks, apparel and accessories — pick up at the front desk.
        </p>

        <div style={s.controlsRow}>
          <div style={s.filterTabs}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                style={{ ...s.tab, ...(activeTab === cat ? s.tabActive : {}) }}
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            style={{
              ...s.searchInput,
              ...(searchFocused ? { borderColor: "#a3e635" } : {}),
            }}
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        <div style={s.grid}>
          {loading ? (
            <div style={s.empty}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={s.empty}>No products found.</div>
          ) : (
            filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onReserve={handleReserve}
                reserving={reserving}
              />
            ))
          )}
        </div>

        <div style={s.footer}>PulseFit Gym · Built for strength, recovery, and community.</div>
      </div>
    </div>
  );
}

export default Market;