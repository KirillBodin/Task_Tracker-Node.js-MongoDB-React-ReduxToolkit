const Activity = require('../models/Activity');

// Получение активности с информацией о пользователе
const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find().populate('user', 'username'); // Используем populate для получения username
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch activities' });
    }
};

// Получение активности конкретного пользователя
const getUserActivity = async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user._id }).populate('user', 'username');
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user activities' });
    }
};

module.exports = { getActivities, getUserActivity };
