const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminMiddleware } = require('../middlewares/adminMiddleware');

 router.use(authMiddleware, adminMiddleware);

 router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

router.get('/users', (req, res) => {
 });

router.post('/movies', (req, res) => {
 });

module.exports = router;
