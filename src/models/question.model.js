const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true,
        },
        questionText: {
            type: String,
            required: true,
        },
        image: {
            type: String, // URL to image if needed
        },
        options: [
            {
                text: {
                    type: String,
                    required: true,
                },
                isCorrect: {
                    type: Boolean,
                    required: true,
                    default: false,
                },
            },
        ],
        explanation: {
            type: String, // Explanation of the answer for learning
        },
        points: {
            type: Number,
            default: 1, // Default points for each correct answer
        },
    },
    {
        timestamps: true,
    }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question; 