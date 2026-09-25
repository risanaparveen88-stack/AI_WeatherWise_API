const { errorResponse } = require('../utils/apiResponse');
const env = require('../config/env');

const notFound = (req, res, next) => {
  return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return errorResponse(res, message, statusCode, env.NODE_ENV === 'development' ? { stack: err.stack } : null);
};

module.exports = { notFound, errorHandler };