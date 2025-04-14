// Admin middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  // Check if user exists and is an admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập tính năng này',
    });
  }
  
  // User is an admin, proceed
  next();
};

module.exports = {
  isAdmin
}; 