const mongoose = require("mongoose");

const productReservationSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
    productId:   { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true }, // snapshot so name stays even if product deleted
    price:       { type: Number, required: true }, // snapshot price at time of reservation
    status: {
      type: String,
      enum: ["reserved", "picked_up", "cancelled"],
      default: "reserved",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductReservation", productReservationSchema);