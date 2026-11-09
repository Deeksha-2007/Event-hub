const crypto = require('crypto');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const prisma = require('../config/db');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeRatingSummary(reviews) {
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? parseFloat(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        )
      : null;
  return { totalReviews, avgRating };
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * Get all reviews for a specific event.
 * GET /api/v1/reviews/event/:eventId
 * Public – no auth required.
 */
const getEventReviews = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, status: true },
    });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    const reviews = await prisma.review.findMany({
      where: { eventId },
      include: {
        User: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const { totalReviews, avgRating } = computeRatingSummary(reviews);

    ApiResponse.success(
      res,
      { reviews, avgRating, totalReviews },
      'Event reviews retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Submit a new review for an event.
 * POST /api/v1/reviews/event/:eventId
 * Requires authentication.
 */
const createReview = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    // 1. Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, status: true },
    });
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    // 2. Validate rating
    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      throw new ApiError(400, 'Rating must be an integer between 1 and 5');
    }

    // 3. Validate comment
    if (!comment || !comment.trim()) {
      throw new ApiError(400, 'Review comment is required');
    }
    if (comment.trim().length > 1000) {
      throw new ApiError(400, 'Review comment must not exceed 1000 characters');
    }

    // 4. Check for existing review (enforce @@unique([eventId, userId]))
    const existing = await prisma.review.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (existing) {
      throw new ApiError(
        409,
        'You have already submitted a review for this event. Edit your existing review instead.'
      );
    }

    // 5. Create review
    const review = await prisma.review.create({
      data: {
        id: crypto.randomUUID(),
        eventId,
        userId,
        rating: ratingNum,
        comment: comment.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        User: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    // 6. Return updated summary alongside new review
    const allReviews = await prisma.review.findMany({ where: { eventId } });
    const { totalReviews, avgRating } = computeRatingSummary(allReviews);

    ApiResponse.success(
      res,
      { review, avgRating, totalReviews },
      'Review submitted successfully',
      201
    );
  } catch (error) {
    // Catch Prisma unique constraint violation as a safety net
    if (error.code === 'P2002') {
      return next(new ApiError(409, 'You have already reviewed this event'));
    }
    next(error);
  }
};

/**
 * Update an existing review.
 * PUT /api/v1/reviews/:reviewId  or  PATCH /api/v1/reviews/:reviewId
 * Requires authentication. Only review owner or ADMIN.
 */
const updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // 1. Find review
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    // 2. Ownership / ADMIN check
    if (review.userId !== userId && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to update this review');
    }

    const updateData = { updatedAt: new Date() };

    // 3. Validate rating if provided
    if (req.body.rating !== undefined) {
      const ratingNum = parseInt(req.body.rating, 10);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        throw new ApiError(400, 'Rating must be an integer between 1 and 5');
      }
      updateData.rating = ratingNum;
    }

    // 4. Validate comment if provided
    if (req.body.comment !== undefined) {
      if (!req.body.comment.trim()) {
        throw new ApiError(400, 'Review comment cannot be empty');
      }
      if (req.body.comment.trim().length > 1000) {
        throw new ApiError(400, 'Review comment must not exceed 1000 characters');
      }
      updateData.comment = req.body.comment.trim();
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
      include: {
        User: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    // Return updated summary
    const allReviews = await prisma.review.findMany({ where: { eventId: updatedReview.eventId } });
    const { totalReviews, avgRating } = computeRatingSummary(allReviews);

    ApiResponse.success(
      res,
      { review: updatedReview, avgRating, totalReviews },
      'Review updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a review.
 * DELETE /api/v1/reviews/:reviewId
 * Requires authentication. Only review owner or ADMIN.
 */
const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // 1. Find review
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    // 2. Ownership / ADMIN check
    if (review.userId !== userId && req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to delete this review');
    }

    const { eventId } = review;

    await prisma.review.delete({ where: { id: reviewId } });

    // Return updated summary
    const allReviews = await prisma.review.findMany({ where: { eventId } });
    const { totalReviews, avgRating } = computeRatingSummary(allReviews);

    ApiResponse.success(
      res,
      { avgRating, totalReviews },
      'Review deleted successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEventReviews,
  createReview,
  updateReview,
  deleteReview,
};
