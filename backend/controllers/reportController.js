const reportService = require('../services/reportService');
const excelExporter = require('../utils/excelExporter');

exports.getReport = async (req, res) => {
  const { type } = req.params;
  const report = await reportService.generateReport(type);
  res.json(report);
};

exports.exportReport = async (req, res) => {
  const { type } = req.params;
  const data = await reportService.generateReport(type);
  const buffer = excelExporter.exportToExcel(data, type);
  
  res.setHeader('Content-Disposition', `attachment; filename=${type}-report.xlsx`);
  res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
};
