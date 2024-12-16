import { useState } from 'react';
import PropTypes from 'prop-types';
import MovieModal from '../MovieModal/MovieModal';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="movie-card" onClick={() => setShowModal(true)}>
        <img src={movie.poster} alt={movie.title} />
        <h3>{movie.title}</h3>
        <div className="movie-info">
          <span>Rating: {movie.rating}</span>
          {movie.source === 'local' && (
            <>
              <span>VR: {movie.hasVR ? 'Yes' : 'No'}</span>
              <span>Price: {movie.price} ETH</span>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <MovieModal 
          movie={movie} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number,
    tmdbId: PropTypes.number,
    title: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    rating: PropTypes.number,
    source: PropTypes.string.isRequired,
    hasVR: PropTypes.bool,
    price: PropTypes.number
  }).isRequired
};

export default MovieCard;