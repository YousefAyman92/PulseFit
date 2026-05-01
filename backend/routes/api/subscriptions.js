const express = require("express");
const Subscription = require("../../models/Subscription");
const Plan = require("../../models/Plan");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const router = express.Router();

// GET /api/subscriptions/my — get current user's active subscription
router.get("/my", auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user.id,
      status: "active",
    }).populate("planId");
    res.json(subscription || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/subscriptions — subscribe to a plan (one active plan at a time)
router.post("/", auth, async (req, res) => {
  try {
    const { planId } = req.body;

    // Check user doesn't already have an active subscription
    const existing = await Subscription.findOne({
      userId: req.user.id,
      status: "active",
    });
    if (existing) {
      return res.status(400).json({
        message:
          "You already have an active plan. Cancel it before subscribing to a new one.",
      });
    }

    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const subscription = await Subscription.create({
      userId: req.user.id,
      planId,
      startDate,
      endDate,
      status: "active",
      price: plan.price,
    });

    await subscription.populate("planId");
    res.status(201).json(subscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/subscriptions/:id/cancel — cancel subscription
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });
    if (subscription.status !== "active") {
      return res.status(400).json({ message: "Subscription is not active" });
    }

    subscription.status = "cancelled";
    await subscription.save();
    res.json({ message: "Subscription cancelled", subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/subscriptions — admin: get all subscriptions
router.get("/", auth, admin, async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("userId", "fullName email")
      .populate("planId", "title price")
      .sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
