const Task = require('../models/Task');
const Activity = require('../models/Activity'); // Импортируем модель Activity

// Добавление комментария к задаче / Add comment to a task
const addCommentToTask = async (req, res) => {
    const { taskId } = req.params;
    const { text } = req.body;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Добавляем новый комментарий в массив комментариев задачи / Add new comment to the task's comments array
        task.comments.push({ text, user: req.user._id });
        await task.save();

        // Записываем активность после успешного добавления комментария / Record activity after successfully adding the comment
        await Activity.create({
            user: req.user._id,
            action: 'added a comment',
            details: `Comment on task: ${task.title}`
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

module.exports = { addCommentToTask };
