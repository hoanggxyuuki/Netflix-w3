const { AppError } = require('./errorHandler');
const User = require('../models/User');

exports.adminMiddleware = async (req, res, next) => {
  try {
    const walletAddress = req.user.walletAddress;
    const user = await User.findOne({walletAddress: walletAddress});
    
    if (!user || user.role !== 'admin') {
      throw new AppError('Access denied. Admin only.', 403);
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
