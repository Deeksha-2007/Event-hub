const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.get('/event/:eventId', ticketController.getTicketsByEvent);
router.post('/event/:eventId', authenticate, authorize('ORGANIZER', 'ADMIN'), ticketController.createTicketType);

module.exports = router;
