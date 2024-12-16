const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('./errorHandler');

exports.authMiddleware = async (req, res, next) => {
  try {
     const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError('No token provided', 401);
    }

     const decoded = jwt.verify(token, process.env.JWT_SECRET);

     const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.user = {
      id: user._id,
      walletAddress: user.walletAddress  
    };

    next();
  } catch (error) {
    next(new AppError(error.message, 401));
  }
};

