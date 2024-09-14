const express = require('express');
const { registerUser, authUser } = require('../controllers/authController'); // Импорт контроллеров / Import controllers

const router = express.Router();

// Маршрут для регистрации пользователя / Route for user registration
router.post('/register', registerUser);
// Маршрут для входа пользователя / Route for user login
router.post('/login', authUser);

module.exports = router;
