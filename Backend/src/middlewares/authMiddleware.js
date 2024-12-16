const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('./errorHandler');

exports.authMiddleware = async (req, res, next) => {
  try {
    // Kiểm tra token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user và thêm vào request
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.user = {
      id: user._id,
      walletAddress: user.walletAddress // Đảm bảo walletAddress được thêm vào
    };

    next();
  } catch (error) {
    next(new AppError(error.message, 401));
  }
};

