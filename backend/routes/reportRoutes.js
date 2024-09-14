const express = require('express');
const { getProjectStatusReport, getTaskCompletionReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/projects', protect, getProjectStatusReport); // Защищенный маршрут для получения отчета о статусе проектов
router.get('/tasks', protect, getTaskCompletionReport); // Защищенный маршрут для получения отчета о завершении задач

module.exports = router;
