const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            required: true,
            enum: ['easy', 'medium', 'hard'],
        },
        timeLimit: {
            type: Number,
            required: true,
            min: 1,
        },
        category: {
            type: String,
            required: true,
            default: 'Triangle',
        },
        image: {
            type: String,
            default: '📐',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz; 