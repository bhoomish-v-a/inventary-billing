module.exports = (billing) => {
  return `
   <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tax Invoice - {{billNumber}}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; padding: 20px; border: 2px solid #000; }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #000; }
        .company { font-size: 22px; font-weight: bold; }
        .gst-details { margin-top: 10px; font-size: 16px; }
        .invoice-title { font-size: 26px; font-weight: bold; text-align: center; color: #333; }
        .info-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .info-table th, .info-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .total { font-weight: bold; font-size: 18px; }
        .footer { text-align: center; margin-top: 30px; font-size: 14px; }
    </style>
</head>
<body>

    <!-- Company Header -->
    <div class="header">
        <div class="company">Your Business Name Pvt Ltd</div>
        <div>123 Business Street, City, Country - 123456</div>
        <div>Email: support@yourbusiness.com | Phone: +91 9876543210</div>
        <div class="gst-details">GSTIN: 12ABCDE3456F7Z | PAN: ABCDE1234F</div>
    </div>

    <h2 class="invoice-title">Tax Invoice</h2>

    <!-- Invoice Details -->
    <table class="info-table">
        <tr>
            <th>Invoice Number</th>
            <td>{{billNumber}}</td>
            <th>Date</th>
            <td>{{date}}</td>
        </tr>
        <tr>
            <th>Customer Name</th>
            <td>{{customerName}}</td>
            <th>Customer GSTIN</th>
            <td>{{customerGST}}</td>
        </tr>
        <tr>
            <th>Billing Address</th>
            <td colspan="3">{{customerAddress}}</td>
        </tr>
    </table>

    <!-- Item Details -->
    <h3>Item Details</h3>
    <table class="info-table">
        <thead>
            <tr>
                <th>Item Description</th>
                <th>HSN Code</th>
                <th>Quantity</th>
                <th>Rate (₹)</th>
                <th>Amount (₹)</th>
                <th>GST (%)</th>
                <th>GST Amount (₹)</th>
                <th>Total (₹)</th>
            </tr>
        </thead>
        <tbody>
            {{#items}}
            <tr>
                <td>{{itemName}}</td>
                <td>{{hsnCode}}</td>
                <td>{{quantity}}</td>
                <td>{{price}}</td>
                <td>{{amount}}</td>
                <td>{{gst}}</td>
                <td>{{gstAmount}}</td>
                <td>{{total}}</td>
            </tr>
            {{/items}}
        </tbody>
    </table>

    <!-- Summary -->
    <h3>Billing Summary</h3>
    <table class="info-table">
        <tr>
            <th>Subtotal (Before GST)</th>
            <td>₹{{amount}}</td>
        </tr>
        <tr>
            <th>Total GST Amount</th>
            <td>₹{{gstTotal}}</td>
        </tr>
        <tr class="total">
            <th>Grand Total (Including GST)</th>
            <td>₹{{totalAmount}}</td>
        </tr>
    </table>

    <div class="footer">
        <p><strong>Terms & Conditions:</strong> Payment due within 15 days. Late payments may attract penalties.</p>
        <p><strong>Thank You for Your Business!</strong></p>
    </div>

</body>
</html>
  `;
};
