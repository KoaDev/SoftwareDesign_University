const Question = require('../models/question');

  exports.getQuestions = async (req, res) => {
    try {
      const questions = await Question.find()
        .populate('author', 'name email')
        .populate('answers')
        .exec();
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  exports.getQuestionById = async (req, res) => {
    try {
      const question = await Question.findById(req.params.questionId)
        .populate('author', 'name email')
        .populate({
          path: 'answers',
          populate: {
            path: 'author',
            select: 'answers'
          }
        })
        .exec();
      if (!question)
        return res.status(404).json({ message: 'Question not found' });
      res.status(200).json(question);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  exports.createQuestion = async (req, res) => {
    try {
      const { title, tags, body } = req.body;
      const question = new Question({
        title: title,
        tags : tags,
        body: body,
        author: req.userData.user.id
      });
      await question.save();
      res.status(200).json({ message: 'Question created'});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  exports.updateQuestion = async (req, res) => {
    const { title, tags, body } = req.body;
    try {
      const question = await Question.findOneAndUpdate(
        { _id: req.params.questionId, author: req.userData.user.id },
        { title: title, body: body, tags: tags },
        { new: true }
      );
      if (!question) 
        return res.status(404).json({ error: 'Question not found or unauthorized' });
      return res.status(200).json({ message: 'Question updated' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  exports.deleteQuestion = async (req, res) => {
    try {
      const question = await Question.findOneAndDelete({ _id: req.params.questionId, author: req.userData.user.id });
      if (!question) {
        return res.status(404).json({ error: 'Question not found or unauthorized' });
      }
      return res.status(200).json({ message: 'Question deleted' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  exports.voteQuestion = async (req, res) => {
    try {

      const question = await Question.findById(req.params.questionId);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const vote = req.body.vote;
      const userId = req.userData.user.id;

      if (vote === 'upvote') {
        if (question.upvotes.includes(userId)) {
          return res.status(400).json({ error: 'Already upvoted' });
        }
        question.upvotes.push(userId);
        if (question.downvotes.includes(userId)) {
          question.downvotes.pull(userId);
        }
      } else if (vote === 'downvote') {
        if (question.downvotes.includes(userId)) {
          return res.status(400).json({ error: 'Already downvoted' });
        }
        question.downvotes.push(userId);
        if (question.upvotes.includes(userId)) {
          question.upvotes.pull(userId);
        }
      } else {
        return res.status(400).json({ error: 'Invalid vote type' });
      }

      await question.save();
      return res.status(200).json({ message: 'Question voted' });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
