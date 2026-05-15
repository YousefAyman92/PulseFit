const express = require("express");
const router = express.Router();
const Class = require("../../models/Class");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

// GET all classes — public
router.get("/", async (req, res) => {
  try {
    const classes = await Class.find().sort({ scheduledAt: 1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create — admin only  ← was missing auth+admin
router.post("/", auth, admin, async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update — admin only  ← was missing auth+admin
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Class not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE — admin only  ← was missing auth+admin
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
