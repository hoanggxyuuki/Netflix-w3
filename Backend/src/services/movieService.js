const Movie = require('../models/Movie');
const { AppError } = require('../middlewares/errorHandler');
const tmdbService = require('./tmdbService');
const axios = require('axios');

class MovieService {
  async getAllMovies(query = {}) {
    try {
      // Lấy movies từ DB local
      const localMovies = await Movie.find(query);

      // Lấy popular movies từ TMDB
      let tmdbMovies = [];
      try {
        tmdbMovies = await tmdbService.getPopularMovies(1);
      } catch (tmdbError) {
      }

      // Kết hợp và format kết quả
      const combinedMovies = {
        local: localMovies.map(movie => ({
          id: movie._id,
          tmdbId: movie.tmdbId,
          title: movie.title,
          description: movie.description,
          poster: movie.poster,
          releaseDate: movie.releaseDate,
          rating: movie.rating,
          genre: movie.genre,
          source: 'local',
          hasVR: movie.hasVR,
          price: movie.price
        })),
        tmdb: tmdbMovies.map(movie => ({
          ...movie,
          source: 'tmdb',
          hasVR: false,
          price: 0
        }))
      };

      return combinedMovies;
    } catch (error) {
      throw new AppError('Error fetching movies', 500);
    }
  }



  async getMovieById(id) {
    try {
      const movie = await Movie.findById(id);
      if (!movie) {
        throw new AppError('Movie not found', 404);
      }
      return movie;
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  async createMovie(movieData, userId) {
    try {
      const movie = new Movie({
        ...movieData,
        uploadedBy: userId
      });
      return await movie.save();
    } catch (error) {
      throw new AppError('Error creating movie', 500);
    }
  }

  async updateMovie(id, updateData) {
    try {
      const movie = await Movie.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!movie) {
        throw new AppError('Movie not found', 404);
      }
      return movie;
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  async deleteMovie(id) {
    try {
      const movie = await Movie.findByIdAndDelete(id);
      if (!movie) {
        throw new AppError('Movie not found', 404);
      }
      return movie;
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  async getTMDBMovieById(movieId) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            'Accept': 'application/json'
          },
          
        }
      );
      return response.data;
    } catch (error) {
      console.error('TMDB API error:', error);
      throw error;
    }
  }

  async getTMDBMovieVideos(movieId) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            'Accept': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('TMDB API error:', error);
      throw error;
    }
  }
}

module.exports = new MovieService(); 