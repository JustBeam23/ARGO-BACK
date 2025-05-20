const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');

// GET all questions
router.get('/', questionController.getAllQuestions);

// GET questions by quiz ID
router.get('/quiz/:quizId', questionController.getQuestionsByQuizId);

// GET a single question by ID
router.get('/:id', questionController.getQuestionById);

// POST create a new question
router.post('/', questionController.createQuestion);

// POST create multiple questions for a quiz
router.post('/many', questionController.createManyQuestions);

// PUT update a question
router.put('/:id', questionController.updateQuestion);

// DELETE a question
router.delete('/:id', questionController.deleteQuestion);

// DELETE all questions for a quiz
router.delete('/quiz/:quizId', questionController.deleteQuestionsByQuizId);

module.exports = router; 