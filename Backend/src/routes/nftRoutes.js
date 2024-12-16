const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/check-ownership/:movieId', authMiddleware, (req, res) => {
  res.json({ message: 'Check NFT ownership' });
});

router.post('/buy', authMiddleware, (req, res) => {
  res.json({ message: 'Buy NFT endpoint' });
});

module.exports = router; 