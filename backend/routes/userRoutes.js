const express = require('express'); // Импортируем express / Import express
const router = express.Router(); // Создаем роутер / Create the router
const { protect, checkRole } = require('../middleware/authMiddleware'); // Импортируем middleware для проверки аутентификации и ролей / Import middleware to check authentication and roles
const { getUsers,getUserProfile, updateUserProfile } = require('../controllers/userController');
const multer = require('multer');
const path = require('path');

// Конфигурация хранения файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Проверка типа файла
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

// Настройка Multer для загрузки изображений
const upload = multer({ dest: 'uploads/' });
router.get('/', protect, checkRole(['admin']), getUsers);
router.put('/profile', protect, upload.single('profilePicture'), updateUserProfile);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router; // Экспортируем роутер / Export the router
