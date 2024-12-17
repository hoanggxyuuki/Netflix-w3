import React from 'react';

const WatchButtons = ({ activeVideo, onWatchTrailer, onWatchMovie }) => {
  return (
    <div className="mode-buttons">
      <button 
        className={`watch-button trailer ${activeVideo === 'trailer' ? 'active' : ''}`}
        onClick={onWatchTrailer}
      >
        <i className="fas fa-play"></i>
        Xem Trailer
      </button>
      <button 
        className={`watch-button ${activeVideo === 'movie' ? 'active' : ''}`}
        onClick={onWatchMovie}
      >
        <i className="fas fa-film"></i>
        Xem Phim
      </button>
    </div>
  );
};

export default WatchButtons; 