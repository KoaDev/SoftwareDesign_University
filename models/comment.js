const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

if (mongoose.models.Comment) {
  module.exports = mongoose.model('Comment');
  } else {

  const commentSchema = new mongoose.Schema({
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
    answer: {
      type: ObjectId,
      ref: 'Answer'
    },
    comments: [{
      type: ObjectId,
      ref: 'Comment'
    }]
  });

  const Comment = mongoose.model('Comment', commentSchema);

  module.exports = Comment;
}
