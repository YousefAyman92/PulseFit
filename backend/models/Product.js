const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      required: true,
      lowercase: true,
      enum: [
        "protein",
        "supplements",
        "energy drinks",
        "snacks & bars",
        "apparel",
        "accessories",
      ],
    
    },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
