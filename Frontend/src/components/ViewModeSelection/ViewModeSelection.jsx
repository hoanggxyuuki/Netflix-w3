import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWeb3 } from '../../contexts/Web3Context';
import { movieApi } from '../../services/api';
import './ViewModeSelection.css';

const ViewModeSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account } = useWeb3();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleWatchMovie = async (mode) => {
    if (!account) {
      toast.warning('Vui lòng đăng nhập để xem phim');
      navigate('/login');
      return;
    }

    try {
      const response = await movieApi.getMovieStream(id, mode);
      if (response.data && response.data.data) {
        const { streamUrl } = response.data.data;
        navigate(`/watch/${id}?mode=${mode}&url=${encodeURIComponent(streamUrl)}`);
      } else {
        toast.error('Không thể tải stream phim');
      }
    } catch (error) {
      console.error('Error getting movie stream:', error);
      if (error.response?.status === 401) {
        toast.error('Vui lòng đăng nhập để xem phim');
        navigate('/login');
      } else {
        toast.error('Lỗi khi tải phim');
      }
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!movie) {
    return <div className="error">Không tìm thấy phim</div>;
  }

  return (
    <div className="view-mode-selection">
      <div className="movie-info">
        <h2>{movie.title}</h2>
        {movie.poster && (
          <img src={movie.poster} alt={movie.title} className="movie-poster" />
        )}
        <p className="movie-description">{movie.description}</p>
      </div>

      <div className="mode-buttons">
        <button 
          className="watch-button"
          onClick={() => handleWatchMovie('normal')}
        >
          Xem phim thường
        </button>
        {movie.hasVR && (
          <button 
            className="watch-button vr"
            onClick={() => handleWatchMovie('vr')}
          >
            Xem phim VR
          </button>
        )}
      </div>

      <button 
        className="back-button"
        onClick={() => navigate('/')}
      >
        Quay lại
      </button>
    </div>
  );
};

export default ViewModeSelection;