const express = require("express");
const router = express.Router();
const Booking = require("../../models/Booking");
const Class = require("../../models/Class");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

// 1. Create a new booking
router.post("/", auth, async (req, res) => {
    try {
        const { classId } = req.body;
        const userId = req.user.id || req.user._id; 
 

        // Check if class exists
        const fitnessClass = await Class.findById(classId);
        if (!fitnessClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        // Capacity check
        if (fitnessClass.enrolled >= fitnessClass.capacity) {
            return res.status(400).json({ message: "Sorry, this class is full!" });
        }

        // Save booking
        const newBooking = new Booking({ classId, userId });
        await newBooking.save();

        // Increment enrolled count
        fitnessClass.enrolled += 1;
        await fitnessClass.save();

        res.status(201).json({ message: "Booking successful!", newBooking });
    } catch (err) {
        // Handle duplicate booking
        if (err.code === 11000) {
            return res.status(400).json({ message: "You have already booked this class." });
        }
        res.status(500).json({ message: "Server Error" });
    }
});

// 2. Get current user's bookings
router.get("/my-bookings", auth, async (req, res) => {
    try {
        const myBookings = await Booking.find({ userId: req.user.id })
            .populate("classId", "name instructor scheduledAt durationMinutes");
        
        res.json(myBookings);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 3. Get all gym bookings (Admin only)
router.get("/all", [auth, admin], async (req, res) => {
    try {
        const allBookings = await Booking.find()
            .populate("userId", "name email")
            .populate("classId", "name instructor scheduledAt");
            
        res.json(allBookings);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 4. Cancel/Delete a booking
router.delete("/:id", auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Check ownership or admin role
        if (booking.userId.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({ message: "User not authorized" });
        }

        // Decrement enrolled count
        const fitnessClass = await Class.findById(booking.classId);
        if (fitnessClass && fitnessClass.enrolled > 0) {
            fitnessClass.enrolled -= 1;
            await fitnessClass.save();
        }

        await booking.deleteOne();
        res.json({ message: "Booking cancelled successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;