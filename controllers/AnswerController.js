const Answer = require('../models/Answer');

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
    const answers = await Answer.find({ question: questionId }).populate('author');
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
    res.sendStatus(200).json({ message: 'Answer deleted' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
