const ApiResponse = require('../utils/apiResponse');
const prisma = require('../config/db');

const getTicketsByEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const tickets = await prisma.ticketType.findMany({
      where: { eventId },
      orderBy: { price: 'asc' },
    });
    ApiResponse.success(res, { tickets }, 'Tickets retrieved successfully');
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
