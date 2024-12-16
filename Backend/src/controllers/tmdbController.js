const tmdbService = require('../services/tmdbService');
const movieService = require('../services/movieService');
const ipfsService = require('../services/ipfsService');
const { AppError } = require('../middlewares/errorHandler');
const axios = require('axios');

exports.searchMovies = async (req, res, next) => {
  try {
    const { query, page } = req.query;
    if (!query) {
      throw new AppError('Search query is required', 400);
    }

    const movies = await tmdbService.searchMovies(query, page);
    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

exports.getPopularMovies = async (req, res, next) => {
  try {
    const { page } = req.query;
    const movies = await tmdbService.getPopularMovies(page);
    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

exports.importMovieFromTMDB = async (req, res, next) => {
  try {
    const { tmdbId } = req.body;
    if (!tmdbId) {
      throw new AppError('TMDB ID is required', 400);
    }

    // Get movie details from TMDB
    const movieDetails = await tmdbService.getMovieDetails(tmdbId);

    // Download poster and upload to IPFS
    const posterResponse = await axios.get(movieDetails.poster, {
      responseType: 'arraybuffer'
    });
    const posterBuffer = Buffer.from(posterResponse.data);
    const posterIpfsUrl = await ipfsService.uploadFile(posterBuffer);

    // Create movie in our database
    const movie = await movieService.createMovie({
      title: movieDetails.title,
      description: movieDetails.description,
      poster: posterIpfsUrl,
      duration: movieDetails.duration,
      releaseDate: movieDetails.releaseDate,
      rating: movieDetails.rating,
      genre: movieDetails.genre,
      hasVR: false, // Default to false since TMDB movies won't have VR
      price: 0.1, // Set default price
      nftContractAddress: process.env.NFT_CONTRACT_ADDRESS
    }, req.user.id);

    res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

exports.getMoviesByGenre = async (req, res, next) => {
  try {
    const { genreId, page } = req.query;
    if (!genreId) {
      throw new AppError('Genre ID is required', 400);
    }

    const movies = await tmdbService.getMoviesByGenre(genreId, page);
    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    next(error);
  }
}; 