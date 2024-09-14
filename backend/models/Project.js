const mongoose = require('mongoose');

// Определение схемы проекта / Define the Project schema
const projectSchema = mongoose.Schema({
    title: {
        type: String, // Тип данных - строка / Data type is string
        required: true, // Обязательное поле / Required field
    },
    description: {
        type: String, // Тип данных - строка / Data type is string
        required: true, // Обязательное поле / Required field
    },
    developer: {
        type: mongoose.Schema.Types.ObjectId, // Тип данных - ObjectId / Data type is ObjectId
        ref: 'User', // Ссылка на модель пользователя / Reference to the User model
    },
    startDate: { type: Date, required: true },  // Добавляем дату начала проекта
    endDate: { type: Date, required: true },  // Добавляем дату окончания проекта

}, {
    timestamps: true, // Добавление временных меток создания и обновления / Add created and updated timestamps
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; // Экспортируем модель проекта / Export the Project model
