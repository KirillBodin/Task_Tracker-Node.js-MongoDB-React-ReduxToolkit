const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
// Получение уведомлений пользователя
const getNotifications = asyncHandler(async (req, res) => {

    const notifications = await Notification.find({ user: req.user._id }).sort({ timestamp: -1 });

    res.json(notifications);
});

// Пометка уведомления как прочитанного / Mark notification as read
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        notification.read = true;
        await notification.save();
        res.json({ message: 'Notification marked as read' });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

module.exports = { getNotifications, markAsRead };
