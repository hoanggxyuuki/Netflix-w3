const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  movies: [{
    movieId: {
      type: String,
      required: true
    },
    tmdbId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    poster: {
      type: String,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist; 