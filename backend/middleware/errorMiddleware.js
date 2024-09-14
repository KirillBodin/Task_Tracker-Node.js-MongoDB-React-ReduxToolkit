const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Middleware для обработки ошибок / Error handling middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Если статус 200, меняем его на 500 / If status code is 200, change it to 500
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Показываем стек ошибки только в режиме разработки / Show stack trace only in development mode
    });
};

module.exports = { notFound, errorHandler };
