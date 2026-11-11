const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

// ─── Public routes ────────────────────────────────────────────────────────────
// GET /api/v1/tickets/event/:eventId - Get all ticket categories for an event
router.get('/event/:eventId', ticketController.getTicketsByEvent);

// GET /api/v1/tickets/:id - Get ticket category details by ID
router.get('/:id', ticketController.getTicketById);

// ─── Mutation routes (ORGANIZER & ADMIN) ───────────────────────────────────────
// POST /api/v1/tickets/event/:eventId - Create a new ticket category for an event
router.post(
  '/event/:eventId',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  ticketController.createTicketCategory
);

// POST /api/v1/tickets - Create a new ticket category (eventId in request body)
router.post(
  '/',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  ticketController.createTicketCategory
);

// PUT & PATCH /api/v1/tickets/:id - Update an existing ticket category
router.put(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  ticketController.updateTicketCategory
);
router.patch(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  ticketController.updateTicketCategory
);

// PUT & PATCH /api/v1/tickets/event/:eventId/:id - Update with eventId in path
router.put(
  '/event/:eventId/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  ticketController.updateTicketCategory
);
router.patch(
  '/event/:eventId/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  ticketController.updateTicketCategory
);

// DELETE /api/v1/tickets/:id - Delete a ticket category
router.delete(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  ticketController.deleteTicketCategory
);

// DELETE /api/v1/tickets/event/:eventId/:id - Delete with eventId in path
router.delete(
  '/event/:eventId/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  ticketController.deleteTicketCategory
);

module.exports = router;
