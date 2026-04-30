const express = require("express");
const router = express.Router();

router.use("/auth", require("./api/auth"));
router.use("/users", require("./api/users"));
router.use("/plans", require("./api/plans"));
router.use("/subscriptions", require("./api/subscriptions"));
router.use("/classes", require("./api/classes"));
router.use("/bookings", require("./api/bookings"));
router.use("/equipment", require("./api/equipment"));
router.use("/products", require("./api/products"));
router.use("/feedback", require("./api/feedback"));

module.exports = router;
