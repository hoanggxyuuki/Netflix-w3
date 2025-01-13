import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTMDB, setSelectedTMDB] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    price: '',
    video: null,
    vrVideo: null,
    poster: null,
    hasVR: false,
    genre: '',
    duration: '',
    rating: ''
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/movies`);
      const data = await response.json();
      if (data.success) {
        setMovies(data.data.local || []);
      }
    } catch (error) {
      toast.error('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(uploadForm).forEach(key => {
        formData.append(key, uploadForm[key]);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/movies`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast.success('Movie uploaded successfully');
      fetchMovies(); 
      
      setUploadForm({
        title: '',
        description: '',
        price: '',
        video: null, 
        vrVideo: null,
        poster: null,
        hasVR: false,
        genre: '',
        duration: '',
        rating: ''
      });

    } catch (error) {
      toast.error('Failed to upload movie');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        const response = await fetch(`/api/admin/movies/${movieId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          toast.success('Movie deleted successfully');
          fetchMovies();
        }
      } catch (error) {
        toast.error('Failed to delete movie');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="movie-management">
      <h2>Movie Management</h2>
      
      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="text"
          placeholder="Title"
          value={uploadForm.title}
          onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
          required
        />

        <textarea
          placeholder="Description" 
          value={uploadForm.description}
          onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Price (ETH)"
          value={uploadForm.price}
          onChange={(e) => setUploadForm({...uploadForm, price: e.target.value})}
          required
        />

        <div className="file-inputs">
          <div>
            <label>Movie File:</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setUploadForm({...uploadForm, video: e.target.files[0]})}
              required
            />
          </div>

          <div>
            <label>VR Video (Optional):</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setUploadForm({...uploadForm, vrVideo: e.target.files[0]})}
            />
          </div>

          <div>
            <label>Poster Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUploadForm({...uploadForm, poster: e.target.files[0]})}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <input
            type="text"
            placeholder="Genre"
            value={uploadForm.genre}
            onChange={(e) => setUploadForm({...uploadForm, genre: e.target.value})}
            required
          />

          <input
            type="text"
            placeholder="Duration (e.g. 120 min)"
            value={uploadForm.duration}
            onChange={(e) => setUploadForm({...uploadForm, duration: e.target.value})}
            required
          />

          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            placeholder="Rating"
            value={uploadForm.rating}
            onChange={(e) => setUploadForm({...uploadForm, rating: e.target.value})}
            required
          />
        </div>

        <div className="form-row">
          <label>
            <input
              type="checkbox"
              checked={uploadForm.hasVR}
              onChange={(e) => setUploadForm({...uploadForm, hasVR: e.target.checked})}
            />
            Has VR Version
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Movie'}
        </button>
      </form>

      <div className="movies-list">
        {movies.map(movie => (
          <div key={movie._id} className="movie-item">
            <img src={movie.poster} alt={movie.title} />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>{movie.description}</p>
              <p>Price: {movie.price} ETH</p>
              <p>VR: {movie.hasVR ? 'Yes' : 'No'}</p>
            </div>
            <button onClick={() => handleDelete(movie._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieManagement;
