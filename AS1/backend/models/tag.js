const mongoose = require('mongoose');

if (mongoose.models.Tag) {
  module.exports = mongoose.model('Tag');
  } else {

  const tagSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    }
  });

  const Tag = mongoose.model('Tag', tagSchema);

  module.exports = Tag;
}
