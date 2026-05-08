const s = {
  card: {
    backgroundColor: "#16161a",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #1e1e1e",
  },
  imageWrap: {
    width: "100%",
    aspectRatio: "4/3",
    backgroundColor: "#111114",
    overflow: "hidden",
    position: "relative",
    flexShrink: 0,
  },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  noImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
    fontSize: "0.78rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  body: { padding: "0.9rem", display: "flex", flexDirection: "column", flexGrow: 1 },
  categoryLabel: {
    fontSize: "0.65rem",
    fontWeight: "600",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#a3e635",
    marginBottom: "0.3rem",
  },
  name: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "0.4rem",
    lineHeight: "1.3",
  },
  description: {
    fontSize: "0.78rem",
    color: "#888",
    lineHeight: "1.5",
    marginBottom: "0.9rem",
    flexGrow: 1,
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
  },
  price: { fontSize: "1.2rem", fontWeight: "700", color: "#ffffff" },
  stockBadge: {
    backgroundColor: "#1a2e0a",
    color: "#a3e635",
    fontSize: "0.65rem",
    fontWeight: "600",
    padding: "0.2rem 0.55rem",
    borderRadius: "20px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  outOfStock: { backgroundColor: "#2a2a2a", color: "#555" },
  reserveBtn: {
    width: "100%",
    backgroundColor: "#a3e635",
    color: "#0a0a0a",
    border: "none",
    borderRadius: "6px",
    padding: "0.6rem",
    fontSize: "0.83rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  reserveBtnLoading: {
    backgroundColor: "#5a7a1e",
    color: "#0a0a0a",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  reserveBtnDisabled: {
    backgroundColor: "#1e1e1e",
    color: "#444",
    cursor: "not-allowed",
  },
};

function ProductCard({ product, onReserve, reserving }) {
  const inStock = product.stock > 0;
  const isReserving = reserving === product._id;

  const getBtnStyle = () => {
    if (!inStock)    return { ...s.reserveBtn, ...s.reserveBtnDisabled };
    if (isReserving) return { ...s.reserveBtn, ...s.reserveBtnLoading };
    return s.reserveBtn;
  };

  return (
    <div style={s.card}>
      {/* Image */}
      <div style={s.imageWrap}>
        {product.imageUrl ? (
          <>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={s.image}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div style={{ ...s.noImage, display: "none" }}>No Image</div>
          </>
        ) : (
          <div style={s.noImage}>No Image</div>
        )}
      </div>

      {/* Body */}
      <div style={s.body}>
        <div style={s.categoryLabel}>{product.category}</div>
        <div style={s.name}>{product.name}</div>
        <div style={s.description}>{product.description}</div>

        <div style={s.priceRow}>
          <span style={s.price}>${product.price?.toFixed(2)}</span>
          <span style={{ ...s.stockBadge, ...(inStock ? {} : s.outOfStock) }}>
            {inStock ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        <button
          style={getBtnStyle()}
          disabled={!inStock || isReserving}
          onClick={() => inStock && !isReserving && onReserve(product)}
        >
          {isReserving ? "Reserving..." : "Reserve at front desk"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;