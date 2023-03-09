const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;


if (mongoose.models.Question) {
  module.exports = mongoose.model('Question');
} else {
  const questionSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    author: {
      type: ObjectId,
      ref: 'User'
    },
    tags: [{
      type: ObjectId,
      ref: 'Tag'
    }],
    upvotes: [{
      type: ObjectId,
      ref: 'User'
    }],
    downvotes: [{
      type: ObjectId,
      ref: 'User'
    }],
    answers: [{
      type: ObjectId,
      ref: 'Answer'
    }],
    comments: [{
      type: ObjectId,
      ref: 'Comment'
    }]
  });

  const Question = mongoose.model('Question', questionSchema);

  module.exports = Question;
}

