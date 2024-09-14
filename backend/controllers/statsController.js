const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity'); // Импортируем модель Activity

// Получение статистики / Get statistics
const getStats = asyncHandler(async (req, res) => {
    const totalProjects = await Project.countDocuments({});
    const totalTasks = await Task.countDocuments({});
    const completedTasks = await Task.countDocuments({ status: 'Done' });
    const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });

    // Записываем активность после получения статистики / Record activity after fetching statistics
    await Activity.create({
        user: req.user._id,
        action: 'retrieved statistics',
        details: `Statistics retrieved: ${totalProjects} projects, ${totalTasks} tasks, ${completedTasks} completed tasks, ${inProgressTasks} in-progress tasks.`
    });

    res.json({
        totalProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
    });
});

module.exports = { getStats };
