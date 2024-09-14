// controllers/timerController.js
const Task = require('../models/Task');

const startTaskTimer = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.timerStart = Date.now();
        await task.save();

        res.status(200).json({ message: 'Task timer started', task });
    } catch (error) {
        res.status(500).json({ message: 'Error starting timer', error });
    }
};

const stopTaskTimer = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const currentTime = Date.now();
        const elapsedTime = currentTime - task.timerStart;
        task.timeSpent += elapsedTime;
        task.timerStart = null;
        await task.save();

        res.status(200).json({ message: 'Task timer stopped', task });
    } catch (error) {
        res.status(500).json({ message: 'Error stopping timer', error });
    }
};

const resetTaskTimer = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.timerStart = null;
        task.timeSpent = 0;
        await task.save();

        res.status(200).json({ message: 'Task timer reset', task });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting timer', error });
    }
};

module.exports = { startTaskTimer, stopTaskTimer, resetTaskTimer };
