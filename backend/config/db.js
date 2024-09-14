const mongoose = require('mongoose'); // Импортируем mongoose / Import mongoose
const colors = require('colors'); // Импортируем colors для цветного форматирования логов / Import colors for colored logging

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline); // Лог успешного подключения с цветным форматированием / Log successful connection with colored formatting
    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline); // Лог ошибки подключения с цветным форматированием / Log connection error with colored formatting
        process.exit(1); // Завершаем процесс с ошибкой / Exit process with failure
    }
};

module.exports = connectDB;
