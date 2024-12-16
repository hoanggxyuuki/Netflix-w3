import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWeb3 } from '../../contexts/Web3Context';
import './MovieModal.css';

const MovieModal = ({ movie, onClose }) => {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const [loading, setLoading] = useState(false);

  const handleAddToPlaylist = async () => {
    if (!account) {
      toast.warning('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/playlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          movieId: movie.id.toString(),
          tmdbId: movie.tmdbId.toString(),
          title: movie.title,
          poster: movie.poster
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Added to playlist successfully');
        onClose();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add to playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = () => {
    if (!account) {
      toast.warning('Please connect your wallet first');
      return;
    }
    navigate(`/movie/${movie.id || movie.tmdbId}`);
  };

  return (
    <div className="movie-modal-overlay" onClick={onClose}>
      <div className="movie-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-content">
          <div className="modal-image">
            <img src={movie.poster} alt={movie.title} />
          </div>
          
          <div className="modal-info">
            <h2>{movie.title}</h2>
            <p className="rating">Rating: {movie.rating}</p>
            {movie.description && <p className="description">{movie.description}</p>}
            
            {movie.source === 'local' && (
              <div className="movie-details">
                <p>VR Available: {movie.hasVR ? 'Yes' : 'No'}</p>
                <p>Price: {movie.price} ETH</p>
              </div>
            )}

            <div className="modal-actions">
              <button 
                className="watch-btn"
                onClick={handleWatch}
                disabled={loading}
              >
                Watch Now
              </button>
              <button 
                className="playlist-btn"
                onClick={handleAddToPlaylist}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add to Playlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal; 