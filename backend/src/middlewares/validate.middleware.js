const ApiError = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
  // Skeleton validation middleware
  next();
};

module.exports = validate;
