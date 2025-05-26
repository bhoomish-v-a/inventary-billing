const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    hsnCode: { type: String, required: true },
    gst: { type: Number, required: true },
    sizes: [
      {
        size: { type: String, required: true }, // Example: "S", "M", "L"
        rate: { type: Number, required: true }, // Price per size
        quantity: { type: Number, required: true }, // Stock per size
      },
    ],
    image: { type: String, required: true }, // <-- New field to store the image filename
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
