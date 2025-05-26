const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  date: Date,
  customerName: String,
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    gst: Number,
  }],
  totalAmount: Number,
  gstAmount: Number,
  paymentStatus: String, // 'Paid', 'Pending'
});

module.exports = mongoose.model('Invoice', invoiceSchema);
