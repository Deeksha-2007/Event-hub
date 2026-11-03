const ApiResponse = require('../utils/apiResponse');
const prisma = require('../config/db');
const { parsePaginationParams, getPaginationMetadata } = require('../utils/pagination');

const getTicketsByEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const where = { eventId };
    const { page, limit, skip } = parsePaginationParams(req.query);

    const [totalRecords, tickets] = await Promise.all([
      prisma.ticketType.count({ where }),
      prisma.ticketType.findMany({
        where,
        orderBy: { price: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    const pagination = getPaginationMetadata(totalRecords, page, limit);

    ApiResponse.success(res, { tickets, pagination }, 'Tickets retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createTicketType = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { name, price, totalQuantity, description, perks } = req.body;
    const ticket = await prisma.ticketType.create({
      data: {
        eventId,
        name,
        price: parseFloat(price),
        totalQuantity: parseInt(totalQuantity, 10),
        availableQuantity: parseInt(totalQuantity, 10),
        description,
        perks,
        updatedAt: new Date(),
      },
    });
    ApiResponse.success(res, { ticket }, 'Ticket category created successfully', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTicketsByEvent,
  createTicketType,
};
