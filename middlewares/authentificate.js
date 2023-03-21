const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Auth failed' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.userData = decoded;
    User.findById(decoded.user.id)
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: 'Auth failed' });
        }
        next();
      })
      .catch(err => {
        return res.status(401).json({ message: 'Auth failed' });
      });
  } catch (error) {
    return res.status(401).json({ message: 'Auth failed' });
  }
};
