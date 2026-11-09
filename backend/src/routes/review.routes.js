const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authenticate = require('../middlewares/auth.middleware');

// ─── Event reviews ────────────────────────────────────────────────────────────
// Public: anyone can read reviews
router.get('/event/:eventId', reviewController.getEventReviews);

// Authenticated: submit a new review
router.post('/event/:eventId', authenticate, reviewController.createReview);

// ─── Individual review CRUD ───────────────────────────────────────────────────
// Owner or ADMIN can update/delete (ownership checked inside controller)
router.put('/:reviewId', authenticate, reviewController.updateReview);
router.patch('/:reviewId', authenticate, reviewController.updateReview);
router.delete('/:reviewId', authenticate, reviewController.deleteReview);

module.exports = router;
