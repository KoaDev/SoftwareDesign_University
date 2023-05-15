const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');
const questionController = require('../controllers/QuestionController');
const answerController = require('../controllers/AnswerController');
const tagController = require('../controllers/TagController.js');

const auth = require('../middlewares/authentificate');

router.get('/users/current', auth, userController.getCurrentUser);
router.get('/users/all', auth, userController.getAllUsers);

router.get('/users/:userId/score', userController.getUserScoreById);

router.post('/users', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', auth, userController.logoutUser);
router.put('/users/:userId/score', auth, userController.updateUserScore);
router.delete('/users/:userId', auth, userController.deleteUser);

router.put('/users/:userId/ban', auth, userController.banUser)
router.put('/users/:userId/unban', auth, userController.unbanUser)

router.get('/questions', questionController.getQuestions);
router.get('/questions/:questionId', questionController.getQuestionById);
router.post('/questions', auth, questionController.createQuestion);
router.put('/questions/:questionId', auth, questionController.updateQuestion);
router.delete('/questions/:questionId', auth, questionController.deleteQuestion);
router.post('/questions/:questionId/vote', auth, questionController.voteQuestion);

router.get('/questions/:questionId/answers', answerController.getAnswersByQuestionId);
router.get('/answers/:answerId', answerController.getAnswerById);
router.post('/questions/:questionId/answers', auth, answerController.createAnswer);
router.put('/answers/:answerId', auth, answerController.updateAnswer);
router.delete('/answers/:answerId', auth, answerController.deleteAnswer);
router.post('/answers/:answerId/vote', auth, answerController.voteAnswer);


router.get('/tags', tagController.getTags);
router.post('/tags', auth, tagController.createTag);

module.exports = router;


