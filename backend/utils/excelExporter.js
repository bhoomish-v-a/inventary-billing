const ExcelJS = require('exceljs');

exports.exportToExcel = (data, type) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${type} Report`);

  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Customer', key: 'customerName', width: 25 },
    { header: 'Amount', key: 'totalAmount', width: 15 },
    { header: 'GST', key: 'gst', width: 10 },
    { header: 'Grand Total', key: 'grandTotal', width: 20 },
  ];

  data.forEach((item) => worksheet.addRow(item));

  return workbook.xlsx.writeBuffer();
};
