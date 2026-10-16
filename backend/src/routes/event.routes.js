const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authenticate, authorize('ORGANIZER', 'ADMIN'), eventController.createEvent);
router.put('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), eventController.updateEvent);
router.delete('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), eventController.deleteEvent);

module.exports = router;
