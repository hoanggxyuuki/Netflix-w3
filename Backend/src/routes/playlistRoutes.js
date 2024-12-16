const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware, playlistController.addToPlaylist);
router.get('/', authMiddleware, playlistController.getPlaylist);
router.delete('/:movieId', authMiddleware, playlistController.removeFromPlaylist);

module.exports = router; 