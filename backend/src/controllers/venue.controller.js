const ApiResponse = require('../utils/apiResponse');
const prisma = require('../config/db');
const { parsePaginationParams, getPaginationMetadata } = require('../utils/pagination');

const getAllVenues = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePaginationParams(req.query);

    const [totalRecords, venues] = await Promise.all([
      prisma.venue.count(),
      prisma.venue.findMany({
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    const pagination = getPaginationMetadata(totalRecords, page, limit);

    ApiResponse.success(res, { venues, pagination }, 'Venues retrieved successfully');
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
