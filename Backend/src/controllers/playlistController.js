const Playlist = require('../models/Playlist');
const { AppError } = require('../middlewares/errorHandler');

exports.addToPlaylist = async (req, res, next) => {
  try {
    const { movieId, tmdbId, title, poster } = req.body;
    const walletAddress = req.user.walletAddress;

    let playlist = await Playlist.findOne({ walletAddress });
    
    if (!playlist) {
      playlist = await Playlist.create({
        walletAddress,
        movies: []
      });
    }

    const movieExists = playlist.movies.some(movie => movie.movieId === movieId);
    if (movieExists) {
      return res.status(400).json({
        success: false,
        message: 'Movie already exists in playlist'
      });
    }

    playlist.movies.push({
      movieId,
      tmdbId,
      title,
      poster
    });

    await playlist.save();

    res.json({
      success: true,
      message: 'Movie added to playlist successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getPlaylist = async (req, res, next) => {
  try {
    const { walletAddress } = req.user;
    const playlist = await Playlist.findOne({ walletAddress });

    res.json({
      success: true,
      data: playlist?.movies || []
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFromPlaylist = async (req, res, next) => {
  try {
    const { walletAddress } = req.user;
    const { movieId, tmdbId } = req.params;

    const playlist = await Playlist.findOne({ walletAddress });
    
    if (!playlist) {
      throw new AppError('Playlist not found', 404);
    }

    playlist.movies = playlist.movies.filter(m => 
      !(movieId && m.movieId?.toString() === movieId) && 
      !(tmdbId && m.tmdbId === parseInt(tmdbId))
    );

    await playlist.save();

    res.json({
      success: true,
      message: 'Removed from playlist successfully',
      data: playlist
    });
  } catch (error) {
    next(error);
  }
}; 