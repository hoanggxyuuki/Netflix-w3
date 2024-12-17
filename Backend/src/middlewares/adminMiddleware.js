const { AppError } = require('./errorHandler');

exports.adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      console.log(req.user.role);
      throw new AppError('Access denied. Admin only.', 403);
    }
    next();
  } catch (error) {
    next(error);
  }
};
