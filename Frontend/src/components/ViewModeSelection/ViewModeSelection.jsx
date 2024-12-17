import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWeb3 } from '../../contexts/Web3Context';
import { movieApi } from '../../services/api';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import './ViewModeSelection.css';

const ViewModeSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account } = useWeb3();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await movieApi.getById(id);
      if (response.data && response.data.data) {
        setMovie(response.data.data);
      } else {
        toast.error('Không tìm thấy thông tin phim');
      }
    } catch (error) {
      console.error('Error fetching movie:', error);
      toast.error('Lỗi khi tải thông tin phim');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchTrailer = async () => {
    try {
      const response = await movieApi.getMovieStream(id, 'trailer');
      if (response.data.success) {
        setVideoUrl(response.data.data.streamUrl);
        setActiveVideo('trailer');
      } else {
        toast.error('Không thể tải trailer');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      toast.error('Không có trailer cho phim này');
    }
  };

  const handleWatchMovie = async () => {
    if (!account) {
      toast.warning('Vui lòng đăng nhập để xem phim');
      navigate('/login');
      return;
    }

    try {
      const response = await movieApi.getMovieStream(id, 'movie');
      if (response.data.success) {
        setVideoUrl(response.data.data.streamUrl);
        setActiveVideo('movie');
      } else {
        toast.error('Không thể tải phim');
      }
    } catch (error) {
      console.error('Error fetching movie stream:', error);
      toast.error('Tính năng xem phim đang được phát triển');
    }
  };

  const closeVideo = () => {
    setVideoUrl(null);
    setActiveVideo(null);
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!movie) {
    return <div className="error">Không tìm thấy phim</div>;
  }

  return (
    <div className="view-mode-container">
      <div 
        className="view-mode-backdrop" 
        style={{
          backgroundImage: `url(${movie.poster})`
        }} 
      />
      
      <div className="view-mode-content">
        <div className="movie-info">
          <div className="movie-header">
            <h2>{movie.title}</h2>
            {movie.releaseDate && (
              <span className="release-date">{movie.releaseDate}</span>
            )}
          </div>
          
          <div className="poster-section">
            <div className="poster-wrapper">
              <img src={movie.poster} alt={movie.title} className="movie-poster" />
              <div className="poster-overlay">
                <div className="rating">{movie.rating || 'N/A'}</div>
              </div>
            </div>
            <div className="movie-details">
              <p className="movie-description">{movie.description}</p>
              <div className="mode-buttons">
                <button 
                  className={`watch-button trailer ${activeVideo === 'trailer' ? 'active' : ''}`}
                  onClick={handleWatchTrailer}
                >
                  <i className="fas fa-play"></i>
                  Xem Trailer
                </button>
                <button 
                  className={`watch-button ${activeVideo === 'movie' ? 'active' : ''}`}
                  onClick={handleWatchMovie}
                >
                  <i className="fas fa-film"></i>
                  Xem Phim
                </button>
              </div>
              {videoUrl && (
                <div className="video-player-section">
                  <VideoPlayer url={videoUrl} onClose={closeVideo} />
                </div>
              )}
            </div>
          </div>
        </div>

        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          <i className="fas fa-arrow-left"></i>
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default ViewModeSelection;