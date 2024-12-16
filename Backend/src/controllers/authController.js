const { ethers } = require('ethers');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const { AppError } = require('../middlewares/errorHandler');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  try {
    const { walletAddress } = req.body;
    
    // Tìm user hoặc tạo mới nếu chưa tồn tại
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      user = await User.create({ 
        walletAddress,
        role: 'user' // Mặc định là user khi tạo mới
      });
    }

    res.json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { walletAddress, username, email } = req.body;

    // Check if wallet address already exists
    const existingUser = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (existingUser) {
      throw new AppError('Wallet address already registered', 400);
    }

    // Create new user
    const user = await User.create({
      walletAddress: walletAddress.toLowerCase(),
      username,
      email,
      nonce: Math.floor(Math.random() * 1000000)
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-nonce -__v')
      .populate('ownedNFTs');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
}; 