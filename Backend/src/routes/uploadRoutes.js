const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/movie', authMiddleware, (req, res) => {
  res.json({ message: 'Upload movie endpoint' });
});

module.exports = router; 