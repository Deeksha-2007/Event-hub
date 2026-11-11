const crypto = require('crypto');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const prisma = require('../config/db');
const { parsePaginationParams, getPaginationMetadata } = require('../utils/pagination');

/**
 * Get all ticket categories for an event
 * GET /api/v1/tickets/event/:eventId
 */
const getTicketsByEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    const where = { eventId };
    const { page, limit, skip } = parsePaginationParams(req.query, 50, 100);

    const [totalRecords, ticketTypes] = await Promise.all([
      prisma.ticketType.count({ where }),
      prisma.ticketType.findMany({
        where,
        orderBy: { price: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    const tickets = ticketTypes.map((t) => {
      const soldQuantity = t.totalQuantity - t.availableQuantity;
      return {
        ...t,
        soldQuantity,
        isSoldOut: t.availableQuantity <= 0,
      };
    });

    const pagination = getPaginationMetadata(totalRecords, page, limit);

    ApiResponse.success(res, { tickets, pagination }, 'Tickets retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get ticket category details by ID
 * GET /api/v1/tickets/:id
 */
const getTicketById = async (req, res, next) => {
  try {
    const ticketId = req.params.id || req.params.ticketId;
    if (!ticketId) {
      throw new ApiError(400, 'Ticket category ID is required');
    }

    const ticket = await prisma.ticketType.findUnique({
      where: { id: ticketId },
      include: {
        Event: {
          select: {
            id: true,
            title: true,
            organizerId: true,
            status: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new ApiError(404, 'Ticket category not found');
    }

    const soldQuantity = ticket.totalQuantity - ticket.availableQuantity;
    const formattedTicket = {
      ...ticket,
      soldQuantity,
      isSoldOut: ticket.availableQuantity <= 0,
    };

    ApiResponse.success(
      res,
      { ticket: formattedTicket, ticketType: formattedTicket },
      'Ticket category retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new ticket category
 * POST /api/v1/tickets/event/:eventId
 * POST /api/v1/tickets (with eventId in body)
 */
const createTicketCategory = async (req, res, next) => {
  try {
    const eventId = req.params.eventId || req.body.eventId;

    if (!eventId) {
      throw new ApiError(400, 'Event ID is required');
    }

    // 1. Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    // 2. Authorization check: organizer of event or admin
    if (req.user.role !== 'ADMIN' && event.organizerId !== req.user.id) {
      throw new ApiError(403, 'You are not authorized to manage ticket categories for this event');
    }

    // 3. Status check
    if (event.status === 'CANCELLED') {
      throw new ApiError(400, 'Cannot create ticket categories for a cancelled event');
    }
    if (event.status === 'COMPLETED') {
      throw new ApiError(400, 'Cannot create ticket categories for an event that has already ended');
    }

    // 4. Validate category name
    const rawName = req.body.name || req.body.categoryName || req.body.title;
    if (!rawName || typeof rawName !== 'string' || !rawName.trim()) {
      throw new ApiError(400, 'Ticket category name is required');
    }
    const name = rawName.trim();

    // 5. Prevent duplicate category names for this event
    const existingTicket = await prisma.ticketType.findFirst({
      where: {
        eventId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
    if (existingTicket) {
      throw new ApiError(400, `A ticket category named '${name}' already exists for this event`);
    }

    // 6. Validate price
    const rawPrice = req.body.price !== undefined ? req.body.price : req.body.ticketPrice;
    if (rawPrice === undefined || rawPrice === null || rawPrice === '') {
      throw new ApiError(400, 'Ticket price is required');
    }
    const price = parseFloat(rawPrice);
    if (isNaN(price) || price < 0) {
      throw new ApiError(400, 'Ticket price must be a valid non-negative number');
    }

    // 7. Validate capacity (totalQuantity)
    const rawCapacity =
      req.body.totalQuantity !== undefined
        ? req.body.totalQuantity
        : req.body.capacity !== undefined
        ? req.body.capacity
        : req.body.quantity;

    if (rawCapacity === undefined || rawCapacity === null || rawCapacity === '') {
      throw new ApiError(400, 'Ticket capacity is required');
    }
    const totalQuantity = parseInt(rawCapacity, 10);
    if (isNaN(totalQuantity) || totalQuantity <= 0) {
      throw new ApiError(400, 'Ticket capacity must be a positive integer');
    }

    // 8. Description & perks
    const description =
      req.body.description !== undefined && req.body.description !== null
        ? String(req.body.description).trim()
        : null;
    const perks =
      req.body.perks !== undefined && req.body.perks !== null
        ? String(req.body.perks).trim()
        : null;

    // 9. Atomic creation and event capacity synchronization
    const createdTicket = await prisma.$transaction(async (tx) => {
      const existingTicketTypes = await tx.ticketType.findMany({
        where: { eventId },
        select: { totalQuantity: true },
      });
      const currentAllocated = existingTicketTypes.reduce((sum, t) => sum + t.totalQuantity, 0);
      const newTotalRequired = currentAllocated + totalQuantity;

      // Expand event capacity if adding this ticket category exceeds current event totalCapacity
      if (newTotalRequired > event.totalCapacity) {
        const delta = newTotalRequired - event.totalCapacity;
        await tx.event.update({
          where: { id: eventId },
          data: {
            totalCapacity: { increment: delta },
            availableCapacity: { increment: delta },
            updatedAt: new Date(),
          },
        });
      }

      return tx.ticketType.create({
        data: {
          id: crypto.randomUUID(),
          eventId,
          name,
          price,
          totalQuantity,
          availableQuantity: totalQuantity,
          description,
          perks,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    });

    const responseData = {
      ...createdTicket,
      soldQuantity: 0,
      isSoldOut: false,
    };

    ApiResponse.success(
      res,
      { ticket: responseData, ticketType: responseData },
      'Ticket category created successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing ticket category
 * PUT /api/v1/tickets/:id
 * PATCH /api/v1/tickets/:id
 */
const updateTicketCategory = async (req, res, next) => {
  try {
    const ticketId = req.params.id || req.params.ticketId;
    if (!ticketId) {
      throw new ApiError(400, 'Ticket category ID is required');
    }

    // 1. Verify category exists
    const ticket = await prisma.ticketType.findUnique({
      where: { id: ticketId },
      include: { Event: true },
    });

    if (!ticket) {
      throw new ApiError(404, 'Ticket category not found');
    }

    // 2. Authorization check
    if (req.user.role !== 'ADMIN' && ticket.Event.organizerId !== req.user.id) {
      throw new ApiError(403, 'You are not authorized to update this ticket category');
    }

    if (ticket.Event.status === 'CANCELLED') {
      throw new ApiError(400, 'Cannot update ticket categories for a cancelled event');
    }

    const updateData = {
      updatedAt: new Date(),
    };

    // 3. Name update
    const rawName = req.body.name || req.body.categoryName || req.body.title;
    if (rawName !== undefined) {
      if (typeof rawName !== 'string' || !rawName.trim()) {
        throw new ApiError(400, 'Ticket category name cannot be empty');
      }
      const name = rawName.trim();
      const duplicate = await prisma.ticketType.findFirst({
        where: {
          eventId: ticket.eventId,
          name: { equals: name, mode: 'insensitive' },
          NOT: { id: ticket.id },
        },
      });
      if (duplicate) {
        throw new ApiError(400, `A ticket category named '${name}' already exists for this event`);
      }
      updateData.name = name;
    }

    // 4. Price update
    const rawPrice = req.body.price !== undefined ? req.body.price : req.body.ticketPrice;
    if (rawPrice !== undefined) {
      if (rawPrice === null || rawPrice === '') {
        throw new ApiError(400, 'Ticket price cannot be empty');
      }
      const price = parseFloat(rawPrice);
      if (isNaN(price) || price < 0) {
        throw new ApiError(400, 'Ticket price must be a valid non-negative number');
      }
      updateData.price = price;
    }

    // 5. Capacity (totalQuantity) update
    const rawCapacity =
      req.body.totalQuantity !== undefined
        ? req.body.totalQuantity
        : req.body.capacity !== undefined
        ? req.body.capacity
        : req.body.quantity;

    let capacityDelta = 0;

    if (rawCapacity !== undefined) {
      if (rawCapacity === null || rawCapacity === '') {
        throw new ApiError(400, 'Ticket capacity cannot be empty');
      }
      const newTotal = parseInt(rawCapacity, 10);
      if (isNaN(newTotal) || newTotal <= 0) {
        throw new ApiError(400, 'Ticket capacity must be a positive integer');
      }

      // CAPACITY VALIDATION:
      // Capacity cannot be reduced below the number of tickets already sold or booked!
      const soldCount = ticket.totalQuantity - ticket.availableQuantity;
      if (newTotal < soldCount) {
        throw new ApiError(
          400,
          `Cannot reduce capacity to ${newTotal}. There are already ${soldCount} tickets sold or booked for this category.`
        );
      }

      const newAvailable = newTotal - soldCount;
      updateData.totalQuantity = newTotal;
      updateData.availableQuantity = newAvailable;
      capacityDelta = newTotal - ticket.totalQuantity;
    }

    // 6. Description update
    if (req.body.description !== undefined) {
      updateData.description = req.body.description ? String(req.body.description).trim() : null;
    }

    // 7. Perks update
    if (req.body.perks !== undefined) {
      updateData.perks = req.body.perks ? String(req.body.perks).trim() : null;
    }

    // 8. Execute update in atomic transaction
    const updatedTicket = await prisma.$transaction(async (tx) => {
      if (capacityDelta !== 0) {
        if (capacityDelta > 0) {
          await tx.event.update({
            where: { id: ticket.eventId },
            data: {
              totalCapacity: { increment: capacityDelta },
              availableCapacity: { increment: capacityDelta },
              updatedAt: new Date(),
            },
          });
        } else {
          const dec = Math.abs(capacityDelta);
          await tx.event.update({
            where: { id: ticket.eventId },
            data: {
              totalCapacity: { decrement: dec },
              availableCapacity: { decrement: dec },
              updatedAt: new Date(),
            },
          });
        }
      }

      return tx.ticketType.update({
        where: { id: ticketId },
        data: updateData,
      });
    });

    const soldQuantity = updatedTicket.totalQuantity - updatedTicket.availableQuantity;
    const responseData = {
      ...updatedTicket,
      soldQuantity,
      isSoldOut: updatedTicket.availableQuantity <= 0,
    };

    ApiResponse.success(
      res,
      { ticket: responseData, ticketType: responseData },
      'Ticket category updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a ticket category
 * DELETE /api/v1/tickets/:id
 */
const deleteTicketCategory = async (req, res, next) => {
  try {
    const ticketId = req.params.id || req.params.ticketId;
    if (!ticketId) {
      throw new ApiError(400, 'Ticket category ID is required');
    }

    // 1. Verify category exists
    const ticket = await prisma.ticketType.findUnique({
      where: { id: ticketId },
      include: { Event: true },
    });

    if (!ticket) {
      throw new ApiError(404, 'Ticket category not found');
    }

    // 2. Authorization check
    if (req.user.role !== 'ADMIN' && ticket.Event.organizerId !== req.user.id) {
      throw new ApiError(403, 'You are not authorized to delete this ticket category');
    }

    // 3. Database relationship & tickets sold check:
    // Respect existing database relationships and prevent accidental deletion of categories
    // that have associated tickets or bookings
    const [bookingCount, attendeeCount] = await Promise.all([
      prisma.booking.count({ where: { ticketTypeId: ticketId } }),
      prisma.attendee.count({ where: { ticketTypeId: ticketId } }),
    ]);

    const soldCount = ticket.totalQuantity - ticket.availableQuantity;

    if (bookingCount > 0 || attendeeCount > 0 || soldCount > 0) {
      const activeCount = Math.max(bookingCount, soldCount, attendeeCount);
      throw new ApiError(
        400,
        `Cannot delete ticket category because it has ${activeCount} associated booking(s) or ticket(s). Categories with existing tickets cannot be deleted.`
      );
    }

    // 4. Delete the category cleanly
    await prisma.$transaction(async (tx) => {
      await tx.ticketType.delete({
        where: { id: ticketId },
      });
    });

    ApiResponse.success(res, null, 'Ticket category deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTicketsByEvent,
  getTicketById,
  createTicketCategory,
  createTicketType: createTicketCategory,
  updateTicketCategory,
  updateTicketType: updateTicketCategory,
  deleteTicketCategory,
  deleteTicketType: deleteTicketCategory,
};
