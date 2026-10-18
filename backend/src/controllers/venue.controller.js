const ApiResponse = require('../utils/apiResponse');
const prisma = require('../config/db');

const getAllVenues = async (req, res, next) => {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: { name: 'asc' },
    });
    ApiResponse.success(res, { venues }, 'Venues retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createVenue = async (req, res, next) => {
  try {
    const venue = await prisma.venue.create({
      data: {
        ...req.body,
        updatedAt: new Date(),
      },
    });
    ApiResponse.success(res, { venue }, 'Venue created successfully', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVenues,
  createVenue,
};
