
const crypto = require('crypto');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const prisma = require('../config/db');
const {
  parsePaginationParams,
  getPaginationMetadata,
} = require('../utils/pagination');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Build Prisma where clause based on user role.
 *
 * Public / USER:
 *   PUBLISHED + COMPLETED
 *
 * ORGANIZER:
 *   PUBLISHED events from everyone + own events of any status
 *
 * ADMIN:
 *   All events
 */
function buildStatusFilter(req, extraWhere = {}) {
  const user = req.user;

  if (user && user.role === 'ADMIN') {
    return { ...extraWhere };
  }

  if (user && user.role === 'ORGANIZER') {
    return {
      ...extraWhere,
      OR: [
        { status: 'PUBLISHED' },
        { status: 'COMPLETED' },
        { organizerId: user.id },
      ],
    };
  }

  // Public / USER can see published and completed events
  return {
    ...extraWhere,
    status: {
      in: ['PUBLISHED', 'COMPLETED'],
    },
  };
}

// ─── Get All Events ─────────────────────────────────────────────────────────

const getAllEvents = async (req, res, next) => {
  try {
    const {
      category,
      search,
      sort = "asc",
      sortBy = "startDate",
      upcoming,
    } = req.query;

    // Build base filter according to user role
    const baseWhere = buildStatusFilter(req);

    // Admin can filter by a specific status
    if (req.user && req.user.role === "ADMIN" && req.query.status) {
      const validStatuses = [
        "DRAFT",
        "PUBLISHED",
        "CANCELLED",
        "COMPLETED",
      ];

      const requested = req.query.status.toUpperCase();

      if (validStatuses.includes(requested)) {
        baseWhere.status = requested;
      }
    }

    // Category filter
    if (category) {
      baseWhere.category = {
        equals: category,
        mode: "insensitive",
      };
    }

    // Search filter
    if (search) {
      const searchCondition = {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };

      if (baseWhere.OR) {
        const existingOR = baseWhere.OR;
        delete baseWhere.OR;

        baseWhere.AND = [
          { OR: existingOR },
          searchCondition,
        ];
      } else {
        baseWhere.OR = searchCondition.OR;
      }
    }

    // Only include events that have not ended.
    // This is applied BEFORE database pagination.
    if (upcoming === "true") {
      baseWhere.endDate = {
        gte: new Date(),
      };
    }

    // Sorting
    const validSortFields = [
      "startDate",
      "createdAt",
      "title",
      "totalCapacity",
    ];

    const orderByField = validSortFields.includes(sortBy)
      ? sortBy
      : "startDate";

    const orderDirection =
      sort.toLowerCase() === "desc" ? "desc" : "asc";

    // Pagination
    const { page, limit, skip } = parsePaginationParams(req.query);

    // Count and fetch using exactly the same filters
    const [totalRecords, events] = await Promise.all([
      prisma.event.count({
        where: baseWhere,
      }),

      prisma.event.findMany({
        where: baseWhere,
        include: {
          Venue: true,
          TicketType: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          [orderByField]: orderDirection,
        },
        skip,
        take: limit,
      }),
    ]);

    const pagination = getPaginationMetadata(
      totalRecords,
      page,
      limit
    );

    ApiResponse.success(
      res,
      { events, pagination },
      "Events retrieved successfully"
    );

  } catch (error) {
    next(error);
  }
};


