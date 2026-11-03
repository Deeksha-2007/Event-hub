const express = require('express');
const router = express.Router();
const attendeeController = require('../controllers/attendee.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

// --- Event-scoped attendee routes ---
// GET  /api/v1/attendees/events/:eventId          - Get attendee list for an event
// POST /api/v1/attendees/events/:eventId           - Manually add an attendee
// POST /api/v1/attendees/events/:eventId/check-in/verify - Verify QR and check in
// GET  /api/v1/attendees/events/:eventId/check-in/stats  - Check-in statistics
router.get(
  '/events/:eventId',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  attendeeController.getEventAttendees
);

router.post(
  '/events/:eventId',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  attendeeController.addAttendee
);

router.post(
  '/events/:eventId/check-in/verify',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  attendeeController.verifyCheckIn
);

router.get(
  '/events/:eventId/check-in/stats',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  attendeeController.getCheckInStats
);

// --- Registration QR route ---
// GET /api/v1/attendees/registrations/:registrationId/qr - Retrieve QR code
router.get(
  '/registrations/:registrationId/qr',
  authenticate,
  attendeeController.getRegistrationQR
);

// --- Individual attendee routes ---
// GET    /api/v1/attendees/:attendeeId - Get attendee details
// DELETE /api/v1/attendees/:attendeeId - Cancel attendee registration
router.get(
  '/:attendeeId',
  authenticate,
  attendeeController.getAttendeeById
);

router.delete(
  '/:attendeeId',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  attendeeController.removeAttendee
);

module.exports = router;
