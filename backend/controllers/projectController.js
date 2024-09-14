const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');
const Activity = require('../models/Activity'); // Импортируем модель Activity
const Notification = require('../models/Notification');
// Получение списка проектов / Get all projects
const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find().populate('developer', 'username'); // Получаем проекты с информацией о разработчиках / Get projects with developer information
    res.json(projects);
});

// Создание нового проекта / Create a new project
const createProject = asyncHandler(async (req, res) => {
    const { title, description, startDate, endDate } = req.body;
    const project = new Project({ title, description,startDate: new Date(startDate), // Преобразуем строки в дату
        endDate: new Date(endDate) });
    const createdProject = await project.save();

    // Записываем активность после создания проекта / Record activity after creating the project
    await Activity.create({
        user: req.user._id,
        action: 'created a project',
        details: `Project: ${createdProject.title}`
    });

    res.status(201).json(createdProject);
});
// Получение задач конкретного проекта
const getProjectTasks = async (req, res) => {
    try {
        console.log("Received params:", req.params); // Логирование входных данных
        const tasks = await Task.find({ project: req.params.projectId }); // Запрос на получение задач по projectId
        console.log("Fetched tasks:", tasks); // Логирование найденных задач
        res.json(tasks); // Возвращаем найденные задачи
    } catch (error) {
        console.error("Error fetching project tasks:", error); // Логирование ошибки
        res.status(500).json({ message: 'Error fetching project tasks' });
    }
};

// Обновление проекта / Update a project
const updateProject = asyncHandler(async (req, res) => {
    const { title, description, developerId } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
        project.title = title || project.title;
        project.description = description || project.description;
        const previousStatus = project.status;
        project.status = status || project.status;
        if (developerId) {
            const developer = await User.findById(developerId);
            if (developer) {
                project.developer = developer._id; // Назначаем разработчика / Assign developer
            }
        }
        const updatedProject = await project.save();

        // Записываем активность после обновления проекта / Record activity after updating the project
        await Activity.create({
            user: req.user._id,
            action: 'updated a project',
            details: `Project: ${updatedProject.title}`
        });
        // Отправка уведомления, если проект был завершен / Send notification if the project was completed
        if (previousStatus !== 'Done' && project.status === 'Done') {
            await Notification.create({
                user: project.owner, // Допустим, у проекта есть поле owner для ответственного пользователя
                message: `Project "${project.title}" has been completed.`,
            });
        }

        res.json(updatedProject);
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
});

// Удаление проекта / Delete a project
const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        await project.remove();

        // Записываем активность после удаления проекта / Record activity after deleting the project
        await Activity.create({
            user: req.user._id,
            action: 'deleted a project',
            details: `Project: ${project.title}`
        });

        res.json({ message: 'Project removed' });
    } else {
        res.status(404);
        throw new Error('Project not found');
    }
});

module.exports = { getProjects, createProject, updateProject, deleteProject,getProjectTasks };
