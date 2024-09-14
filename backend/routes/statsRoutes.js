const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const { getStats } = require('../controllers/statsController');

// Маршрут для получения статистики / Route to get statistics
router.route('/').get(protect, checkRole(['admin']), getStats);

module.exports = router;
