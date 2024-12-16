const NFT = require('../models/NFT');
const User = require('../models/User');
const { AppError } = require('../middlewares/errorHandler');
const { ethers } = require('ethers');
const NFT_ABI = require('../config/nftAbi.json');
const { NFT_CONTRACT_ADDRESS, WEB3_PROVIDER_URL } = require('../config/env');

exports.checkOwnership = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { walletAddress } = req.user;

    // Check NFT ownership on blockchain
    const provider = new ethers.providers.JsonRpcProvider(WEB3_PROVIDER_URL);
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
    
    const balance = await nftContract.balanceOf(walletAddress, movieId);
    const hasNFT = balance.gt(0);

    res.json({
      success: true,
      data: { hasNFT }
    });
  } catch (error) {
    next(error);
  }
};

exports.buyNFT = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    const { walletAddress } = req.user;

     
    const nft = await NFT.create({
      movieId,
      owner: req.user.id,
      tokenId: Date.now(),  
      purchaseDate: new Date()
    });

     await User.findByIdAndUpdate(
      req.user.id,
      { $push: { ownedNFTs: nft._id } }
    );

    res.status(201).json({
      success: true,
      data: nft
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserNFTs = async (req, res, next) => {
  try {
    const nfts = await NFT.find({ owner: req.user.id })
      .populate('movieId', 'title poster');

    res.json({
      success: true,
      data: nfts
    });
  } catch (error) {
    next(error);
  }
}; 