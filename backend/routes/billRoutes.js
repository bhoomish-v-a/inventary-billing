const express = require("express");
const path = require("path");
const pdf = require("html-pdf");
const Handlebars = require("handlebars");
const fs = require("fs");
const Bill = require("../models/Bill"); // Your Bill model

const routes = express.Router();
routes.use(express.json());

// Ensure bills folder exists
const billsDir = path.join(__dirname, "..", "bills");
if (!fs.existsSync(billsDir)) {
  fs.mkdirSync(billsDir);
}

// Function to Generate Unique Bill ID
const generateUniqueBillId = async () => {
  let newBillId;
  let exists;
  do {
    newBillId = `BID-${Math.floor(Math.random() * 100000)}`;
    exists = await Bill.findOne({ billId: newBillId });
  } while (exists);
  return newBillId;
};

// Function to Generate Unique Bill Number
const generateUniqueBillNumber = async () => {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const lastBill = await Bill.findOne({ billNumber: { $regex: `^${currentYear}` } })
    .sort({ billNumber: -1 })
    .exec();

  let newNumber = "0001";
  if (lastBill) {
    const lastNumber = parseInt(lastBill.billNumber.slice(-4), 10);
    newNumber = (lastNumber + 1).toString().padStart(4, "0");
  }
  return `${currentYear}${newNumber}`;
};

// GST Invoice HTML Template (Same as yours)
const invoiceTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tax Invoice - {{billNumber}}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; padding: 20px; border: 2px solid #000; }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #000; }
        .company { font-size: 22px; font-weight: bold; }
        .gst-details { font-size: 16px; }
        .info-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .info-table th, .info-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .total { font-weight: bold; font-size: 18px; }
        .footer { text-align: center; margin-top: 30px; font-size: 14px; }
    </style>
</head>
<body>

    <div class="header">
        <div class="company">Tirupur trophies</div>
        <div>123 Business Street, City, Country - 123456</div>
        <div>Email: support@yourbusiness.com | Phone: +91 9876543210</div>
        <div class="gst-details">GSTIN: 12ABCDE3456F7Z | PAN: ABCDE1234F</div>
    </div>

    <h2 class="invoice-title">Tax Invoice</h2>

    <table class="info-table">
        <tr><th>Invoice Number</th><td>{{billNumber}}</td><th>Date</th><td>{{date}}</td></tr>
        <tr><th>Customer Name</th><td>{{customerName}}</td><th>Customer GSTIN</th><td>{{customerGST}}</td></tr>
        <tr><th>Billing Address</th><td colspan="3">{{customerAddress}}</td></tr>
    </table>

    <h3>Item Details</h3>
    <table class="info-table">
        <thead>
            <tr><th>Item Description</th><th>Quantity</th><th>Rate (₹)</th>
                <th>GST (%)</th><th>GST Amount (₹)</th><th>Total (₹)</th></tr>
        </thead>
        <tbody>
            {{#items}}
            <tr><td>{{productId}}</td><td>{{quantity}}</td><td>{{price}}</td>
                <td>{{gst}}</td><td>{{gstAmount}}</td><td>{{total}}</td></tr>
            {{/items}}
        </tbody>
    </table>

    <h3>Billing Summary</h3>
    <table class="info-table">
        <tr><th>Subtotal (Before GST)</th><td>₹{{amount}}</td></tr>
        <tr><th>Total GST Amount</th><td>₹{{gstAmount}}</td></tr>
        <tr class="total"><th>Grand Total (Including GST)</th><td>₹{{totalAmount}}</td></tr>
    </table>

    <div class="footer">
        <p><strong>Terms & Conditions:</strong> Payment due within 15 days. Late payments may attract penalties.</p>
        <p><strong>Thank You for Your Business!</strong></p>
    </div>

</body>
</html>`;

// Generate & Save PDF in File System
const generatePDF = async (html, filePath) => {
  return new Promise((resolve, reject) => {
    pdf.create(html, {}).toFile(filePath, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

// Route: Create PDF and Save Bill
routes.post("/create-pdf", async (req, res) => {
  try {
    const billNumber = await generateUniqueBillNumber();
    const billId = await generateUniqueBillId();
    const date = new Date().toISOString().split("T")[0];

    if (!req.body.items || !Array.isArray(req.body.items)) {
      return res.status(400).json({ error: "Items array is required" });
    }

    let amount = 0;
    const items = req.body.items.map((item) => {
      const quantity = Number(item.quantity || 0);
      const price = Number(item.price || 0);
      const total = quantity * price;
      amount += total;

      const gstRate = Number(item.gst || req.body.gst || 0);
      const gstAmount = (total * gstRate) / 100;
      const totalWithGST = total + gstAmount;

      return {
        ...item,
        quantity,
        price,
        gst: gstRate,
        gstAmount: Number(gstAmount.toFixed(2)),
        total: Number(totalWithGST.toFixed(2)),
      };
    });

    const gstRate = Number(req.body.gst || 0);
    const gstAmount = items.reduce((sum, item) => sum + item.gstAmount, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    const billData = {
      billId,
      billNumber,
      customerName: req.body.customerName,
      customerGST: req.body.customerGST,
      customerAddress: req.body.customerAddress,
      items,
      amount: Number(amount.toFixed(2)),
      gst: gstRate,
      gstAmount: Number(gstAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      date,
    };

    const html = Handlebars.compile(invoiceTemplate)(billData);
    const pdfFilePath = path.join(billsDir, `bill.pdf`);
    await generatePDF(html, pdfFilePath);

    await Bill.findOneAndUpdate(
      { billId },
      { ...billData, pdfPath: pdfFilePath },
      { upsert: true }
    );

    res.status(200).json({
      message: "PDF generated successfully",
      pdfPath: pdfFilePath,
      billNumber,
    });
  } catch (error) {
    console.error("Create PDF error:", error);
    res.status(500).json({ error: "Failed to generate PDF", details: error.message });
  }
});

// Route: Fetch PDF by billNumber
routes.get("/fetch-pdf", (req, res) => {
  const { billNumber } = req.query;

  if (!billNumber) {
    return res.status(400).json({ error: "billNumber query parameter is required" });
  }

  const filePath = path.join(billsDir, `bill.pdf`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "PDF not found" });
  }

  res.sendFile(filePath);
});

module.exports = routes;
