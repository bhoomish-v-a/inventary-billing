const Bill = require('../models/Bill');
const { getDateRange } = require('../utils/dateUtils');

exports.generateReport = async (type) => {
  const { startDate, endDate } = getDateRange(type);
  return await Bill.find({ date: { $gte: startDate, $lte: endDate } }).lean();
};
