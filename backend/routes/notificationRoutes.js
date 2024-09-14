const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware'); // Middleware для защиты маршрутов

const router = express.Router();

router.get('/', protect, getNotifications); // Получение уведомлений пользователя
router.put('/:id/read', protect, markAsRead); // Пометка уведомления как прочитанного

module.exports = router;
