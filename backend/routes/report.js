const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");
const ExcelJS = require("exceljs");

// GET /report/download
router.get("/sales", async (req, res) => {
  try {
    const bills = await Bill.find();

    // Prepare sales data for chart (BarChart)
    const sales = bills.map(b => {
      const billDate = b.date ? new Date(b.date).toISOString().split("T")[0] : "30/10/2024"; // Handle missing date
      return {
        date: billDate, // If date exists, use it, else use "Unknown Date"
        totalAmount: b.totalAmount,
      };
    });

    // Prepare sales by category data (PieChart)
    const categories = {};
    bills.forEach(bill => {
      bill.items.forEach(item => {
        categories[item.itemName] = (categories[item.itemName] || 0) + item.total;
      });
    });

    const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));

    res.json({ sales, categories: categoryData });
  } catch (error) {
    console.error("Error fetching report data", error);
    res.status(500).send("Server error");
  }
});



router.get("/download", async (req, res) => {
  try {
    const bills = await Bill.find().sort({ date: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    // Headers
    worksheet.columns = [
      { header: "Bill Number", key: "billNumber", width: 15 },
      { header: "Customer Name", key: "customerName", width: 25 },
      { header: "Address", key: "customerAddress", width: 30 },
      { header: "GST Amount", key: "gstAmount", width: 15 },
      { header: "Total Amount", key: "totalAmount", width: 15 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 20 },
    ];

    // Rows
    bills.forEach((bill) => {
      worksheet.addRow({
        billNumber: bill.billNumber,
        customerName: bill.customerName,
        customerAddress: bill.customerAddress,
        gstAmount: bill.gstAmount,
        totalAmount: bill.totalAmount,
        amount: bill.amount,
        date: new Date(bill.date).toLocaleString(),
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=Sales_Report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel generation failed:", err);
    res.status(500).json({ message: "Error generating report" });
  }
});

module.exports = router;
