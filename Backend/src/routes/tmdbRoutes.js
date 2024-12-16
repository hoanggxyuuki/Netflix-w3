const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const tmdbController = require('../controllers/tmdbController');

router.get('/search', authMiddleware, tmdbController.searchMovies);
router.get('/popular', authMiddleware, tmdbController.getPopularMovies);
router.get('/genre', authMiddleware, tmdbController.getMoviesByGenre);
router.post('/import', authMiddleware, tmdbController.importMovieFromTMDB);

module.exports = router; 