const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authenticate = require('../middlewares/auth.middleware');
const { optionalAuthenticate } = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

// ─── Public routes with optional auth ────────────────────────────────────────
// optionalAuthenticate populates req.user when a token is present but
// does NOT reject unauthenticated requests. This lets the controller apply
// role-aware status filtering (ADMIN sees all, ORGANIZER sees own drafts, etc.)
router.get('/', optionalAuthenticate, eventController.getAllEvents);

// ─── Protected: organizer's own events ───────────────────────────────────────
// MUST be declared BEFORE /:id so Express does not treat "my-events" as an id.
router.get(
  '/my-events',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  eventController.getMyEvents
);

// ─── Single event (optional auth so owner can see own draft) ─────────────────
router.get('/:id', optionalAuthenticate, eventController.getEventById);

// ─── Mutation routes (require strict auth + role) ─────────────────────────────
router.post('/', authenticate, authorize('ORGANIZER', 'ADMIN'), eventController.createEvent);
router.put('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), eventController.updateEvent);
router.patch('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), eventController.updateEvent);
router.delete('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), eventController.deleteEvent);

module.exports = router;
