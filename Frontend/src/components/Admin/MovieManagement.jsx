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
    poster: null
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies');
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
    const formData = new FormData();
    Object.keys(uploadForm).forEach(key => {
      if (uploadForm[key]) {
        formData.append(key, uploadForm[key]);
      }
    });

    try {
      const response = await fetch('/api/admin/movies', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        toast.success('Movie uploaded successfully');
        fetchMovies();
        setUploadForm({
          title: '',
          description: '',
          price: '',
          video: null,
          vrVideo: null,
          poster: null
        });
      }
    } catch (error) {
      toast.error('Failed to upload movie');
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
        />
        <textarea
          placeholder="Description"
          value={uploadForm.description}
          onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
        />
        <input
          type="number"
          placeholder="Price (ETH)"
          value={uploadForm.price}
          onChange={(e) => setUploadForm({...uploadForm, price: e.target.value})}
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setUploadForm({...uploadForm, video: e.target.files[0]})}
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setUploadForm({...uploadForm, vrVideo: e.target.files[0]})}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setUploadForm({...uploadForm, poster: e.target.files[0]})}
        />
        <button type="submit">Upload Movie</button>
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
