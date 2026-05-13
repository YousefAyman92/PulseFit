const express = require("express");
const Product = require("../../models/Product");
const ProductReservation = require("../../models/ProductReservation");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products — admin only
router.post("/", auth, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id — admin only
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id — admin only
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/products/:id/buy — reserve a product (auth required)
router.patch("/:id/buy", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock <= 0)
      return res.status(400).json({ message: "Product is out of stock" });

    // Decrement stock
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: -1 } },
      { new: true }
    );

    // Create reservation record
    const reservation = await ProductReservation.create({
      userId: req.user.id,
      productId: product._id,
      productName: product.name,
      price: product.price,
      status: "reserved",
    });

    res.status(200).json({
      message: "Reservation created! Pick up at the front desk.",
      product: updatedProduct,
      reservation,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
