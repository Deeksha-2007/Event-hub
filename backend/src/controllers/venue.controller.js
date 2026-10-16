const ApiResponse = require('../utils/apiResponse');

const getAllVenues = async (req, res, next) => {
  try {
    ApiResponse.success(res, { venues: [] }, 'Venues retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createVenue = async (req, res, next) => {
  try {
    ApiResponse.success(res, { venue: {} }, 'Venue created successfully', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVenues,
  createVenue,
};
