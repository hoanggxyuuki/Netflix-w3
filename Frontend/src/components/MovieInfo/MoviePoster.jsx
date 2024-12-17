import React from 'react';

const MoviePoster = ({ poster, title, rating }) => {
  return (
    <div className="poster-wrapper">
      <img src={poster} alt={title} className="movie-poster" />
      <div className="poster-overlay">
        <div className="rating">{rating || 'N/A'}</div>
      </div>
    </div>
  );
};

export default MoviePoster; 