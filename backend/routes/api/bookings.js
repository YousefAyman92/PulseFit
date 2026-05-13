const express = require("express");
const router = express.Router();
const Booking = require("../../models/Booking");
const Class = require("../../models/Class");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

// POST /api/bookings — book a class
router.post("/", auth, async (req, res) => {
  try {
    const { classId } = req.body;
    const userId = req.user.id;

    const fitnessClass = await Class.findById(classId);
    if (!fitnessClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (fitnessClass.enrolled >= fitnessClass.capacity) {
      return res.status(400).json({ message: "Sorry, this class is full!" });
    }

    // Check if a booking already exists for this user+class (any status)
    const existingBooking = await Booking.findOne({ userId, classId });

    if (existingBooking) {
      if (existingBooking.status === "booked") {
        // Already actively booked
        return res
          .status(400)
          .json({ message: "You have already booked this class." });
      }

      // Was cancelled before — reactivate it
      existingBooking.status = "booked";
      await existingBooking.save();

      fitnessClass.enrolled += 1;
      await fitnessClass.save();

      await existingBooking.populate(
        "classId",
        "name instructor scheduledAt durationMinutes intensity type"
      );

      return res.status(201).json({
        message: "Booking successful!",
        booking: existingBooking,
      });
    }

    // No existing booking — create a fresh one
    const newBooking = new Booking({ classId, userId });
    await newBooking.save();

    fitnessClass.enrolled += 1;
    await fitnessClass.save();

    await newBooking.populate(
      "classId",
      "name instructor scheduledAt durationMinutes intensity type"
    );

    res
      .status(201)
      .json({ message: "Booking successful!", booking: newBooking });
  } catch (err) {
    // Fallback safety net for any unexpected duplicate key errors
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already booked this class." });
    }
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/bookings/my — current user's bookings  ← renamed from /my-bookings
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id,
      status: "booked",
    })
      .populate(
        "classId",
        "name instructor scheduledAt durationMinutes intensity type"
      )
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/bookings — all bookings, admin only  ← renamed from /all
router.get("/", auth, admin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "fullName email")
      .populate("classId", "name instructor scheduledAt")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// PATCH /api/bookings/:id/cancel — cancel booking  ← changed from DELETE to PATCH
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (
      booking.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Decrement enrolled count
    const fitnessClass = await Class.findById(booking.classId);
    if (fitnessClass && fitnessClass.enrolled > 0) {
      fitnessClass.enrolled -= 1;
      await fitnessClass.save();
    }

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
