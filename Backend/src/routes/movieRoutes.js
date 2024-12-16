const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { authMiddleware } = require('../middlewares/authMiddleware');

 router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.get('/:id/stream', movieController.getMovieStream);

 router.post('/', authMiddleware, movieController.createMovie);
router.put('/:id', authMiddleware, movieController.updateMovie);
router.delete('/:id', authMiddleware, movieController.deleteMovie);

module.exports = router; 