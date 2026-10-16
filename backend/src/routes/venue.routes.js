const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venue.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

router.get('/', venueController.getAllVenues);
router.post('/', authenticate, authorize('ORGANIZER', 'ADMIN'), venueController.createVenue);

module.exports = router;
