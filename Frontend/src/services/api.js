import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào header nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const movieApi = {
  // API không cần auth
  getAll: () => api.get('/movies'),
  getById: (id) => api.get(`/movies/${id}`),

  // API cần auth
  getMovieStream: (id, mode) => 
    api.get(`/movies/${id}/stream`, { params: { mode } }),
  createMovie: (movieData) => 
    api.post('/movies', movieData),
  updateMovie: (id, movieData) => 
    api.put(`/movies/${id}`, movieData),
  deleteMovie: (id) => 
    api.delete(`/movies/${id}`)
};

export const authApi = {
  login: (walletAddress, signature) => 
    api.post('/auth/login', { walletAddress, signature }),
  register: (userData) => 
    api.post('/auth/register', userData),
};

export const nftApi = {
  checkOwnership: (movieId) => 
    api.get(`/nft/check-ownership/${movieId}`),
  buyNFT: (movieId) => 
    api.post('/nft/buy', { movieId }),
};

export default api; 