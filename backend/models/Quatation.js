const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema({
  quotationId: { type: String, unique: true, required: true }, // Unique ID in format YY0001
  customerName: String,
  items: [
    {
      description: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quotation", QuotationSchema);
