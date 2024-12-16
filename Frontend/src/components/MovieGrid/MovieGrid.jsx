import React, { useState, useEffect } from 'react';
import MovieCard from '../MovieCard/MovieCard';

const MovieGrid = () => {
  const [movies, setMovies] = useState({ local: [], tmdb: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/movies');
        const result = await response.json();
        
        if (result.success) {
          setMovies(result.data);
        } else {
          setError('Failed to fetch movies');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const allMovies = [...(movies.local || []), ...(movies.tmdb || [])];

  return (
    <div className="movie-grid">
      {allMovies.map((movie) => (
        <MovieCard
          key={movie.id || movie.tmdbId || Math.random()}
          movie={{
            ...movie,
            id: movie.id || movie.tmdbId
          }}
        />
      ))}
    </div>
  );
};

export default MovieGrid;