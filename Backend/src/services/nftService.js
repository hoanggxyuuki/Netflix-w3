const NFT = require('../models/NFT');
const User = require('../models/User');
const { ethers } = require('ethers');
const { AppError } = require('../middlewares/errorHandler');
const { NFT_CONTRACT_ADDRESS, WEB3_PROVIDER_URL } = require('../config/env');
const NFT_ABI = require('../config/nftAbi.json');

class NFTService {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(WEB3_PROVIDER_URL);
    this.nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, this.provider);
  }

  async verifyOwnership(walletAddress, movieId) {
    try {
      const balance = await this.nftContract.balanceOf(walletAddress, movieId);
      return balance.gt(0);
    } catch (error) {
      throw new AppError('Error verifying NFT ownership', 500);
    }
  }

  async mintNFT(movieId, userId, transactionHash) {
    try {
      const nft = await NFT.create({
        movieId,
        owner: userId,
        tokenId: Date.now().toString(),
        contractAddress: NFT_CONTRACT_ADDRESS,
        transactionHash
      });

      await User.findByIdAndUpdate(
        userId,
        { $push: { ownedNFTs: nft._id } }
      );

      return nft;
    } catch (error) {
      throw new AppError('Error minting NFT', 500);
    }
  }

  async getUserNFTs(userId) {
    try {
      return await NFT.find({ owner: userId })
        .populate('movieId', 'title poster')
        .sort('-purchaseDate');
    } catch (error) {
      throw new AppError('Error fetching user NFTs', 500);
    }
  }

  async transferNFT(nftId, fromUserId, toWalletAddress) {
    try {
      const nft = await NFT.findById(nftId);
      if (!nft) {
        throw new AppError('NFT not found', 404);
      }

      if (nft.owner.toString() !== fromUserId.toString()) {
        throw new AppError('Not authorized to transfer this NFT', 403);
      }

       nft.status = 'transferred';
      await nft.save();

       await User.findByIdAndUpdate(
        fromUserId,
        { $pull: { ownedNFTs: nftId } }
      );

      return nft;
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }
}

module.exports = new NFTService(); 