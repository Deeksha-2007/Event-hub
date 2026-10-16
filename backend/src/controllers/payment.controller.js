const ApiResponse = require('../utils/apiResponse');

const processPayment = async (req, res, next) => {
  try {
    ApiResponse.success(res, { payment: {} }, 'Payment processed successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getPaymentByBooking = async (req, res, next) => {
  try {
    ApiResponse.success(res, { payment: {} }, 'Payment details retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processPayment,
  getPaymentByBooking,
};
