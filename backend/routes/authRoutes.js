const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login Successful", role: user.role, token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



// const router = require("express").Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // Adjust path as per your project structure
// const JWT_SECRET = process.env.JWT_SECRET || "yoursecret";

// // Static fallback credentials
// const STATIC_EMAIL = "a@gmail.com";
// const STATIC_PASSWORD = "123"; // You can hash this if preferred
// const STATIC_ROLE = "admin";

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if any users exist in the database
//     const userCount = await User.countDocuments();

//     // If no users exist and static credentials are used
//     if (userCount === 0 && email === STATIC_EMAIL && password === STATIC_PASSWORD) {
//       const token = jwt.sign({ id: "static_admin", role: STATIC_ROLE }, JWT_SECRET, { expiresIn: "1h" });
//       return res.json({
//         message: "Login Successful (Static Admin)",
//         role: STATIC_ROLE,
//         token
//       });
//     }

//     // Normal DB-based authentication
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

//     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

//     res.json({ message: "Login Successful", role: user.role, token });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });



module.exports = router;
