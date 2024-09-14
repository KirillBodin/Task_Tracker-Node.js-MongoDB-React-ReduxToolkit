const mongoose = require('mongoose');

const activitySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        details: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
