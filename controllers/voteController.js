//TO REBUILD ALL

const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');

const voteQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { type } = req.body;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const user = await User.findById(req.userData.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user);

    if (type === 'upvote') {
      if (!question.upvotes.includes(user._id)) {
        question.upvotes.push(user._id);
        question.score += 1;
        await question.save();
      }
    } else if (type === 'downvote') {
      if (!question.downvotes.includes(user._id)) {
        question.downvotes.push(user._id);
        question.score -= 1;
        await question.save();
      }
    }

    res.status(200).json(question);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const voteAnswer = async (req, res) => {
  const { id } = req.params;
  const { type, userId } = req.body;

  try {
    const answer = await Answer.findById(id);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (type === 'upvote') {
      if (!answer.upvotes.includes(user._id)) {
        answer.upvotes.push(user._id);
        answer.score += 1;
        await answer.save();
      }
    } else if (type === 'downvote') {
      if (!answer.downvotes.includes(user._id)) {
        answer.downvotes.push(user._id);
        answer.score -= 1;
        await answer.save();
      }
    }

    res.status(200).json(answer);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { voteQuestion, voteAnswer };
