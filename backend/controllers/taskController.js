const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Activity = require('../models/Activity'); // Импортируем модель Activity
const Notification = require('../models/Notification');
// Получение всех задач / Get all tasks
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find().populate('project', 'title'); // Получаем задачи с информацией о проекте / Get tasks with project information

    // Записываем активность после получения всех задач / Record activity after fetching all tasks
    await Activity.create({
        user: req.user._id,
        action: 'retrieved all tasks',
        details: `Fetched ${tasks.length} tasks.`,
    });

    res.json(tasks);
});

// Создание новой задачи / Create a new task
const createTask = asyncHandler(async (req, res) => {
    const { title, description, project } = req.body;
    const task = new Task({ title, description, project });
    const createdTask = await task.save();

    // Записываем активность после создания задачи / Record activity after creating a task
    await Activity.create({
        user: req.user._id,
        action: 'created a task',
        details: `Created task with title: ${createdTask.title}`,
    });

    res.status(201).json(createdTask);
});


// Обновление задачи
const updateTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const { title, description, project, status, startDate, endDate, timeSpent, assignedTo } = req.body;

    const task = await Task.findById(taskId);

    if (task) {
        task.title = title || task.title;
        task.description = description || task.description;
        task.project = project || task.project;
        task.status = status || task.status;
        task.startDate = startDate || task.startDate;
        task.endDate = endDate || task.endDate;
        task.timeSpent = timeSpent || task.timeSpent;
        task.assignedTo = assignedTo || task.assignedTo;

        // Сохранение обновленной задачи
        const updatedTask = await task.save();

        // Записываем активность после обновления задачи / Record activity after updating a task
        await Activity.create({
            user: req.user._id,
            action: 'updated a task',
            details: `Updated task with title: ${updatedTask.title}, new status: ${updatedTask.status}`,
        });

        res.json(updatedTask);
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
});

// Получение задачи по ID / Get task by ID
const getTaskById = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const task = await Task.findById(taskId).populate('project', 'title');

    if (task) {
        // Записываем активность после получения задачи по ID / Record activity after fetching the task by ID
        await Activity.create({
            user: req.user._id,
            action: 'retrieved a task by ID',
            details: `Fetched task with title: ${task.title}`,
        });

        res.json(task);
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
});


// Получение задач по статусу / Get tasks by status
const getTasksByStatus = async (req, res) => {
    const { status } = req.params;
    try {
        let tasks;
        let statusLabel = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(); // По умолчанию форматируем статус

        if (status.toLowerCase() === 'all') {
            tasks = await Task.find().populate('project');
            statusLabel = 'All'; // Используем "All" как статус
        } else {
            const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
            tasks = await Task.find({ status: formattedStatus }).populate('project');
        }

        // Записываем активность после получения задач по статусу / Record activity after fetching tasks by status
        await Activity.create({
            user: req.user._id,
            action: 'retrieved tasks by status',
            details: `Fetched ${tasks.length} tasks with status: ${statusLabel}`,
        });

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks by status:', error); // Логирование ошибки для отладки
        res.status(500).json({
            message: 'Error fetching tasks by status',
            error: error.message || 'Unknown error', // Добавление сообщения ошибки
        });
    }
};



// Удаление задачи / Delete a task
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        await task.remove();

        // Записываем активность после удаления задачи / Record activity after deleting a task
        await Activity.create({
            user: req.user._id,
            action: 'deleted a task',
            details: `Deleted task with title: ${task.title}`,
        });

        res.json({ message: 'Task removed' });
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
});

module.exports = { getTasks, createTask, updateTask, deleteTask, getTasksByStatus, getTaskById };
