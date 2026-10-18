const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const prisma = require('../config/db');

const getAllEvents = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const where = {};
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    const events = await prisma.event.findMany({
      where,
      include: {
        Venue: true,
        TicketType: true,
      },
      orderBy: { startDate: 'asc' },
    });
    ApiResponse.success(res, { events }, 'Events retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        Venue: true,
        TicketType: true,
        User: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        Review: {
          include: {
            User: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
    });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }
    ApiResponse.success(res, { event }, 'Event details retrieved successfully');
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
