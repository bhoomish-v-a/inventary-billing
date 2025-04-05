const express = require("express");
const pdf = require("html-pdf");
const path = require("path");
const pdfTemplate = require("../documents/quotationTemplate");

const Quotation = require("../models/Quatation"); // Import model

const router = express.Router();

router.post("/create-pdf", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear().toString().slice(-2); 
    const lastQuotation = await Quotation.findOne({ quotationId: new RegExp(`^${currentYear}`) })
      .sort({ quotationId: -1 })
      .exec();

    let newNumber = "0001"; 
    if (lastQuotation) {
      const lastNumber = parseInt(lastQuotation.quotationId.slice(-4), 10); 
      newNumber = (lastNumber + 1).toString().padStart(4, "0"); 
    }

    const newQuotationId = `${currentYear}${newNumber}`;

    const quotationData = { ...req.body, quotationId: newQuotationId };
    const newQuotation = new Quotation(quotationData);
    await newQuotation.save();
    pdf.create(pdfTemplate(quotationData), {}).toFile("quotation.pdf", (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to generate PDF" });
      }
      res.sendStatus(200);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save quotation" });
  }
});

router.get("/fetch-pdf", (req, res) => {
  const filePath = path.join(__dirname, "../quotation.pdf");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("File not found");
    }
  });
});

module.exports = router;
