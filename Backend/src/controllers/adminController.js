const Movie = require('../models/Movie');
const User = require('../models/User');
const { AppError } = require('../middlewares/errorHandler');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalMovies] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments()
    ]);

    const movies = await Movie.find({}, 'price');
    const totalRevenue = movies.reduce((sum, movie) => sum + (movie.price || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalMovies,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('walletAddress username email role createdAt lastLogin')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      throw new AppError('Invalid role', 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('walletAddress username email role');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 