const axios = require('axios');
const { AppError } = require('../middlewares/errorHandler');
const { TMDB_API_KEY } = require('../config/env');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

class TMDBService {
  constructor() {
    this.api = axios.create({
      baseURL: TMDB_BASE_URL,
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        'Accept': 'application/json'
      },
      params: {
        language: 'en-US'
      }
    });
  }

  async searchMovies(query, page = 1) {
    try {
      const response = await this.api.get('/search/movie', {
        params: { query, page }
      });
      
      return response.data.results.map(movie => ({
        tmdbId: movie.id,
        title: movie.title,
        description: movie.overview,
        poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
        releaseDate: movie.release_date,
        rating: movie.vote_average / 2,  
        genre: movie.genre_ids
      }));
    } catch (error) {
      throw new AppError('Error searching TMDB movies', 500);
    }
  }

  async getMovieDetails(tmdbId) {
    try {
      const [movieDetails, videos] = await Promise.all([
        this.api.get(`/movie/${tmdbId}`),
        this.api.get(`/movie/${tmdbId}/videos`)
      ]);

      const trailer = videos.data.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );

      return {
        tmdbId: movieDetails.data.id,
        title: movieDetails.data.title,
        description: movieDetails.data.overview,
        poster: movieDetails.data.poster_path ? 
          `${TMDB_IMAGE_BASE_URL}${movieDetails.data.poster_path}` : null,
        backdrop: movieDetails.data.backdrop_path ?
          `${TMDB_IMAGE_BASE_URL}${movieDetails.data.backdrop_path}` : null,
        releaseDate: movieDetails.data.release_date,
        duration: movieDetails.data.runtime,
        rating: movieDetails.data.vote_average / 2,
        genre: movieDetails.data.genres.map(g => g.name),
        trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
      };
    } catch (error) {
      throw new AppError('Error fetching TMDB movie details', 500);
    }
  }

  async getPopularMovies(page = 1) {
    try {
      const response = await this.api.get('/movie/popular', {
        params: { page }
      });


      return response.data.results.map(movie => ({
        tmdbId: movie.id,
        title: movie.title,
        description: movie.overview,
        poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
        releaseDate: movie.release_date,
        rating: movie.vote_average / 2,
        genre: movie.genre_ids
      }));
    } catch (error) {
      throw new AppError('Error fetching popular movies', 500);
    }
  }
  async getMoviesByGenre(genreId, page = 1) {
    try {
      const response = await this.api.get('/discover/movie', {
        params: {
          with_genres: genreId,
          page
        }
      });

      return response.data.results.map(movie => ({
        tmdbId: movie.id,
        title: movie.title,
        description: movie.overview,
        poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
        releaseDate: movie.release_date,
        rating: movie.vote_average / 2,
        genre: movie.genre_ids
      }));
    } catch (error) {
      throw new AppError('Error fetching movies by genre', 500);
    }
  }
}

module.exports = new TMDBService(); 