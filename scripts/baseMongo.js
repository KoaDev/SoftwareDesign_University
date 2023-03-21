const mongoose = require('mongoose');
const User = require('../models/user');
const Tag = require('../models/tag');
const Question = require('../models/question');
const Answer = require('../models/answer');

mongoose.connect('mongodb://127.0.0.1:27017/stackoverflow');

// Create some tags
const nodejsTag = new Tag({ name: 'node.js' });
const angularTag = new Tag({ name: 'angular' });
const mongodbTag = new Tag({ name: 'mongodb' });

Promise.all([
  nodejsTag.save(),
  angularTag.save(),
  mongodbTag.save(),
]).then(() => {
  console.log('Database seeded successfully!');
  mongoose.connection.close();
}).catch(err => {
  console.error('Error seeding database:', err);
});
