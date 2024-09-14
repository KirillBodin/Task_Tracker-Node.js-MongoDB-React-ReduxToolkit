const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Получение профиля пользователя
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json(user);
};
// Получение всех пользователей
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();  // Получаем всех пользователей
    res.json(users);
});

// Обновление профиля пользователя
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Обновляем данные пользователя
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        // Если загружен файл, обновляем фото профиля
        if (req.file) {
            user.profilePicture = req.file.path;
        }

        const updatedUser = await user.save();

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile,getUsers };
