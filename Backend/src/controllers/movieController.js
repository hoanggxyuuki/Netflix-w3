const Movie = require('../models/Movie');
const movieService = require('../services/movieService');
const ipfsService = require('../services/ipfsService');
const { AppError } = require('../middlewares/errorHandler');
const { validateMovieInput } = require('../utils/validateInput');

exports.getAllMovies = async (req, res, next) => {
  try {
    const movies = await movieService.getAllMovies(req.query);
    
     const response = {
      success: true,
      data: {
        local: movies.local || [],
        tmdb: movies.tmdb || [],
        total: (movies.local ? movies.local.length : 0) + (movies.tmdb ? movies.tmdb.length : 0)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Controller error:', error);  
    next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let movie;

     if (id.match(/^[0-9a-fA-F]{24}$/)) {
       movie = await Movie.findById(id);
    } else {
       try {
        const tmdbResponse = await movieService.getTMDBMovieById(id);
        if (tmdbResponse) {
          movie = {
            id: tmdbResponse.id,
            title: tmdbResponse.title,
            description: tmdbResponse.overview,
            poster: `https://image.tmdb.org/t/p/w500${tmdbResponse.poster_path}`,
            rating: tmdbResponse.vote_average,
            releaseDate: tmdbResponse.release_date,
            tmdbId: tmdbResponse.id,
            source: 'tmdb'
          };
        }
      } catch (error) {
        console.error('TMDB fetch error:', error);
        throw new AppError('Failed to fetch movie from TMDB', 500);
      }
    }

    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const { title, description, price, hasVR, genre, duration, rating } = req.body;
    const { video, vrVideo, poster } = req.files;

    if (!video || !poster) {
      throw new AppError('Video and poster are required', 400);
    }

    const [videoUrl, posterUrl] = await Promise.all([
      ipfsService.uploadFile(video[0].buffer, `${title}-video`),
      ipfsService.uploadFile(poster[0].buffer, `${title}-poster`)
    ]);

    let vrStreamUrl = null;
    if (hasVR === 'true' && vrVideo) {
      vrStreamUrl = await ipfsService.uploadFile(
        vrVideo[0].buffer,
        `${title}-vr-video`
      );
    }

    const movie = await Movie.create({
      title,
      description,
      price: parseFloat(price),
      hasVR: hasVR === 'true',
      streamUrl: videoUrl,
      poster: posterUrl,
      vrStreamUrl,
      genre: genre.split(',').map(g => g.trim()),
      duration: parseInt(duration),
      rating: parseFloat(rating),
      uploadedBy: req.user.id,
      nftContractAddress: process.env.NFT_CONTRACT_ADDRESS
    });

    res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

exports.getMovieStream = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { mode } = req.query;
    let movie;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
       movie = await Movie.findById(id);
    } else {
       try {
        const videoData = await movieService.getTMDBMovieVideos(id);
        const tmdbResponse = await movieService.getTMDBMovieById(id);
        
        if (tmdbResponse && videoData) {
          const video = videoData.results.find(
            v => v.type === "Trailer" || v.type === "Teaser"
          );

          if (!video) {
            throw new AppError('No video available for this movie', 404);
          }

          movie = {
            id: tmdbResponse.id,
            title: tmdbResponse.title,
            description: tmdbResponse.overview,
             streamUrl: `https://www.youtube.com/embed/${video.key}`,
            vrStreamUrl: null,
            hasVR: false,
            duration: video.size || 120,
            source: 'tmdb'
          };
        }
      } catch (error) {
        console.error('TMDB fetch error:', error);
        throw new AppError('Failed to fetch movie from TMDB', 500);
      }
    }

    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

    res.json({
      success: true,
      data: {
        streamUrl: movie.streamUrl,
        title: movie.title,
        duration: movie.duration,
        source: movie.source
      }
    });
  } catch (error) {
    next(error);
  }
}; 
exports.updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const movie = await Movie.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};