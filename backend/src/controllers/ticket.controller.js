const ApiResponse = require('../utils/apiResponse');

const getTicketsByEvent = async (req, res, next) => {
  try {
    ApiResponse.success(res, { tickets: [] }, 'Tickets retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createTicketType = async (req, res, next) => {
  try {
    ApiResponse.success(res, { ticket: {} }, 'Ticket category created successfully', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTicketsByEvent,
  createTicketType,
};
