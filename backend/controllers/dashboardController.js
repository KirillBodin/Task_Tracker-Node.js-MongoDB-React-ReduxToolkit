const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Task = require('../models/Task');

// Получение аналитики для дашборда / Get dashboard analytics
const getDashboardAnalytics = asyncHandler(async (req, res) => {
    const totalProjects = await Project.countDocuments({});
    const totalTasks = await Task.countDocuments({});
    const completedTasks = await Task.countDocuments({ status: 'Done' });
    const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });

    // Вычисляем процент завершенных задач / Calculate completion percentage
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
        totalProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        completionPercentage,
    });
});

module.exports = { getDashboardAnalytics };
