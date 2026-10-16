const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.get('/stats', authenticate, authorize('ORGANIZER', 'ADMIN'), dashboardController.getOrganizerStats);
router.get('/events/:eventId/attendees', authenticate, authorize('ORGANIZER', 'ADMIN'), dashboardController.getEventAttendees);

module.exports = router;
