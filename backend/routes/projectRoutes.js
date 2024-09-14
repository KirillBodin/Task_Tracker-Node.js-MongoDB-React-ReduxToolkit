const express = require('express'); // Импортируем express / Import express
const router = express.Router(); // Создаем роутер / Create the router
const { protect, checkRole } = require('../middleware/authMiddleware'); // Импортируем middleware для проверки аутентификации и ролей / Import middleware to check authentication and roles
const { getProjects, createProject, updateProject, deleteProject,getProjectTasks} = require('../controllers/projectController');

// Маршрут для получения проектов / Route to get projects
router.route('/').get(protect, checkRole(['client', 'developer', 'admin']), getProjects);

// Маршруты для создания, обновления и удаления проектов / Routes to create, update and delete projects
router.route('/').post(protect, checkRole(['admin']), createProject);
router.route('/:id').put(protect, checkRole(['developer', 'admin']), updateProject);
router.route('/:id').delete(protect, checkRole(['admin']), deleteProject);
// Новый маршрут для получения задач конкретного проекта
router.route('/:projectId/tasks').get(protect, checkRole(['client', 'developer', 'admin']), getProjectTasks);

module.exports = router; // Экспортируем роутер / Export the router
