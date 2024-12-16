const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errorHandler } = require('./src/middlewares/errorHandler');
const { logger } = require('./src/middlewares/loggerMiddleware');

const movieRoutes = require('./src/routes/movieRoutes');
const authRoutes = require('./src/routes/authRoutes');
const nftRoutes = require('./src/routes/nftRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const tmdbRoutes = require('./src/routes/tmdbRoutes');
const playlistRoutes = require('./src/routes/playlistRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const { MONGODB_URI, PORT } = require('./src/config/env');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the VR Cinema API' });
});

app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/nft', nftRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/admin', adminRoutes);
 app.use(errorHandler);

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
