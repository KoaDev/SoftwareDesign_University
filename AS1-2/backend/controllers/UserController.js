const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const config = require('../config/config');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'stackoverflowassignement@gmail.com',
    pass: 'jrwvtwswvowdtjap'
  }
});

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: 'user',
      score : 0
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userData.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials E' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(user);

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        score: user.score
      }
    };
    jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.setHeader('Authorization', token);
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserScoreById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('score');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateUserScore = async (req, res) => {
  try {

    const {score} = req.body;

    let user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    user.score = score;
    await user.save();

    res.json({ message: "User score updated" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.userData.user.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.logoutUser = async (req, res) => {
  try {
    req.setHeader('Authorization', '');
    res.json({ message: 'User logged out' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    user.role = 'banned';
    await user.save();

    let mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'You Have Been Banned',
      text: 'You have been banned from our platform. If you believe this is a mistake, please contact our support team.'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }); 

    res.json({ message: "User banned" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}


exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    user.role = 'user';
    await user.save();

    res.json({ message: "User unbanned" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}