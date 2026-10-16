const ApiResponse = require('../utils/apiResponse');

const getAllEvents = async (req, res, next) => {
  try {
    ApiResponse.success(res, { events: [] }, 'Events retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    ApiResponse.success(res, { event: {} }, 'Event details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    ApiResponse.success(res, { event: {} }, 'Event created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    ApiResponse.success(res, { event: {} }, 'Event updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    ApiResponse.success(res, null, 'Event deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
