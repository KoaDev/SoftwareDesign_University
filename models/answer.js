const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

if (mongoose.models.Answer) {
  module.exports = mongoose.model('Answer');
  } else {

  const answerSchema = new mongoose.Schema({
    body: {
      type: String,
      required: true
    },
    author: {
      type: ObjectId,
      ref: 'User'
    },
    question: {
      type: ObjectId,
      ref: 'Question'
    },
    upvotes: [{
      type: ObjectId,
      ref: 'User'
    }],
    downvotes: [{
      type: ObjectId,
      ref: 'User'
    }],
    comments: [{
      type: ObjectId,
      ref: 'Comment'
    }]
  });

  const Answer = mongoose.model('Answer', answerSchema);

  module.exports = Answer;
}
