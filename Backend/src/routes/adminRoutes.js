const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const movieController = require('../controllers/movieController');
const adminController = require('../controllers/adminController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, 
  }
});

const uploadFields = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'vrVideo', maxCount: 1 },
  { name: 'poster', maxCount: 1 }
]);

router.use(authMiddleware, adminMiddleware);

router.post('/movies', uploadFields, movieController.createMovie);

router.get('/dashboard-stats', adminController.getDashboardStats);

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

router.get('/users', adminController.getUsers);
router.patch('/users/:userId/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);

module.exports = router;
