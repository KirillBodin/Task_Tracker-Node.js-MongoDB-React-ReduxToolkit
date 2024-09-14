const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const Activity = require('../models/Activity');

// Получение отчета о статусе проектов
const getProjectStatusReport = asyncHandler(async (req, res) => {
    const projects = await Project.find({});

    const reportData = await Promise.all(projects.map(async project => {
        const tasks = await Task.find({ project: project._id });
        const tasksCount = tasks.length;

        const developers = await User.find({ role: 'developer', _id: { $in: tasks.map(task => task.assignedTo) } });
        const developersCount = developers.length;

        const commentsCount = tasks.reduce((total, task) => total + task.comments.length, 0);

        const timeSpent = calculateTimeSpentOnProject(tasks);

        return {
            title: project.title,
            status: project.status,
            startDate: project.startDate,
            endDate: project.endDate,
            developersCount,
            tasksCount,
            timeSpent,
            commentsCount
        };
    }));

    await Activity.create({
        user: req.user._id,
        action: 'Generated Project Status Report',
        details: `User ${req.user.username} generated a report on project statuses.`,
        timestamp: new Date(),
    });

    res.json(reportData);
});

// Функция для подсчета времени, потраченного на проект, на основе задач
const calculateTimeSpentOnProject = (tasks) => {
    let totalTime = 0;
    tasks.forEach(task => {
        if (task.timeSpent) {
            totalTime += task.timeSpent;
        }
    });
    return totalTime;
};

// Получение отчета о завершении задач
const getTaskCompletionReport = asyncHandler(async (req, res) => {
    const tasks = await Task.find({});

    const reportData = tasks.map(task => ({
        title: task.title,
        project: task.project ? task.project.title : 'N/A',
        status: task.status,
        startDate: task.startDate,
        endDate: task.endDate,
        duration: task.timeSpent,
        commentsCount: task.comments.length
    }));

    await Activity.create({
        user: req.user._id,
        action: 'Generated Task Completion Report',
        details: `User ${req.user.username} generated a report on task completions.`,
        timestamp: new Date(),
    });

    res.json(reportData);
});

module.exports = { getProjectStatusReport, getTaskCompletionReport };
