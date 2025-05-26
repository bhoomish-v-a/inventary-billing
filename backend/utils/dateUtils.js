exports.getDateRange = (type) => {
    const now = new Date();
    let startDate, endDate = new Date();
  
    switch (type) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        throw new Error('Invalid report type');
    }
  
    return { startDate, endDate };
  };
  