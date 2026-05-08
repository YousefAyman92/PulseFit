const express = require("express");
const router = express.Router();
const Feedback = require("../../models/Feedback");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

// anyone can submit feedback
router.post("/", async (req, res) => {
  try {
    const { rating, memberName, message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required." });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    const feedback = await Feedback.create({
      userId: req.user?._id || null,
      memberName: memberName?.trim() || "Anonymous",
      message: message.trim(),
      rating,
    });

    res.status(201).json({ message: "Feedback submitted!", feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// get all feedback 
router.get("/", auth, admin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// mark as resolved 
router.patch("/:id/resolve", auth, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    if (!feedback) return res.status(404).json({ message: "Feedback not found." });
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// reopen feedback
router.patch("/:id/reopen", auth, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { resolved: false },
      { new: true }
    );
    if (!feedback) return res.status(404).json({ message: "Feedback not found." });
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// delete feedback 
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found." });
    res.json({ message: "Feedback deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;