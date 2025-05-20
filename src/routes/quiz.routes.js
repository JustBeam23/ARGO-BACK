const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');

// GET all quizzes
router.get('/', quizController.getAllQuizzes);

// GET quizzes by level
router.get('/level/:level', quizController.getQuizzesByLevel);

// GET a single quiz by ID
router.get('/:id', quizController.getQuizById);

// POST create a new quiz
router.post('/', quizController.createQuiz);

// PUT update a quiz
router.put('/:id', quizController.updateQuiz);

// DELETE a quiz
router.delete('/:id', quizController.deleteQuiz);

module.exports = router; 