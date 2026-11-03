const crypto = require('crypto');
const QRCode = require('qrcode');
const prisma = require('../config/db');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { parsePaginationParams, getPaginationMetadata } = require('../utils/pagination');

/**
 * Get attendee list for an event (organizer/admin only)
 * GET /api/v1/events/:eventId/attendees
 *
 * Query params: page, limit, search, status, ticketTypeId, checkInStatus
 */
const getEventAttendees = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { search, status, ticketTypeId, checkInStatus } = req.query;

    // 1. Verify event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    // 2. Verify organizer ownership or admin
    if (event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to view attendees for this event');
    }

    // 3. Build where clause
    const where = { eventId };

    if (search) {
      where.OR = [
        { attendeeName: { contains: search, mode: 'insensitive' } },
        { attendeeEmail: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    if (ticketTypeId) {
      where.ticketTypeId = ticketTypeId;
    }

    if (checkInStatus !== undefined && checkInStatus !== '') {
      where.checkInStatus = checkInStatus === 'true' || checkInStatus === '1';
    }

    // 4. Paginate
    const { page, limit, skip } = parsePaginationParams(req.query);

    const [totalRecords, attendees] = await Promise.all([
      prisma.attendee.count({ where }),
      prisma.attendee.findMany({
        where,
        include: {
          Booking: {
            select: { id: true, bookingReference: true, status: true, createdAt: true },
          },
          TicketType: {
            select: { id: true, name: true, price: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const pagination = getPaginationMetadata(totalRecords, page, limit);

    // Map results to consistent shape
    const data = attendees.map((a) => ({
      id: a.id,
      attendeeName: a.attendeeName,
      attendeeEmail: a.attendeeEmail,
      phone: a.phone,
      eventId: a.eventId,
      registrationId: a.bookingId,
      bookingReference: a.Booking?.bookingReference || null,
      registrationDate: a.createdAt,
      ticketType: a.TicketType?.name || null,
      ticketTypeId: a.ticketTypeId,
      ticketPrice: a.TicketType?.price || null,
      checkInStatus: a.checkInStatus,
      checkInTime: a.checkInTime,
      status: a.status,
      bookingStatus: a.Booking?.status || null,
    }));

    ApiResponse.success(res, { attendees: data, pagination }, 'Attendee list retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get attendee details by attendee ID
 * GET /api/v1/attendees/:attendeeId
 */
const getAttendeeById = async (req, res, next) => {
  try {
    const { attendeeId } = req.params;

    const attendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
      include: {
        Booking: {
          select: { id: true, bookingReference: true, status: true, createdAt: true, userId: true },
        },
        TicketType: {
          select: { id: true, name: true, price: true },
        },
        Event: {
          select: { id: true, title: true, organizerId: true, startDate: true, endDate: true },
        },
        User: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!attendee) {
      throw new ApiError(404, 'Attendee not found');
    }

    // Authorization: event organizer, admin, or the attendee themselves
    const isOrganizer = attendee.Event?.organizerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';
    const isSelf = attendee.userId === req.user.id || attendee.Booking?.userId === req.user.id;

    if (!isOrganizer && !isAdmin && !isSelf) {
      throw new ApiError(403, 'You are not authorized to view this attendee');
    }

    const data = {
      id: attendee.id,
      attendeeName: attendee.attendeeName,
      attendeeEmail: attendee.attendeeEmail,
      phone: attendee.phone,
      eventId: attendee.eventId,
      eventTitle: attendee.Event?.title || null,
      registrationId: attendee.bookingId,
      bookingReference: attendee.Booking?.bookingReference || null,
      registrationDate: attendee.createdAt,
      ticketType: attendee.TicketType?.name || null,
      ticketTypeId: attendee.ticketTypeId,
      ticketPrice: attendee.TicketType?.price || null,
      checkInStatus: attendee.checkInStatus,
      checkInTime: attendee.checkInTime,
      status: attendee.status,
      bookingStatus: attendee.Booking?.status || null,
    };

    ApiResponse.success(res, { attendee: data }, 'Attendee details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Manually add an attendee to an event
 * POST /api/v1/events/:eventId/attendees
 */
const addAttendee = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { attendeeName, attendeeEmail, phone, ticketTypeId } = req.body;

    // 1. Validate required fields
    if (!attendeeName || !attendeeName.trim()) {
      throw new ApiError(400, 'Attendee name is required');
    }
    if (!attendeeEmail || !attendeeEmail.trim()) {
      throw new ApiError(400, 'Attendee email is required');
    }
    if (!ticketTypeId) {
      throw new ApiError(400, 'Ticket type ID is required');
    }

    // 2. Verify event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    // 3. Authorization: organizer or admin
    if (event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to add attendees to this event');
    }

    if (event.status === 'CANCELLED') {
      throw new ApiError(400, 'Cannot add attendees to a cancelled event');
    }

    // 4. Verify ticket type belongs to event
    const ticketType = await prisma.ticketType.findUnique({ where: { id: ticketTypeId } });
    if (!ticketType) {
      throw new ApiError(404, 'Ticket type not found');
    }
    if (ticketType.eventId !== eventId) {
      throw new ApiError(400, 'Ticket type does not belong to this event');
    }

    // 5. Atomic creation with capacity checks
    const newAttendee = await prisma.$transaction(async (tx) => {
      // Check ticket availability
      const updateTicket = await tx.ticketType.updateMany({
        where: { id: ticketTypeId, availableQuantity: { gte: 1 } },
        data: { availableQuantity: { decrement: 1 }, updatedAt: new Date() },
      });
      if (updateTicket.count === 0) {
        throw new ApiError(400, 'No tickets available for this ticket type');
      }

      // Check event capacity
      const updateEvent = await tx.event.updateMany({
        where: { id: eventId, availableCapacity: { gte: 1 } },
        data: { availableCapacity: { decrement: 1 }, updatedAt: new Date() },
      });
      if (updateEvent.count === 0) {
        throw new ApiError(400, 'Event is at full capacity');
      }

      // Create a booking for this manual addition
      const bookingId = crypto.randomUUID();
      const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
      const bookingReference = `EN-${Date.now().toString().slice(-6)}-${randomSuffix}`;

      await tx.booking.create({
        data: {
          id: bookingId,
          bookingReference,
          userId: req.user.id,
          eventId,
          ticketTypeId,
          quantity: 1,
          unitPrice: ticketType.price,
          totalAmount: ticketType.price,
          status: 'CONFIRMED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const attendeeId = crypto.randomUUID();
      const qrToken = crypto.randomBytes(32).toString('hex');

      await tx.attendee.create({
        data: {
          id: attendeeId,
          bookingId,
          eventId,
          userId: null,
          ticketTypeId,
          attendeeName: attendeeName.trim(),
          attendeeEmail: attendeeEmail.trim(),
          phone: phone || null,
          qrToken,
          checkInStatus: false,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return tx.attendee.findUnique({
        where: { id: attendeeId },
        include: {
          Booking: {
            select: { id: true, bookingReference: true, status: true },
          },
          TicketType: {
            select: { id: true, name: true, price: true },
          },
        },
      });
    });

    ApiResponse.success(res, { attendee: newAttendee }, 'Attendee added successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove/Cancel an attendee's registration
 * DELETE /api/v1/attendees/:attendeeId
 */
const removeAttendee = async (req, res, next) => {
  try {
    const { attendeeId } = req.params;

    const attendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
      include: {
        Event: { select: { id: true, organizerId: true } },
        Booking: { select: { id: true, status: true } },
      },
    });

    if (!attendee) {
      throw new ApiError(404, 'Attendee not found');
    }

    // Authorization: organizer or admin
    if (attendee.Event?.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to remove this attendee');
    }

    if (attendee.status === 'CANCELLED') {
      throw new ApiError(400, 'Attendee registration is already cancelled');
    }

    // Soft cancel: mark status as CANCELLED, restore capacity
    await prisma.$transaction(async (tx) => {
      await tx.attendee.update({
        where: { id: attendeeId },
        data: { status: 'CANCELLED', checkInStatus: false, updatedAt: new Date() },
      });

      // Restore ticket availability
      await tx.ticketType.update({
        where: { id: attendee.ticketTypeId },
        data: { availableQuantity: { increment: 1 }, updatedAt: new Date() },
      });

      // Restore event capacity
      await tx.event.update({
        where: { id: attendee.eventId },
        data: { availableCapacity: { increment: 1 }, updatedAt: new Date() },
      });
    });

    ApiResponse.success(res, null, 'Attendee registration cancelled successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get QR code for a registration (attendee)
 * GET /api/v1/registrations/:registrationId/qr
 *
 * registrationId can be a booking ID or attendee ID
 */
const getRegistrationQR = async (req, res, next) => {
  try {
    const { registrationId } = req.params;

    // Try finding by attendee ID first, then by booking ID
    let attendee = await prisma.attendee.findUnique({
      where: { id: registrationId },
      include: {
        Event: { select: { id: true, title: true, organizerId: true } },
        Booking: { select: { id: true, userId: true, status: true } },
      },
    });

    if (!attendee) {
      // Try finding by booking ID (return the first attendee of the booking)
      attendee = await prisma.attendee.findFirst({
        where: { bookingId: registrationId },
        include: {
          Event: { select: { id: true, title: true, organizerId: true } },
          Booking: { select: { id: true, userId: true, status: true } },
        },
      });
    }

    if (!attendee) {
      throw new ApiError(404, 'Registration not found');
    }

    // Authorization: booking owner, event organizer, or admin
    const isOwner = attendee.Booking?.userId === req.user.id;
    const isOrganizer = attendee.Event?.organizerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isOrganizer && !isAdmin) {
      throw new ApiError(403, 'You are not authorized to view this QR code');
    }

    if (attendee.status === 'CANCELLED' || attendee.Booking?.status === 'CANCELLED') {
      throw new ApiError(400, 'Cannot generate QR code for a cancelled registration');
    }

    // Generate QR token if not yet set (for older records)
    let qrToken = attendee.qrToken;
    if (!qrToken) {
      qrToken = crypto.randomBytes(32).toString('hex');
      await prisma.attendee.update({
        where: { id: attendee.id },
        data: { qrToken, updatedAt: new Date() },
      });
    }

    // Generate QR code as data URL (base64 PNG)
    const qrDataUrl = await QRCode.toDataURL(qrToken, {
      errorCorrectionLevel: 'M',
      width: 300,
      margin: 2,
    });

    ApiResponse.success(
      res,
      {
        attendeeId: attendee.id,
        eventId: attendee.eventId,
        eventTitle: attendee.Event?.title || null,
        qrToken,
        qrCode: qrDataUrl,
      },
      'QR code retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Verify QR code and check in attendee (atomic)
 * POST /api/v1/events/:eventId/check-in/verify
 * Body: { qrToken: string }
 */
const verifyCheckIn = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { qrToken } = req.body;

    if (!qrToken || !qrToken.trim()) {
      throw new ApiError(400, 'QR token is required');
    }

    // 1. Verify event exists and user is authorized
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to perform check-in for this event');
    }

    // 2. Find attendee by QR token
    const attendee = await prisma.attendee.findUnique({
      where: { qrToken: qrToken.trim() },
      include: {
        Booking: { select: { id: true, status: true, bookingReference: true } },
        TicketType: { select: { id: true, name: true } },
      },
    });

    if (!attendee) {
      throw new ApiError(404, 'Invalid QR code. No registration found for this token');
    }

    // 3. Verify the registration belongs to this event
    if (attendee.eventId !== eventId) {
      throw new ApiError(400, 'This QR code does not belong to this event');
    }

    // 4. Check registration status
    if (attendee.status === 'CANCELLED') {
      throw new ApiError(400, 'This registration has been cancelled');
    }

    // 5. Check booking status
    if (attendee.Booking?.status === 'CANCELLED') {
      throw new ApiError(400, 'The booking for this registration has been cancelled');
    }

    // 6. Check if already checked in
    if (attendee.checkInStatus === true) {
      throw new ApiError(409, 'This attendee has already checked in', [
        { field: 'checkInTime', message: `Checked in at ${attendee.checkInTime?.toISOString()}` },
      ]);
    }

    // 7. Atomic check-in: only update if checkInStatus is still false (prevents race conditions)
    const checkInTime = new Date();
    const updateResult = await prisma.attendee.updateMany({
      where: {
        id: attendee.id,
        checkInStatus: false,
      },
      data: {
        checkInStatus: true,
        checkInTime,
        updatedAt: checkInTime,
      },
    });

    if (updateResult.count === 0) {
      throw new ApiError(409, 'This attendee has already checked in (concurrent check-in detected)');
    }

    ApiResponse.success(
      res,
      {
        attendeeId: attendee.id,
        attendeeName: attendee.attendeeName,
        attendeeEmail: attendee.attendeeEmail,
        eventId: attendee.eventId,
        ticketType: attendee.TicketType?.name || null,
        bookingReference: attendee.Booking?.bookingReference || null,
        checkInTime: checkInTime.toISOString(),
      },
      'Check-in successful'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get event check-in statistics
 * GET /api/v1/events/:eventId/check-in/stats
 */
const getCheckInStats = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    // 1. Verify event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    // 2. Authorization: organizer or admin
    if (event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to view check-in statistics for this event');
    }

    // 3. Calculate statistics (only for ACTIVE attendees with CONFIRMED bookings)
    const [totalRegistered, checkedIn, attendeeList] = await Promise.all([
      prisma.attendee.count({
        where: {
          eventId,
          status: 'ACTIVE',
          Booking: { status: 'CONFIRMED' },
        },
      }),
      prisma.attendee.count({
        where: {
          eventId,
          status: 'ACTIVE',
          checkInStatus: true,
          Booking: { status: 'CONFIRMED' },
        },
      }),
      prisma.attendee.findMany({
        where: {
          eventId,
          status: 'ACTIVE',
          Booking: { status: 'CONFIRMED' },
        },
        select: {
          id: true,
          attendeeName: true,
          checkInStatus: true,
          checkInTime: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const notCheckedIn = totalRegistered - checkedIn;
    const checkInPercentage = totalRegistered > 0 ? Math.round((checkedIn / totalRegistered) * 10000) / 100 : 0;

    ApiResponse.success(
      res,
      {
        eventId,
        eventTitle: event.title,
        totalRegistered,
        totalCheckedIn: checkedIn,
        totalNotCheckedIn: notCheckedIn,
        checkInPercentage,
        attendees: attendeeList,
      },
      'Check-in statistics retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEventAttendees,
  getAttendeeById,
  addAttendee,
  removeAttendee,
  getRegistrationQR,
  verifyCheckIn,
  getCheckInStats,
};
