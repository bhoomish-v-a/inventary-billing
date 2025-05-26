const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user?.role; // Access role from `req.user`
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }
      next();
    };
  };
  
  module.exports = authorizeRole;