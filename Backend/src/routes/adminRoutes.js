const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminMiddleware } = require('../middlewares/adminMiddleware');

// Áp dụng middleware cho tất cả routes admin
router.use(authMiddleware, adminMiddleware);

// Admin routes
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

router.get('/users', (req, res) => {
  // Logic lấy danh sách users
});

router.post('/movies', (req, res) => {
  // Logic thêm phim mới
});

module.exports = router;
