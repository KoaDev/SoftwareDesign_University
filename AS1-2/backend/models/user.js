const mongoose = require('mongoose');

if (mongoose.models.User) {
  module.exports = mongoose.model('User');
} else {
    
  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    score : {
      type: Number,
      required: true
    }
  });

  const User = mongoose.model('User', userSchema);

  module.exports = User;
}
