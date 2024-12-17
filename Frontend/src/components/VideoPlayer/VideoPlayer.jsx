import React, { useState } from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ url, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`video-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className={`video-container ${isLoading ? 'loading' : ''}`}>
        <div className="video-overlay"></div>
        <iframe
          src={url}
          title="Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Loading video...</span>
          </div>
        )}
        <button className="fullscreen-toggle" onClick={toggleFullscreen}>
          {isFullscreen ? '⤓' : '⤢'}
        </button>
        {onClose && (
          <button className="close-video" onClick={onClose}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer; 