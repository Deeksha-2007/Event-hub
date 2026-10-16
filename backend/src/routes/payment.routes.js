const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/process', authenticate, paymentController.processPayment);
router.get('/booking/:bookingId', authenticate, paymentController.getPaymentByBooking);

module.exports = router;
