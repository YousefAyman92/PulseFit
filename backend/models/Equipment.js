const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "in_use", "maintenance", "retired"],
      default: "available",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", equipmentSchema);
