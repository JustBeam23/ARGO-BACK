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
        imageData: {
            type: String, // Base64 encoded image data
            validate: {
                validator: function (v) {
                    // Only validate if value exists
                    if (!v) return true;
                    // Check if it's a valid base64 string (starts with data:image)
                    return v.startsWith('data:image');
                },
                message: props => 'Image data must be a valid base64 encoded image string'
            }
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