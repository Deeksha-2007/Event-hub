const crypto = require('crypto');
const prisma = require('../config/db');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

/**
 * Create a new booking for an event and ticket type
 * POST /api/v1/bookings
 */
const createBooking = async (req, res, next) => {
  try {
    const { eventId, ticketTypeId, quantity = 1, attendees, attendeeName, attendeeEmail, phone } = req.body;
    const userId = req.user.id;

    // 1. Basic validation
    if (!eventId) {
      throw new ApiError(400, 'Event ID is required');
    }
    if (!ticketTypeId) {
      throw new ApiError(400, 'Ticket type ID is required');
    }

    const ticketQuantity = parseInt(quantity, 10);
    if (isNaN(ticketQuantity) || ticketQuantity <= 0) {
      throw new ApiError(400, 'Quantity must be a positive integer');
    }

    // 2. Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (event.status === 'CANCELLED') {
      throw new ApiError(400, 'Cannot book tickets for a cancelled event');
    }
    if (event.status === 'COMPLETED') {
      throw new ApiError(400, 'Cannot book tickets for an event that has already ended');
    }

    // 3. Verify ticket type exists and belongs to the event
    const ticketType = await prisma.ticketType.findUnique({
      where: { id: ticketTypeId },
    });
    if (!ticketType) {
      throw new ApiError(404, 'Ticket type not found');
    }
    if (ticketType.eventId !== eventId) {
      throw new ApiError(400, 'Ticket type does not belong to the selected event');
    }

    // 4. Check available quantity and capacity upfront
    if (ticketType.availableQuantity < ticketQuantity) {
      throw new ApiError(
        400,
        `Not enough tickets available. Only ${ticketType.availableQuantity} ticket(s) remaining for ${ticketType.name}`
      );
    }
    if (event.availableCapacity < ticketQuantity) {
      throw new ApiError(
        400,
        `Not enough event capacity available. Only ${event.availableCapacity} spot(s) remaining`
      );
    }

    // 5. Calculate pricing
    const unitPrice = ticketType.price;
    const totalAmount = unitPrice * ticketQuantity;

    // 6. Execute atomic booking transaction with concurrency protection
    const newBooking = await prisma.$transaction(async (tx) => {
      // Concurrency check on ticket availability
      const updateTicket = await tx.ticketType.updateMany({
        where: {
          id: ticketTypeId,
          availableQuantity: { gte: ticketQuantity },
        },
        data: {
          availableQuantity: { decrement: ticketQuantity },
          updatedAt: new Date(),
        },
      });

      if (updateTicket.count === 0) {
        throw new ApiError(400, 'Tickets are no longer available in the requested quantity');
      }

      // Concurrency check on event capacity
      const updateEvent = await tx.event.updateMany({
        where: {
          id: eventId,
          availableCapacity: { gte: ticketQuantity },
        },
        data: {
          availableCapacity: { decrement: ticketQuantity },
          updatedAt: new Date(),
        },
      });

      if (updateEvent.count === 0) {
        throw new ApiError(400, 'Event capacity is no longer sufficient for this booking');
      }

      // Generate IDs and reference
      const bookingId = crypto.randomUUID();
      const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
      const bookingReference = `EN-${Date.now().toString().slice(-6)}-${randomSuffix}`;

      // Create Booking record
      await tx.booking.create({
        data: {
          id: bookingId,
          bookingReference,
          userId,
          eventId,
          ticketTypeId,
          quantity: ticketQuantity,
          unitPrice,
          totalAmount,
          status: 'CONFIRMED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Prepare Attendee records
      const attendeeRecords = [];
      if (Array.isArray(attendees) && attendees.length > 0) {
        for (let i = 0; i < ticketQuantity; i++) {
          const item = attendees[i] || {};
          attendeeRecords.push({
            id: crypto.randomUUID(),
            bookingId,
            eventId,
            userId: i === 0 ? userId : null,
            ticketTypeId,
            attendeeName: item.attendeeName || req.user.name,
            attendeeEmail: item.attendeeEmail || req.user.email,
            phone: item.phone || phone || req.user.phone || null,
            checkInStatus: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else {
        for (let i = 0; i < ticketQuantity; i++) {
          attendeeRecords.push({
            id: crypto.randomUUID(),
            bookingId,
            eventId,
            userId: i === 0 ? userId : null,
            ticketTypeId,
            attendeeName: attendeeName || req.user.name,
            attendeeEmail: attendeeEmail || req.user.email,
            phone: phone || req.user.phone || null,
            checkInStatus: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      await tx.attendee.createMany({
        data: attendeeRecords,
      });

      // Return booking with full details
      return tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          Event: {
            include: { Venue: true },
          },
          TicketType: true,
          Attendee: true,
        },
      });
    });

    ApiResponse.success(res, { booking: newBooking }, 'Booking confirmed successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all bookings of the currently logged-in user
 * GET /api/v1/bookings/my-bookings
 */
const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        Event: {
          include: { Venue: true },
        },
        TicketType: true,
        Attendee: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    ApiResponse.success(res, { bookings }, 'User bookings retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get booking details by ID (owner or admin only)
 * GET /api/v1/bookings/:id
 */
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        Event: {
          include: { Venue: true },
        },
        TicketType: true,
        Attendee: true,
      },
    });

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to view this booking');
    }

    ApiResponse.success(res, { booking }, 'Booking retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a booking and restore ticket availability
 * PATCH /api/v1/bookings/:id/cancel
 */
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // 1. Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // 2. Verify ownership (only owner or admin can cancel)
    if (booking.userId !== userId && userRole !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to cancel this booking');
    }

    // 3. Verify status
    if (booking.status === 'CANCELLED') {
      throw new ApiError(400, 'This booking has already been cancelled');
    }
    if (booking.status !== 'CONFIRMED') {
      throw new ApiError(400, `Cannot cancel booking with status ${booking.status}`);
    }

    // 4. Atomic cancellation and availability restoration
    const updatedBooking = await prisma.$transaction(async (tx) => {
      // Concurrency guard: update status only if it's still CONFIRMED
      const updateResult = await tx.booking.updateMany({
        where: {
          id: booking.id,
          status: 'CONFIRMED',
        },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          updatedAt: new Date(),
        },
      });

      if (updateResult.count === 0) {
        throw new ApiError(400, 'Booking is already cancelled or could not be updated');
      }

      // Restore ticket type availability
      await tx.ticketType.update({
        where: { id: booking.ticketTypeId },
        data: {
          availableQuantity: { increment: booking.quantity },
          updatedAt: new Date(),
        },
      });

      // Restore event capacity
      await tx.event.update({
        where: { id: booking.eventId },
        data: {
          availableCapacity: { increment: booking.quantity },
          updatedAt: new Date(),
        },
      });

      // Fetch the updated booking with relations
      return tx.booking.findUnique({
        where: { id: booking.id },
        include: {
          Event: {
            include: { Venue: true },
          },
          TicketType: true,
          Attendee: true,
        },
      });
    });

    ApiResponse.success(res, { booking: updatedBooking }, 'Booking cancelled successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
};
