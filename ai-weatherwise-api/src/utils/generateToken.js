const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (userId, role = 'user') => {
  return jwt.sign({ id: userId, role }, env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = generateToken;