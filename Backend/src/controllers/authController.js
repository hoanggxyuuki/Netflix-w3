const { ethers } = require('ethers');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const { AppError } = require('../middlewares/errorHandler');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

exports.login = async (req, res, next) => {
  try {
    const { walletAddress, signature } = req.body;
    

    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      user = await User.create({ 
        walletAddress: walletAddress.toLowerCase(),
        role: 'user' 
      });
    }

    const token = jwt.sign(
      { 
        id: user._id,
        walletAddress: user.walletAddress,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          walletAddress: user.walletAddress,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { walletAddress, username, email } = req.body;

    const existingUser = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (existingUser) {
      throw new AppError('Wallet address already registered', 400);
    }

    const user = await User.create({
      walletAddress: walletAddress.toLowerCase(),
      username,
      email,
      nonce: Math.floor(Math.random() * 1000000)
    });

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