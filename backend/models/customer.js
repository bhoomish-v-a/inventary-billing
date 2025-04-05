const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    customerName: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    gstin: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    stateCode: { type: String },
    aboutCustomer: { type: String }
});

module.exports = mongoose.model("Customer", customerSchema);
