const express = require("express");
const Product = require("../models/product");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Add Product
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images/"); // Your images directory
    },
    filename: (req, file, cb) => {
      const productId = req.body.productId.replace(/\s+/g, "_").toLowerCase();
      const ext = path.extname(file.originalname);
      cb(null, `${productId}${ext}`);
    },
  });
  
  const upload = multer({ storage });
  
  router.post("/", upload.single("image"), async (req, res) => {
    try {
      const { productId, hsnCode, gst, sizes } = req.body;
  
      if (!productId || !hsnCode || !gst || !sizes) {
        return res.status(400).json({ message: "⚠️ All fields are required!" });
      }
  
      if (gst < 0 || gst > 100) {
        return res.status(400).json({ message: "⚠️ GST must be between 0% and 100%!" });
      }
  
      if (!/^\d{6}$/.test(hsnCode)) {
        return res.status(400).json({ message: "⚠️ HSN Code must be exactly 6 digits!" });
      }
  
      const existingProduct = await Product.findOne({ productId });
      if (existingProduct) {
        return res.status(400).json({ message: "⚠️ Product already exists!" });
      }
  
      const newProduct = new Product({
        productId,
        hsnCode,
        gst,
        sizes: JSON.parse(sizes), // Parsing JSON string to object
        image: req.file.filename, // Save only filename
      });
  
      await newProduct.save();
  
      res.json({ message: "✅ Product added successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "❌ Server error! Please try again.", error: error.message });
    }
  });
  

// Get All Products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error!", error: error.message });
    }
});

router.get("/:productId", async (req, res) => {
    try {
        const product = await Product.findOne({ productId: req.params.productId });
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
});


router.put("/:productId/update-price", async (req, res) => {
    const { productId } = req.params;
    const { size, newRate } = req.body;

    try {
        const product = await Product.findOne({ productId });
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Find the specific size and update the rate
        const sizeIndex = product.sizes.findIndex((s) => s.size === size);
        if (sizeIndex === -1) return res.status(404).json({ message: "Size not found" });

        product.sizes[sizeIndex].rate = newRate;
        await product.save();

        res.json({ message: "Price updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update stock for a specific size
router.put("/:productId/update-stock", async (req, res) => {
    const { productId } = req.params;
    const { size, newQuantity } = req.body;

    try {
        const product = await Product.findOne({ productId });
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Find the specific size and update the stock
        const sizeIndex = product.sizes.findIndex((s) => s.size === size);
        if (sizeIndex === -1) return res.status(404).json({ message: "Size not found" });

        product.sizes[sizeIndex].quantity = newQuantity;
        await product.save();

        res.json({ message: "Stock updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.put("/:productId/add-size", async (req, res) => {
    const { productId } = req.params;
    const { size, rate, gst, quantity } = req.body;
  
    try {
      const product = await Product.findOne({ productId });
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      product.sizes.push({ size, rate, gst, quantity });
      await product.save();
  
      res.json({ message: "New size added successfully!", product });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

module.exports = router;
