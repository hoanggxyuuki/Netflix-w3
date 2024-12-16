const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  streamUrl: {
    type: String,
    required: true
  },
  vrStreamUrl: {
    type: String,
    default: null
  },
  hasVR: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    required: true
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  genre: [{
    type: String,
    required: true
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  nftContractAddress: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema); 