const ApiResponse = require('../utils/apiResponse');

const getOrganizerStats = async (req, res, next) => {
  try {
    ApiResponse.success(
      res,
      {
        eventsCreated: 0,
        totalBookings: 0,
        totalAttendees: 0,
        ticketsSold: 0,
        totalRevenue: 0,
        salesByTier: [],
      },
      'Organizer dashboard metrics retrieved'
    );
  } catch (error) {
    next(error);
  }
};

const getEventAttendees = async (req, res, next) => {
  try {
    ApiResponse.success(res, { attendees: [] }, 'Attendee list retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrganizerStats,
  getEventAttendees,
};
