const { body } = require('express-validator');

const locationValidator = [
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),

  body('place')
    .optional()
    .trim()
    .isIn(['Home', 'Work', 'Travel', 'Gym', 'Other'])
    .withMessage('Place must be one of: Home, Work, Travel, Gym, Other'),

  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be boolean'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings')
];

module.exports = locationValidator;