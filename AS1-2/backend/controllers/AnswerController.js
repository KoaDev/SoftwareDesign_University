const Answer = require('../models/Answer');
const Question = require('../models/question');


exports.createAnswer = async (req, res) => {
  try {
    const answer = new Answer({
      body: req.body.body,
      author: req.userData.user.id,
      question: req.params.questionId
    });
    const savedAnswer = await answer.save();          
    res.status(201).json(savedAnswer);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getAnswersByQuestionId = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const answers = await Answer.find({ question: questionId }).populate('author', 'name email').populate('question', 'title').populate('upvotes', '_id').populate('downvotes', '_id');
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findOneAndUpdate(
      { _id: req.params.answerId, author: req.userData.user.id },
      { body: req.body.body },
      { new: true }
    );
    if (!answer)
      return res.status(404).json({ error: 'Answer not found or unauthorized' });
    res.json(answer);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findOneAndDelete({ _id: req.params.answerId, author: req.userData.user.id });
    if (!answer)
      return res.status(404).json({ error: 'Answer not found or unauthorized' });
    res.status(200).json({ message: 'Answer deleted' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


exports.getAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId).populate('author', 'name email').populate('question', 'title').populate('upvotes', '_id').populate('downvotes', '_id');
    if (!answer) return res.status(404).json({ error: 'Answer not found' });
    res.json(answer);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.voteAnswer = async (req, res) => {
  try {

    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ error: 'Answer not found' });

    const vote = req.body.vote;
    const userId = req.userData.user.id;

    if (vote === 'upvote') {
      if (answer.upvotes.includes(userId)) {
        answer.upvotes.pull(userId);
      } else {
        answer.upvotes.push(userId);
        if (answer.downvotes.includes(userId)) {
          answer.downvotes.pull(userId);
        }
      }
    } else if (vote === 'downvote') {
      if (answer.downvotes.includes(userId)) {
        answer.downvotes.pull(userId);
      } else {
        answer.downvotes.push(userId);
        if (answer.upvotes.includes(userId)) {
          answer.upvotes.pull(userId);
        }
      }
    } else {
      return res.status(400).json({ error: 'Bad request' });
    }

    await answer.save();
    res.json(answer);

  } catch (err) {
    res.status(500).json({ error: err });
  }

  getAuthorByAnswerId = async (req, res) => {
    try {
      const answer = await Answer.findById(req.params.answerId).populate('author', 'name email');
      if (!answer) return res.status(404).json({ error: 'Answer not found' });
      res.json(answer.author);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

};
