const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const authenticate= require("../middleware/authenticate");
const authorizeRole= require("../middleware/authorizeRole");
const router = express.Router();

// Add User
router.post("/", async (req, res) => {
    try {
        const { email, password, confirmPassword, role } = req.body;
        
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "User added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding user", error });
    }
});

// Get Users
router.get("/", async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});

// Delete User
router.delete("/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
});

// Update Password
router.put("/:id", async (req, res) => {
    try {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating password", error });
    }
});

module.exports = router;
