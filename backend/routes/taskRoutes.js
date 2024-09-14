const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const { getTasks, createTask, updateTask, deleteTask, getTasksByStatus, getTaskById } = require('../controllers/taskController');
const { addCommentToTask } = require('../controllers/commentController');
const { startTaskTimer, stopTaskTimer, resetTaskTimer } = require('../controllers/timerController'); // Импортируем функции таймера

// Маршруты для задач
router.route('/')
    .get(protect, checkRole(['client', 'developer', 'admin']), getTasks)
    .post(protect, checkRole(['developer', 'admin']), createTask);

router.get('/:id', protect, checkRole(['client', 'developer', 'admin']), getTaskById);
router.route('/:id')
    .put(protect, checkRole(['developer', 'admin']), updateTask)
    .delete(protect, checkRole(['admin']), deleteTask);

router.get('/status/:status', protect, checkRole(['client', 'developer', 'admin']), getTasksByStatus);
router.post('/:taskId/comments', protect, addCommentToTask);

// Маршруты для управления таймером задачи
router.route('/:taskId/start-timer').put(protect, startTaskTimer);
router.route('/:taskId/stop-timer').put(protect, stopTaskTimer);
router.route('/:taskId/reset-timer').put(protect, resetTaskTimer);

module.exports = router;
