const express = require('express');
const router = express.Router();
const { bookEvent, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, bookEvent);
router.get('/my', protect, getMyBookings);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
