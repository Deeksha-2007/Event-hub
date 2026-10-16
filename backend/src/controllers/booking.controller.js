const ApiResponse = require('../utils/apiResponse');

const createBooking = async (req, res, next) => {
  try {
    ApiResponse.success(res, { booking: {} }, 'Booking initiated successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    ApiResponse.success(res, { bookings: [] }, 'User bookings retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    ApiResponse.success(res, { booking: {} }, 'Booking cancelled and capacity updated');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
};
