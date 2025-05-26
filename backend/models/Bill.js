const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  billId: { type: String, unique: true, required: true },
  billNumber: { type: String, unique: true, required: true },
  customerName: { type: String, required: true },
  customerGST: { type: String },
  customerAddress: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  gst: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: String },
  pdfPath: { type: String },
});

module.exports = mongoose.model("Bill", BillSchema);
