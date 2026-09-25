const { errorResponse } = require('../utils/apiResponse');

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return errorResponse(res, 'Access denied: insufficient role', 403);
  }
  next();
};

module.exports = requireRole;