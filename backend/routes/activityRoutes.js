const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getActivities, getUserActivity } = require('../controllers/activityController');

// Маршрут для получения всех активностей
router.get('/', protect, getActivities);

// Маршрут для получения активности конкретного пользователя
router.get('/myactivity', protect, getUserActivity);

module.exports = router;
