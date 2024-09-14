const mongoose = require('mongoose'); // Импортируем mongoose для работы с MongoDB
const argon2 = require('argon2'); // Импортируем argon2 для хеширования паролей

// Определение схемы пользователя
const userSchema = mongoose.Schema({
    username: {
        type: String, // Тип данных - строка
        required: true, // Обязательное поле
        unique: true, // Уникальное значение
    },
    email: {
        type: String, // Тип данных - строка
        required: true, // Обязательное поле
        unique: true, // Уникальное значение
        match: [/.+@.+\..+/, 'Please enter a valid email address'] // Валидация email
    },
    password: {
        type: String, // Тип данных - строка
        required: true, // Обязательное поле
    },
    role: {
        type: String, // Тип данных - строка
        enum: ['client', 'developer', 'admin'], // Допустимые значения для ролей
        default: 'client', // По умолчанию роль - клиент
    },
    profilePicture: {
        type: String, // Тип данных - строка (ссылка на изображение)
        default: '', // По умолчанию пустое значение
    },
}, {
    timestamps: true, // Добавление временных меток создания и обновления
});

// Метод для хеширования пароля перед сохранением
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { // Если пароль не был изменен, переходим к следующему middleware
        return next();
    }
    try {
        // Хешируем пароль с помощью argon2
        this.password = await argon2.hash(this.password);
        next();
    } catch (error) {
        next(error); // Передаем ошибку дальше, если хеширование не удалось
    }
});

// Метод для проверки пароля
userSchema.methods.matchPassword = async function (enteredPassword) {
    try {
        // Сравниваем введенный пароль с хешированным паролем
        return await argon2.verify(this.password, enteredPassword);
    } catch (error) {
        return false; // Возвращаем false, если проверка не удалась
    }
};

const User = mongoose.model('User', userSchema); // Создаем модель пользователя на основе схемы

module.exports = User; // Экспортируем модель пользователя
