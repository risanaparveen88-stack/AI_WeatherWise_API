const { query } = require('express-validator');

const cityQueryValidator = [
  query('city').trim().notEmpty().withMessage('City query parameter is required'),
  query('country').optional().trim()
];

module.exports = { cityQueryValidator };