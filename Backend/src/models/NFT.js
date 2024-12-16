const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokenId: {
    type: String,
    required: true,
    unique: true
  },
  contractAddress: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  transactionHash: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'transferred', 'burned'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NFT', nftSchema); 