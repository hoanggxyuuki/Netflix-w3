const Movie = require('../models/Movie');
const movieService = require('../services/movieService');
const { AppError } = require('../middlewares/errorHandler');
const { validateMovieInput } = require('../utils/validateInput');

exports.getAllMovies = async (req, res, next) => {
  try {
    const movies = await movieService.getAllMovies(req.query);
    
    // Đảm bảo trả về mảng rỗng nếu không có dữ liệu
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
    console.error('Controller error:', error); // Debug log
    next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let movie;

    // Kiểm tra xem id có phải là MongoDB ObjectId không
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Nếu là ObjectId, tìm trong database local
      movie = await Movie.findById(id);
    } else {
      // Nếu không phải ObjectId, giả định là TMDB ID
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
    const movieData = {
      title: req.body.title,
      description: req.body.description,
      poster: req.body.poster,
      streamUrl: req.body.streamUrl,
      vrStreamUrl: req.body.vrStreamUrl || null,
      hasVR: Boolean(req.body.hasVR),
      duration: req.body.duration,
      releaseDate: req.body.releaseDate,
      rating: req.body.rating,
      genre: req.body.genre,
      price: req.body.price,
      nftContractAddress: req.body.nftContractAddress,
      uploadedBy: req.user.id // Từ auth middleware
    };

    // Validate input
    if (!movieData.title || !movieData.description || !movieData.streamUrl) {
      throw new AppError('Missing required fields', 400);
    }

    // Create movie
    const movie = await Movie.create(movieData);

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
      // Local movie
      movie = await Movie.findById(id);
    } else {
      // TMDB movie
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
            // Trả về embed URL thay vì watch URL
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