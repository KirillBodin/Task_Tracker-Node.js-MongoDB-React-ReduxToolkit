const mongoose = require('mongoose');

// Определяем схему комментария / Define the Comment schema
const commentSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Определяем схему задачи / Define the Task schema
const taskSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    status: { type: String, enum: ['Backlog', 'In Progress', 'Review', 'Done'], default: 'Backlog' },
    comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, text: String }],
    startDate: { type: Date, required: true },  // Добавляем дату начала
    endDate: { type: Date, required: true },  // Добавляем дату окончания
    timeSpent: { type: Number, default: 0 },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
