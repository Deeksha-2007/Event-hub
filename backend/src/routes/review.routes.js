const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authenticate = require('../middlewares/auth.middleware');

router.get('/event/:eventId', reviewController.getEventReviews);
router.post('/event/:eventId', authenticate, reviewController.createReview);

module.exports = router;
