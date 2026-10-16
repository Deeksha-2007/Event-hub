const ApiError = require('../utils/apiError');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: You do not have permission to perform this action'));
    }
    next();
  };
};

module.exports = authorize;
