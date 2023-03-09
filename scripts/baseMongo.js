const mongoose = require('mongoose');
const User = require('../models/user');
const Tag = require('../models/tag');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Comment = require('../models/comment');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/stackoverflow');

// Create some users
const alice = new User({
  name: 'Alice',
  email: 'alice@example.com',
  password: 'password'
});
const bob = new User({
  name: 'Bob',
  email: 'bob@example.com',
  password: 'password'
});
const charlie = new User({
  name: 'Charlie',
  email: 'charlie@example.com',
  password: 'password'
});

// Create some tags
const nodejsTag = new Tag({ name: 'node.js' });
const angularTag = new Tag({ name: 'angular' });
const mongodbTag = new Tag({ name: 'mongodb' });

// Create some questions
const nodejsQuestion = new Question({
  title: 'How do I use Node.js?',
  body: 'I want to learn how to use Node.js. Can someone point me in the right direction?',
  author: alice._id,
  tags: [nodejsTag._id],
  upvotes: [bob._id],
  downvotes: [charlie._id],
  answers: [],
  comments: []
});
const angularQuestion = new Question({
  title: 'What is Angular?',
  body: 'I keep hearing about Angular. What is it and how does it compare to other front-end frameworks?',
  author: bob._id,
  tags: [angularTag._id],
  upvotes: [alice._id, bob._id],
  downvotes: [],
  answers: [],
  comments: []
});
const mongodbQuestion = new Question({
  title: 'How do I set up a MongoDB database?',
  body: 'I want to use MongoDB for my next project. How do I get started?',
  author: charlie._id,
  tags: [mongodbTag._id],
  upvotes: [alice._id, bob._id, charlie._id],
  downvotes: [],
  answers: [],
  comments: []
});

// Save the users, tags, and questions to the database
Promise.all([
  alice.save(),
  bob.save(),
  charlie.save(),
  nodejsTag.save(),
  angularTag.save(),
  mongodbTag.save(),
  nodejsQuestion.save(),
  angularQuestion.save(),
  mongodbQuestion.save()
]).then(() => {
  console.log('Database seeded successfully!');
  mongoose.connection.close();
}).catch(err => {
  console.error('Error seeding database:', err);
});