// ─── Get Event By ID ────────────────────────────────────────────────────────

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        Venue: true,
        TicketType: true,
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        Review: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    // Completed events are public.
    // Draft and cancelled events remain restricted.
    if (
      event.status === 'DRAFT' ||
      event.status === 'CANCELLED'
    ) {
      const user = req.user;

      if (!user) {
        throw new ApiError(404, 'Event not found');
      }

      if (user.role === 'ADMIN') {
        // Admin can access all events.
      } else if (
        user.role === 'ORGANIZER' &&
        event.organizerId === user.id
      ) {
        // Organizer can access their own events.
      } else {
        throw new ApiError(404, 'Event not found');
      }
    }

    const reviewCount = event.Review.length;

    const avgRating =
      reviewCount > 0
        ? parseFloat(
            (
              event.Review.reduce(
                (sum, review) => sum + review.rating,
                0
              ) / reviewCount
            ).toFixed(1)
          )
        : null;

    ApiResponse.success(
      res,
      {
        event,
        avgRating,
        reviewCount,
      },
      'Event details retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

// ─── Get My Events ──────────────────────────────────────────────────────────

const getMyEvents = async (req, res, next) => {
  try {
    const organizerId = req.user.id;

    const {
      search,
      status,
      sort = 'desc',
      sortBy = 'createdAt',
    } = req.query;

    const where = { organizerId };

    if (status) {
      const validStatuses = [
        'DRAFT',
        'PUBLISHED',
        'CANCELLED',
        'COMPLETED',
      ];

      const requested = status.toUpperCase();

      if (validStatuses.includes(requested)) {
        where.status = requested;
      }
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const validSortFields = [
      'startDate',
      'endDate',
      'createdAt',
      'title',
      'totalCapacity',
    ];

    const orderByField = validSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const orderDirection =
      sort.toLowerCase() === 'desc' ? 'desc' : 'asc';

    const { page, limit, skip } = parsePaginationParams(req.query);

    const [totalRecords, events] = await Promise.all([
      prisma.event.count({ where }),

      prisma.event.findMany({
        where,
        include: {
          Venue: true,
          TicketType: true,
          _count: {
            select: {
              Booking: true,
            },
          },
        },
        orderBy: {
          [orderByField]: orderDirection,
        },
        skip,
        take: limit,
      }),
    ]);

    const enriched = events.map((event) => {
      const booked =
        event.totalCapacity - event.availableCapacity;

      return {
        ...event,
        ticketsSold: booked,
      };
    });

    const pagination = getPaginationMetadata(
      totalRecords,
      page,
      limit
    );

    ApiResponse.success(
      res,
      {
        events: enriched,
        pagination,
      },
      'My events retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

// ─── Create Event ───────────────────────────────────────────────────────────


const createEvent = async (req, res, next) => {
  try {
    const title = req.body.title || req.body.name;

    const {
      description,
      category,
      bannerUrl,
      imageUrl,
      venueId,
      totalCapacity,
      status,
      ticketTypes,
    } = req.body;

    const organizerId = req.user.id;

    // Validate title
    if (!title || !title.trim()) {
      throw new ApiError(400, "Event title is required");
    }

    // Validate description
    if (!description || !description.trim()) {
      throw new ApiError(400, "Event description is required");
    }

    // Validate event format
    const format = (req.body.format || "IN_PERSON").toUpperCase();

    if (!["ONLINE", "IN_PERSON"].includes(format)) {
      throw new ApiError(
        400,
        "Format must be either ONLINE or IN_PERSON"
      );
    }

    // Validate dates
    const startDateRaw = req.body.startDate || req.body.date;

    if (!startDateRaw) {
      throw new ApiError(400, "Event start date is required");
    }

    const start = new Date(startDateRaw);

    if (isNaN(start.getTime())) {
      throw new ApiError(400, "Invalid start date format");
    }

    let end;

    if (req.body.endDate) {
      end = new Date(req.body.endDate);

      if (isNaN(end.getTime())) {
        throw new ApiError(400, "Invalid end date format");
      }

      if (end < start) {
        throw new ApiError(
          400,
          "End date cannot be before start date"
        );
      }
    } else {
      end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    }

    // Validate venue according to event format
    let venue = null;

    if (format === "IN_PERSON") {
      if (!venueId) {
        throw new ApiError(
          400,
          "Venue ID is required for in-person events"
        );
      }

      venue = await prisma.venue.findUnique({
        where: { id: venueId },
      });

      if (!venue) {
        throw new ApiError(
          404,
          "Referenced venue not found"
        );
      }
    }

    if (format === "ONLINE" && venueId) {
      throw new ApiError(
        400,
        "Online events cannot have a physical venue"
      );
    }

    // Validate capacity
    let capacity;

    if (
      totalCapacity !== undefined &&
      totalCapacity !== null &&
      totalCapacity !== ""
    ) {
      capacity = parseInt(totalCapacity, 10);

      if (isNaN(capacity) || capacity <= 0) {
        throw new ApiError(
          400,
          "Total capacity must be a positive integer"
        );
      }

      // Only physical events have venue capacity restrictions
      if (venue && capacity > venue.capacity) {
        throw new ApiError(
          400,
          `Total capacity (${capacity}) cannot exceed venue capacity (${venue.capacity})`
        );
      }
    } else {
      // Default capacity for physical events comes from venue.
      // Online events use a default capacity of 500.
      capacity = venue ? venue.capacity : 500;
    }

    // Validate status
    const validStatuses = [
      "DRAFT",
      "PUBLISHED",
      "CANCELLED",
      "COMPLETED",
    ];

    const eventStatus = status
      ? status.toUpperCase()
      : "PUBLISHED";

    if (!validStatuses.includes(eventStatus)) {
      throw new ApiError(
        400,
        `Status must be one of: ${validStatuses.join(", ")}`
      );
    }

    // Validate optional ticket types
    if (ticketTypes !== undefined && !Array.isArray(ticketTypes)) {
      throw new ApiError(
        400,
        "Ticket types must be an array"
      );
    }

    const eventId = crypto.randomUUID();

    // Create event and ticket types in one transaction
    const createdEvent = await prisma.$transaction(async (tx) => {
      await tx.event.create({
        data: {
          id: eventId,
          title: title.trim(),
          description: description.trim(),
          category: category ? category.trim() : "Technology",
          format,
          bannerUrl: bannerUrl || imageUrl || null,
          startDate: start,
          endDate: end,

          // Online events have no physical venue
          venueId: venue ? venue.id : null,

          organizerId,
          totalCapacity: capacity,
          availableCapacity: capacity,
          status: eventStatus,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create optional ticket types
      if (Array.isArray(ticketTypes) && ticketTypes.length > 0) {
        for (const ticket of ticketTypes) {
          if (
            !ticket.name ||
            ticket.price === undefined ||
            ticket.totalQuantity === undefined
          ) {
            throw new ApiError(
              400,
              "Each ticket must have a name, price and totalQuantity"
            );
          }

          const quantity = parseInt(ticket.totalQuantity, 10);
          const price = parseFloat(ticket.price);

          if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new ApiError(
              400,
              "Ticket quantity must be a positive integer"
            );
          }

          if (!Number.isFinite(price) || price < 0) {
            throw new ApiError(
              400,
              "Ticket price must be a valid non-negative number"
            );
          }

          await tx.ticketType.create({
            data: {
              id: crypto.randomUUID(),
              eventId,
              name: ticket.name.trim(),
              price,
              totalQuantity: quantity,
              availableQuantity: quantity,
              description: ticket.description
                ? ticket.description.trim()
                : null,
              perks: ticket.perks
                ? ticket.perks.trim()
                : null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }
      }

      return tx.event.findUnique({
        where: { id: eventId },
        include: {
          Venue: true,
          TicketType: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });

    ApiResponse.success(
      res,
      { event: createdEvent },
      "Event created successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};


// ─── Update Event ───────────────────────────────────────────────────────────


const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Find existing event
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    // 2. Check ownership / admin permission
    if (
      event.organizerId !== req.user.id &&
      req.user.role !== "ADMIN"
    ) {
      throw new ApiError(
        403,
        "You are not authorized to update this event"
      );
    }

    const updateData = {
      updatedAt: new Date(),
    };

    // 3. Update title
    const title = req.body.title || req.body.name;

    if (title !== undefined) {
      if (!title.trim()) {
        throw new ApiError(
          400,
          "Event title cannot be empty"
        );
      }

      updateData.title = title.trim();
    }

    // 4. Update description
    if (req.body.description !== undefined) {
      if (
        typeof req.body.description !== "string" ||
        !req.body.description.trim()
      ) {
        throw new ApiError(
          400,
          "Event description cannot be empty"
        );
      }

      updateData.description =
        req.body.description.trim();
    }

    // 5. Update category
    if (req.body.category !== undefined) {
      if (
        typeof req.body.category !== "string" ||
        !req.body.category.trim()
      ) {
        throw new ApiError(
          400,
          "Event category cannot be empty"
        );
      }

      updateData.category = req.body.category.trim();
    }

    // 6. Update banner image
    if (
      req.body.bannerUrl !== undefined ||
      req.body.imageUrl !== undefined
    ) {
      updateData.bannerUrl =
        req.body.bannerUrl || req.body.imageUrl || null;
    }

    // 7. Validate event format
    const format = (
      req.body.format || event.format || "IN_PERSON"
    ).toUpperCase();

    if (!["ONLINE", "IN_PERSON"].includes(format)) {
      throw new ApiError(
        400,
        "Format must be either ONLINE or IN_PERSON"
      );
    }

    updateData.format = format;

    // 8. Validate and update dates
    let start = event.startDate;
    let end = event.endDate;

    if (
      req.body.startDate !== undefined ||
      req.body.date !== undefined
    ) {
      const parsedStart = new Date(
        req.body.startDate || req.body.date
      );

      if (isNaN(parsedStart.getTime())) {
        throw new ApiError(
          400,
          "Invalid start date format"
        );
      }

      start = parsedStart;
      updateData.startDate = start;
    }

    if (req.body.endDate !== undefined) {
      const parsedEnd = new Date(req.body.endDate);

      if (isNaN(parsedEnd.getTime())) {
        throw new ApiError(
          400,
          "Invalid end date format"
        );
      }

      end = parsedEnd;
      updateData.endDate = end;
    }

    if (end < start) {
      throw new ApiError(
        400,
        "End date cannot be before start date"
      );
    }

    // 9. Validate venue according to event format
    let venueCapacity = null;

    if (format === "ONLINE") {
      // Online events must not have a physical venue
      if (
        req.body.venueId !== undefined &&
        req.body.venueId !== null &&
        req.body.venueId !== ""
      ) {
        throw new ApiError(
          400,
          "Online events cannot have a physical venue"
        );
      }

      updateData.venueId = null;
    } else {
      // In-person events require a venue
      const nextVenueId =
        req.body.venueId !== undefined
          ? req.body.venueId
          : event.venueId;

      if (!nextVenueId) {
        throw new ApiError(
          400,
          "Venue ID is required for in-person events"
        );
      }

      const venue = await prisma.venue.findUnique({
        where: { id: nextVenueId },
      });

      if (!venue) {
        throw new ApiError(
          404,
          "Referenced venue not found"
        );
      }

      venueCapacity = venue.capacity;
      updateData.venueId = venue.id;
    }

    // 10. Update capacity
    if (
      req.body.totalCapacity !== undefined &&
      req.body.totalCapacity !== null &&
      req.body.totalCapacity !== ""
    ) {
      const newTotal = parseInt(
        req.body.totalCapacity,
        10
      );

      if (!Number.isInteger(newTotal) || newTotal <= 0) {
        throw new ApiError(
          400,
          "Total capacity must be a positive integer"
        );
      }

      // Physical event capacity cannot exceed venue capacity
      if (
        venueCapacity !== null &&
        newTotal > venueCapacity
      ) {
        throw new ApiError(
          400,
          `Total capacity (${newTotal}) cannot exceed venue capacity (${venueCapacity})`
        );
      }

      // Preserve already booked tickets
      const bookedCount =
        event.totalCapacity - event.availableCapacity;

      if (newTotal < bookedCount) {
        throw new ApiError(
          400,
          `Cannot reduce capacity to ${newTotal}. There are already ${bookedCount} tickets booked.`
        );
      }

      updateData.totalCapacity = newTotal;
      updateData.availableCapacity =
        newTotal - bookedCount;
    }

    // 11. Update status
    if (req.body.status !== undefined) {
      const validStatuses = [
        "DRAFT",
        "PUBLISHED",
        "CANCELLED",
        "COMPLETED",
      ];

      const eventStatus = req.body.status.toUpperCase();

      if (!validStatuses.includes(eventStatus)) {
        throw new ApiError(
          400,
          `Status must be one of: ${validStatuses.join(", ")}`
        );
      }

      updateData.status = eventStatus;
    }

    // 12. Save updated event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        Venue: true,
        TicketType: true,
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    ApiResponse.success(
      res,
      { event: updatedEvent },
      "Event updated successfully"
    );
  } catch (error) {
    next(error);
  }
};


// ─── Delete Event ───────────────────────────────────────────────────────────

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (
      event.organizerId !== req.user.id &&
      req.user.role !== 'ADMIN'
    ) {
      throw new ApiError(
        403,
        'You are not authorized to delete this event'
      );
    }

    const bookingCount = await prisma.booking.count({
      where: { eventId: id },
    });

    if (bookingCount > 0) {
      throw new ApiError(
        400,
        `Cannot delete event because it has ${bookingCount} existing booking(s). You can change its status to CANCELLED instead.`
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.attendee.deleteMany({
        where: { eventId: id },
      });

      await tx.review.deleteMany({
        where: { eventId: id },
      });

      await tx.ticketType.deleteMany({
        where: { eventId: id },
      });

      await tx.event.delete({
        where: { id },
      });
    });

    ApiResponse.success(
      res,
      null,
      'Event deleted successfully'
    );
  } catch (error) {
    next(error);
  }
};

// ─── Exports ────────────────────────────────────────────────────────────────

module.exports = {
  getAllEvents,
  getEventById,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
