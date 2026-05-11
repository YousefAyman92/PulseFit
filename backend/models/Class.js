const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    instructor: { type: String, required: true },
    type: {
      type: String,
      enum: ["HIIT", "Yoga", "Strength", "Cycling", "Mobility", "Boxing"],
      required: true,
    },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    capacity: { type: Number, required: true },
    enrolled: {type: Number , default: 0},
    intensity: {
      type: String,
      enum: ["low", "moderate", "high"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
