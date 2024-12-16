const User = require('../models/User');
const { AppError } = require('../middlewares/errorHandler');
const { generateToken } = require('../utils/generateToken');

class UserService {
  async createUser(userData) {
    try {
      const user = await User.create({
        ...userData,
        nonce: Math.floor(Math.random() * 1000000)
      });
      
      const token = generateToken(user._id);
      return { user, token };
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError('User already exists', 400);
      }
      throw new AppError('Error creating user', 500);
    }
  }

  async getUserByWallet(walletAddress) {
    try {
      const user = await User.findOne({ 
        walletAddress: walletAddress.toLowerCase() 
      });
      return user;
    } catch (error) {
      throw new AppError('Error finding user', 500);
    }
  }

  async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );
      if (!user) {
        throw new AppError('User not found', 404);
      }
      return user;
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  async updateWatchHistory(userId, movieId, progress) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const watchHistoryEntry = user.watchHistory.find(
        entry => entry.movie.toString() === movieId.toString()
      );

      if (watchHistoryEntry) {
        watchHistoryEntry.progress = progress;
        watchHistoryEntry.watchedAt = new Date();
      } else {
        user.watchHistory.push({
          movie: movieId,
          progress
        });
      }

      await user.save();
      return user;
    } catch (error) {
      throw new AppError('Error updating watch history', 500);
    }
  }

  async getWatchHistory(userId) {
    try {
      const user = await User.findById(userId)
        .populate('watchHistory.movie', 'title poster duration');
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user.watchHistory;
    } catch (error) {
      throw new AppError('Error fetching watch history', 500);
    }
  }
}

module.exports = new UserService(); 