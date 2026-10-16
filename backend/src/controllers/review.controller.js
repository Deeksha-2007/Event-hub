const ApiResponse = require('../utils/apiResponse');

const getEventReviews = async (req, res, next) => {
  try {
    ApiResponse.success(res, { reviews: [] }, 'Event reviews retrieved');
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    ApiResponse.success(res, { review: {} }, 'Review submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEventReviews,
  createReview,
};
