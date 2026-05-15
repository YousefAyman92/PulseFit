const express = require("express");
const Plan = require("../../models/Plan");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const router = express.Router();

//get all active plans
router.get("/", async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const plans = await Plan.find(filter).sort({ price: 1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//admin: add plan
router.post("/", auth, admin, async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//admin: update plan
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//admin: delete plan
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;