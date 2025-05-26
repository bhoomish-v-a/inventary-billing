const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const path = require("path");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// Importing Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const billRoutes = require("./routes/billRoutes");
const reportRoutes = require("./routes/report");

// Using Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/customers", customerRoutes);
app.use("/quotations", quotationRoutes);
app.use("/bill", billRoutes);
app.use("/report", reportRoutes);
// Start Server


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





























// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("./models/user");
// const Product = require("./models/product");
// const connectDB = require("./config/db");
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const Quotation = require("./models/Quatation");

// require("dotenv").config();
// const app = express();
// connectDB();

// app.use(cors());
// app.use(express.json());

// const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";



// app.post("/login", async (req, res) => {
//     const { email, password, role } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//         return res.status(401).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//         return res.status(401).json({ message: "Incorrect password" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id, role: user.role }, "yourSecretKey", { expiresIn: "1h" });

//     // ✅ Fix: Send `role` in response
//     res.status(200).json({
//         message: "Login Successful",
//         role: user.role,   // 🔥 Fix: Include `role`
//         token: token
//     });
// });



// app.post("/add-user", async (req, res) => {
//     try {
//       const { email, password, confirmPassword, role } = req.body;
      
//       if (password !== confirmPassword) {
//          console.log("hello this is error")
//          return res.status(400).json({ message: "Passwords do not match" });
//        }
  
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new User({ email, password: hashedPassword, role });
//       await newUser.save();
  
//       res.status(201).json({ message: "User added successfully" });
//     } catch (error) {
      
//       res.status(500).json({ message: "Error adding user", error });
//     }
//   });
  
//   // Get Users
//   app.get("/users", async (req, res) => {
//     const users = await User.find().select("-password");
//     res.json(users);
//   });
  
//   // Delete User
//   app.delete("/delete-user/:id", async (req, res) => {
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: "User deleted successfully" });
//   });
  
//   // Update Password
//   app.put("/update-password/:id", async (req, res) => {
//     try {
//       const { password } = req.body;
//       const hashedPassword = await bcrypt.hash(password, 10);
//       await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
  
//       res.json({ message: "Password updated successfully" });
//     } catch (error) {
//       res.status(500).json({ message: "Error updating password", error });
//     }
//   });


//   app.post("/products", async (req, res) => {
//     try {
//       const { productId, sizes, hsnCode, rate, gst, quantity } = req.body;
  
//       if (!productId || !sizes.length || !hsnCode || !rate || !gst || !quantity) {
//         return res.status(400).json({ message: "All fields are required" });
//       }
  
//       const newProduct = new Product({
//         productId,
//         sizes,
//         hsnCode,
//         rate,
//         gst,
//         quantity,
//       });
      
//       await newProduct.save();
      
//       res.json({ message: "Product added successfully!" });
//     } catch (error) {
//       console.error("Error saving product:", error);
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   });
  
  
  
//   // Get Products API
//   app.get("/products", async (req, res) => {
//     try {
//       const products = await Product.find();
//       res.json(products);
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   });



//   app.get("/products/:productId", async (req, res) => {
//     try {
//         const product = await Product.findOne({ productId: req.params.productId });
//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }
//         res.json(product);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching product", error: error.message });
//     }
// });



// app.post("/quatation", async (req, res) => {
//   try {
//     const { products } = req.body;
//     let grandTotal = 0;

//     const validatedProducts = await Promise.all(
//       products.map(async (item) => {
//         const product = await Product.findById(item.productId);
//         if (!product || !product.sizes.includes(item.size)) {
//           throw new Error("Invalid product or size");
//         }
//         const total = item.quantity * item.price;
//         grandTotal += total;
//         return { ...item, total };
//       })
//     );

//     const quotation = new Quotation({ products: validatedProducts, grandTotal });
//     await quotation.save();
//     res.status(201).json(quotation);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });






// // ✅ Start Server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
