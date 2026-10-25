const crypto = require('crypto');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const prisma = require('../config/db');

/**
 * Get all events with optional filters (category, search, status, sort)
 * GET /api/v1/events
 */
const getAllEvents = async (req, res, next) => {
  try {
    const { category, search, status, sort = 'asc', sortBy = 'startDate' } = req.query;
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

    if (status) {
      where.status = status;
    }

    const validSortFields = ['startDate', 'createdAt', 'title', 'totalCapacity'];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : 'startDate';
    const orderDirection = sort.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const events = await prisma.event.findMany({
      where,
      include: {
        Venue: true,
        TicketType: true,
      },
      orderBy: { [orderByField]: orderDirection },
    });

    ApiResponse.success(res, { events }, 'Events retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get single event by ID with venue, ticket types, organizer, and reviews
 * GET /api/v1/events/:id
 */
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

/**
 * Create a new event
 * POST /api/v1/events
 * Allowed roles: ORGANIZER, ADMIN
 */
const createEvent = async (req, res, next) => {
  try {
    const title = req.body.title || req.body.name;
    const { description, category, bannerUrl, imageUrl, venueId, totalCapacity, status, ticketTypes } = req.body;
    const organizerId = req.user.id;

    // 1. Validate required text fields
    if (!title || !title.trim()) {
      throw new ApiError(400, 'Event title is required');
    }
    if (!description || !description.trim()) {
      throw new ApiError(400, 'Event description is required');
    }

    // 2. Validate dates
    const startDateRaw = req.body.startDate || req.body.date;
    if (!startDateRaw) {
      throw new ApiError(400, 'Event start date is required');
    }
    const start = new Date(startDateRaw);
    if (isNaN(start.getTime())) {
      throw new ApiError(400, 'Invalid start date format');
    }

    let end;
    if (req.body.endDate) {
      end = new Date(req.body.endDate);
      if (isNaN(end.getTime())) {
        throw new ApiError(400, 'Invalid end date format');
      }
      if (end < start) {
        throw new ApiError(400, 'End date cannot be before start date');
      }
    } else {
      // Default duration: 3 hours after start
      end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    }

    // 3. Validate venue
    if (!venueId) {
      throw new ApiError(400, 'Venue ID is required');
    }
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    });
    if (!venue) {
      throw new ApiError(404, 'Referenced venue not found');
    }

    // 4. Validate capacity
    let capacity;
    if (totalCapacity !== undefined && totalCapacity !== null && totalCapacity !== '') {
      capacity = parseInt(totalCapacity, 10);
      if (isNaN(capacity) || capacity <= 0) {
        throw new ApiError(400, 'Total capacity must be a positive integer');
      }
      if (capacity > venue.capacity) {
        throw new ApiError(400, `Total capacity (${capacity}) cannot exceed venue capacity (${venue.capacity})`);
      }
    } else {
      capacity = venue.capacity;
    }

    // 5. Validate status if provided
    const validStatuses = ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'];
    const eventStatus = status ? status.toUpperCase() : 'PUBLISHED';
    if (!validStatuses.includes(eventStatus)) {
      throw new ApiError(400, `Status must be one of: ${validStatuses.join(', ')}`);
    }

    // 6. Create event & optional ticket types in transaction
    const eventId = crypto.randomUUID();
    const createdEvent = await prisma.$transaction(async (tx) => {
      await tx.event.create({
        data: {
          id: eventId,
          title: title.trim(),
          description: description.trim(),
          category: category ? category.trim() : 'Technology',
          bannerUrl: bannerUrl || imageUrl || null,
          startDate: start,
          endDate: end,
          venueId,
          organizerId,
          totalCapacity: capacity,
          availableCapacity: capacity,
          status: eventStatus,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Optional initial ticket types
      if (Array.isArray(ticketTypes) && ticketTypes.length > 0) {
        for (const t of ticketTypes) {
          if (t.name && t.price !== undefined && t.totalQuantity !== undefined) {
            const tQty = parseInt(t.totalQuantity, 10);
            await tx.ticketType.create({
              data: {
                id: crypto.randomUUID(),
                eventId,
                name: t.name.trim(),
                price: parseFloat(t.price),
                totalQuantity: tQty,
                availableQuantity: tQty,
                description: t.description ? t.description.trim() : null,
                perks: t.perks ? t.perks.trim() : null,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          }
        }
      }

      return tx.event.findUnique({
        where: { id: eventId },
        include: {
          Venue: true,
          TicketType: true,
          User: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    });

    ApiResponse.success(res, { event: createdEvent }, 'Event created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing event
 * PUT /api/v1/events/:id or PATCH /api/v1/events/:id
 * Allowed roles: Event Organizer or ADMIN
 */
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Check if event exists
    const event = await prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    // 2. Ownership / permission check (owner or admin)
    if (event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to update this event');
    }

    const updateData = {
      updatedAt: new Date(),
    };

    // 3. Validate & apply field updates
    const title = req.body.title || req.body.name;
    if (title !== undefined) {
      if (!title.trim()) {
        throw new ApiError(400, 'Event title cannot be empty');
      }
      updateData.title = title.trim();
    }

    if (req.body.description !== undefined) {
      if (!req.body.description.trim()) {
        throw new ApiError(400, 'Event description cannot be empty');
      }
      updateData.description = req.body.description.trim();
    }

    if (req.body.category !== undefined) {
      updateData.category = req.body.category.trim();
    }

    if (req.body.bannerUrl !== undefined || req.body.imageUrl !== undefined) {
      updateData.bannerUrl = req.body.bannerUrl || req.body.imageUrl || null;
    }

    // Date updates
    let start = event.startDate;
    let end = event.endDate;

    if (req.body.startDate || req.body.date) {
      const parsedStart = new Date(req.body.startDate || req.body.date);
      if (isNaN(parsedStart.getTime())) {
        throw new ApiError(400, 'Invalid start date format');
      }
      start = parsedStart;
      updateData.startDate = start;
    }

    if (req.body.endDate) {
      const parsedEnd = new Date(req.body.endDate);
      if (isNaN(parsedEnd.getTime())) {
        throw new ApiError(400, 'Invalid end date format');
      }
      end = parsedEnd;
      updateData.endDate = end;
    }

    if (end < start) {
      throw new ApiError(400, 'End date cannot be before start date');
    }

    // Venue check
    let venueCapacity = null;
    if (req.body.venueId !== undefined) {
      const venue = await prisma.venue.findUnique({
        where: { id: req.body.venueId },
      });
      if (!venue) {
        throw new ApiError(404, 'Referenced venue not found');
      }
      venueCapacity = venue.capacity;
      updateData.venueId = req.body.venueId;
    }

    // Capacity updates
    if (req.body.totalCapacity !== undefined && req.body.totalCapacity !== null && req.body.totalCapacity !== '') {
      const newTotal = parseInt(req.body.totalCapacity, 10);
      if (isNaN(newTotal) || newTotal <= 0) {
        throw new ApiError(400, 'Total capacity must be a positive integer');
      }

      // Check against venue capacity
      if (venueCapacity && newTotal > venueCapacity) {
        throw new ApiError(400, `Total capacity (${newTotal}) cannot exceed venue capacity (${venueCapacity})`);
      }

      // Ensure new total capacity is not less than already booked tickets
      const bookedCount = event.totalCapacity - event.availableCapacity;
      if (newTotal < bookedCount) {
        throw new ApiError(400, `Cannot reduce capacity to ${newTotal}. There are already ${bookedCount} tickets booked.`);
      }

      updateData.totalCapacity = newTotal;
      updateData.availableCapacity = newTotal - bookedCount;
    }

    // Status check
    if (req.body.status) {
      const validStatuses = ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'];
      const eventStatus = req.body.status.toUpperCase();
      if (!validStatuses.includes(eventStatus)) {
        throw new ApiError(400, `Status must be one of: ${validStatuses.join(', ')}`);
      }
      updateData.status = eventStatus;
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        Venue: true,
        TicketType: true,
        User: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    ApiResponse.success(res, { event: updatedEvent }, 'Event updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an event
 * DELETE /api/v1/events/:id
 * Allowed roles: Event Organizer or ADMIN
 */
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Check if event exists
    const event = await prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    // 2. Ownership / permission check (owner or admin)
    if (event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to delete this event');
    }

    // 3. Safety check: Check for existing bookings
    const bookingCount = await prisma.booking.count({
      where: { eventId: id },
    });

    if (bookingCount > 0) {
      throw new ApiError(
        400,
        `Cannot delete event because it has ${bookingCount} existing booking(s). You can change its status to CANCELLED instead.`
      );
    }

    // 4. Safe cascade deletion of related child records (attendees, reviews, ticketTypes)
    await prisma.$transaction(async (tx) => {
      await tx.attendee.deleteMany({ where: { eventId: id } });
      await tx.review.deleteMany({ where: { eventId: id } });
      await tx.ticketType.deleteMany({ where: { eventId: id } });
      await tx.event.delete({ where: { id } });
    });

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
