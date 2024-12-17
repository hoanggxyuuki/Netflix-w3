import React from 'react';

const MovieHeader = ({ title, releaseDate }) => {
  return (
    <div className="movie-header">
      <h2>{title}</h2>
      {releaseDate && (
        <span className="release-date">{releaseDate}</span>
      )}
    </div>
  );
};

export default MovieHeader; 