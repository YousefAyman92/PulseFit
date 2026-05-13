const express = require("express");
const ProductReservation = require("../../models/ProductReservation");
const Product = require("../../models/Product");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

const router = express.Router();

// GET /api/reservations/my — current user's reservations
router.get("/my", auth, async (req, res) => {
  try {
    const reservations = await ProductReservation.find({ userId: req.user.id })
      .populate("productId", "name imageUrl category")
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reservations — admin: all reservations
router.get("/", auth, admin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "all" ? { status } : {};
    const reservations = await ProductReservation.find(filter)
      .populate("userId", "fullName email")
      .populate("productId", "name imageUrl category")
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/reservations/:id/status — admin: update status
router.patch("/:id/status", auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["reserved", "picked_up", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const reservation = await ProductReservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("userId", "fullName email")
      .populate("productId", "name imageUrl category");

    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    // If admin cancels → restore stock
    if (status === "cancelled") {
      await Product.findByIdAndUpdate(reservation.productId, {
        $inc: { stock: 1 },
      });
    }

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/reservations/:id/cancel — user cancels own reservation
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const reservation = await ProductReservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    if (reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (reservation.status !== "reserved") {
      return res
        .status(400)
        .json({ message: "Only active reservations can be cancelled" });
    }

    reservation.status = "cancelled";
    await reservation.save();

    // Restore stock
    await Product.findByIdAndUpdate(reservation.productId, {
      $inc: { stock: 1 },
    });

    res.json({ message: "Reservation cancelled", reservation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
