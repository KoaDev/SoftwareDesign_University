const express = require('express');
const router = express.Router();

// Import des contrôleurs
const userController = require('../controllers/UserController');
const questionController = require('../controllers/QuestionController');
const answerController = require('../controllers/AnswerController');
const voteController = require('../controllers/VoteController');

const auth = require('../middlewares/authentificate');

// Routes utilisateur
router.post('/users', userController.createUser);
router.post('/login', userController.loginUser);

router.get('/users/current', auth, userController.getCurrentUser);
router.get('/users/all', auth, userController.getAllUsers);

// Routes questions
router.get('/questions', questionController.getQuestions);
router.get('/questions/:questionId', questionController.getQuestionById);
router.post('/questions', auth, questionController.createQuestion);
router.put('/questions/:questionId', auth, questionController.updateQuestion);
router.delete('/questions/:questionId', auth, questionController.deleteQuestion);

// Routes réponses
router.get('/questions/:questionId/answers', answerController.getAnswersByQuestionId);
// router.get('/answers/:answerId', answerController.getAnswerById);
router.post('/questions/:questionId/answers', auth, answerController.createAnswer);
router.put('/answers/:answerId', auth, answerController.updateAnswer);
router.delete('/answers/:answerId', auth, answerController.deleteAnswer);

// Routes votes a refaire tout en entier 
router.post('/questions/:questionId/vote', auth, voteController.voteQuestion);
router.post('/answers/:answerId/vote', auth, voteController.voteAnswer);

module.exports = router;
