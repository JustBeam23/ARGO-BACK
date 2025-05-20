const Question = require('../models/question.model');

// Get all questions
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find({});
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get questions by quiz ID
exports.getQuestionsByQuizId = async (req, res) => {
    try {
        const { quizId } = req.params;
        const questions = await Question.find({ quizId });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single question by ID
exports.getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new question
exports.createQuestion = async (req, res) => {
    try {
        // Handle image validation
        if (req.body.imageData) {
            // Check if image is not too large (limit to ~2MB base64 string)
            if (req.body.imageData.length > 2800000) { // ~2MB in base64
                return res.status(400).json({ message: 'Image size too large. Please use an image smaller than 2MB.' });
            }

            // Validate image format
            if (!req.body.imageData.startsWith('data:image/')) {
                return res.status(400).json({ message: 'Invalid image format. Please provide a valid base64 encoded image.' });
            }
        }

        const newQuestion = new Question(req.body);
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create multiple questions for a quiz
exports.createManyQuestions = async (req, res) => {
    try {
        const { quizId, questions } = req.body;

        if (!quizId || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        // Process each question and validate images
        const processedQuestions = questions.map(question => {
            const newQuestion = {
                ...question,
                quizId
            };

            // Validate image data if present
            if (newQuestion.imageData) {
                if (newQuestion.imageData.length > 2800000) { // ~2MB in base64
                    throw new Error(`Image for question "${newQuestion.questionText.substring(0, 30)}..." is too large.`);
                }

                if (!newQuestion.imageData.startsWith('data:image/')) {
                    throw new Error(`Invalid image format for question "${newQuestion.questionText.substring(0, 30)}..."`);
                }
            }

            return newQuestion;
        });

        const savedQuestions = await Question.insertMany(processedQuestions);
        res.status(201).json(savedQuestions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a question
exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        // Handle image validation
        if (req.body.imageData) {
            // Check if image is not too large (limit to ~2MB base64 string)
            if (req.body.imageData.length > 2800000) { // ~2MB in base64
                return res.status(400).json({ message: 'Image size too large. Please use an image smaller than 2MB.' });
            }

            // Validate image format
            if (!req.body.imageData.startsWith('data:image/')) {
                return res.status(400).json({ message: 'Invalid image format. Please provide a valid base64 encoded image.' });
            }
        }

        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json(updatedQuestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete all questions for a quiz
exports.deleteQuestionsByQuizId = async (req, res) => {
    try {
        const { quizId } = req.params;
        const result = await Question.deleteMany({ quizId });

        res.status(200).json({
            message: 'Questions deleted successfully',
            count: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 