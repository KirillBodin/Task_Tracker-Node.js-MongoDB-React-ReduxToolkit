const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Проверяем, передан ли токен в заголовках
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Декодируем токен для получения ID пользователя
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Находим пользователя по ID из токена, исключаем пароль
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    // Если токен не передан
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error('Not authorized');
        }
        next();
    };
};

module.exports = { protect, checkRole };
