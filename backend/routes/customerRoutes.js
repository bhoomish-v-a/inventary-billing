const express = require("express");
const Customer = require("../models/customer");

const router = express.Router();

// ✅ Add a new customer (with unique name handling)
router.post("/", async (req, res) => {
    try {
        const { customerName, address, gstin, phone, email, stateCode, aboutCustomer } = req.body;

        if (!customerName || !phone || !address) {
            return res.status(400).json({ message: "Name, phone number, and address are required" });
        }

        const newCustomer = new Customer({ customerName, address, gstin, phone, email, stateCode, aboutCustomer });
        await newCustomer.save();

        res.json({ message: "Customer added successfully!" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Customer name already exists" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Get all customers
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Get customer by ID
router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customer", error: error.message });
    }
});

// ✅ Update customer by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json({ message: "Customer updated successfully!", updatedCustomer });
    } catch (error) {
        res.status(500).json({ message: "Error updating customer", error: error.message });
    }
});

// ✅ Delete customer by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json({ message: "Customer deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting customer", error: error.message });
    }
});

module.exports = router;
