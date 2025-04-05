module.exports = ({ quotationId, customerName, address, phone, date, items, grandTotal }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #f8f8f8;
        }
        .container {
          max-width: 800px;
          margin: auto;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .header h2 {
          color: #333;
          margin: 0;
        }
        .header p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
        .quotation-info {
          margin-bottom: 20px;
        }
        .quotation-info p {
          margin: 5px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
          text-transform: uppercase;
        }
        .total {
          font-weight: bold;
          font-size: 18px;
          text-align: right;
          padding-top: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #777;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header Section -->
        <div class="header">
          <h2>Tirupur Trophies</h2>
          <p>Padmavathi Puram, Tiruppur, Tamil Nadu 641603 | Phone: +91 98765 43210</p>
        </div>

        <!-- Quotation Information -->
        <div class="quotation-info">
          <p><strong>Quotation ID:</strong> ${quotationId}</p>
          <p><strong>Customer Name:</strong> ${customerName}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Date:</strong> ${date}</p>
        </div>

        <!-- Table -->
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) => `
                <tr>
                  <td>${item.productId}</td>
                  <td>${item.size}</td>
                  <td>${item.quantity}</td>
                  <td>₹${parseFloat(item.price).toFixed(2)}</td>
                  <td>₹${parseFloat(item.cost).toFixed(2)}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>

        <!-- Total -->
        <h3 class="total">Grand Total: ₹${parseFloat(grandTotal).toFixed(2)}</h3>

        <!-- Footer -->
        <div class="footer">
          <p>Thank you for choosing Tirupur Trophies!</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
