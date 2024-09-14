const express = require('express'); // Импортируем express / Import express
const dotenv = require('dotenv'); // Импортируем dotenv для работы с переменными окружения / Import dotenv to handle environment variables
const cors = require('cors'); // Импортируем cors для обработки CORS запросов / Import cors to handle CORS requests
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // Импортируем middleware для обработки ошибок / Import error handling middleware
const connectDB = require('./config/db'); // Импортируем функцию подключения к базе данных / Import database connection function
const path = require('path'); // Импортируем модуль path для работы с путями в файловой системе

dotenv.config(); // Загружаем переменные окружения / Load environment variables

connectDB(); // Подключаемся к базе данных / Connect to the database

const app = express(); // Создаем экземпляр приложения express / Create an express application instance

app.use(cors()); // Используем cors middleware / Use cors middleware
app.use(express.json()); // Middleware для парсинга JSON / Middleware to parse JSON

// Импортируем маршруты / Import routes
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');


// Используем маршруты / Use routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/user', userRoutes);
// Используем маршруты / Use routes
app.use('/api/stats', statsRoutes);
app.use('/api/reports', reportRoutes);

// Маршрут для регистрации / Route for user registration
app.use('/api/auth', authRoutes);
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/activities', activityRoutes);
// Используем маршруты активности / Use activity routes
app.use('/api/activity', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use(notFound); // Middleware для обработки маршрутов, которые не найдены / Middleware to handle not found routes
app.use(errorHandler); // Middleware для обработки ошибок / Middleware to handle errors

const PORT = process.env.PORT || 5000; // Устанавливаем порт / Set the port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Запускаем сервер / Start the server
