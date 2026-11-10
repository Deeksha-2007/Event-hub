-- =============================================================================
-- EventHub (EventNest) - CP3: SQL Queries
-- Database: PostgreSQL
-- Based on: dbms/03_schema.sql
--
-- Parameter convention:
--   $1, $2, ... are positional parameters supplied by the application/client.
--   Each query is independent unless explicitly marked as a transaction workflow.
--   Run against the actual Prisma-managed database after migrations have been applied.
--
-- READ queries are SELECT statements.
-- WRITE queries insert or update application data.
-- =============================================================================


-- =============================================================================
-- READ QUERIES
-- =============================================================================

-- READ R1: Fetch all published upcoming events, ordered by start date.
-- Parameters: none
SELECT
    e."id",
    e."title",
    e."category",
    e."startDate",
    e."endDate",
    e."totalCapacity",
    e."availableCapacity"
FROM "Event" AS e
WHERE e."status" = 'PUBLISHED'
  AND e."startDate" >= CURRENT_TIMESTAMP
ORDER BY e."startDate" ASC;


-- READ R2: Fetch published event details along with optional venue information.
-- Parameters: $1 = event ID
SELECT
    e."id" AS "eventId",
    e."title",
    e."description",
    e."category",
    e."startDate",
    e."endDate",
    e."status",
    v."name" AS "venueName",
    v."address" AS "venueAddress",
    v."city",
    v."state",
    v."country"
FROM "Event" AS e
LEFT JOIN "Venue" AS v
    ON v."id" = e."venueId"
WHERE e."id" = $1
  AND e."status" = 'PUBLISHED';


-- READ R3: Fetch all ticket tiers for a particular event.
-- Parameters: $1 = event ID
SELECT
    t."id",
    t."name",
    t."price",
    t."totalQuantity",
    t."availableQuantity",
    t."description",
    t."perks"
FROM "TicketType" AS t
WHERE t."eventId" = $1
ORDER BY t."price" ASC;


-- READ R4: Fetch a user's booking history with event and ticket information.
-- Parameters: $1 = user ID
SELECT
    b."id" AS "bookingId",
    b."bookingReference",
    b."quantity",
    b."unitPrice",
    b."totalAmount",
    b."status" AS "bookingStatus",
    b."createdAt" AS "bookingDate",
    e."title" AS "eventTitle",
    e."startDate",
    e."endDate",
    tt."name" AS "ticketType"
FROM "Booking" AS b
INNER JOIN "Event" AS e
    ON e."id" = b."eventId"
INNER JOIN "TicketType" AS tt
    ON tt."id" = b."ticketTypeId"
WHERE b."userId" = $1
ORDER BY b."createdAt" DESC;


-- READ R5: Fetch a booking with its user, event, ticket tier, and optional payment.
-- Parameters: $1 = booking ID
SELECT
    b."id" AS "bookingId",
    b."bookingReference",
    b."quantity",
    b."unitPrice",
    b."totalAmount",
    b."status" AS "bookingStatus",
    u."name" AS "customerName",
    u."email" AS "customerEmail",
    e."title" AS "eventTitle",
    tt."name" AS "ticketType",
    p."transactionId",
    p."amount" AS "paymentAmount",
    p."currency",
    p."paymentMethod",
    p."status" AS "paymentStatus"
FROM "Booking" AS b
INNER JOIN "User" AS u
    ON u."id" = b."userId"
INNER JOIN "Event" AS e
    ON e."id" = b."eventId"
INNER JOIN "TicketType" AS tt
    ON tt."id" = b."ticketTypeId"
LEFT JOIN "Payment" AS p
    ON p."bookingId" = b."id"
WHERE b."id" = $1;


-- READ R6: Count bookings for each event, including events with zero bookings.
-- Parameters: none
SELECT
    e."id" AS "eventId",
    e."title",
    COUNT(b."id") AS "bookingCount"
FROM "Event" AS e
LEFT JOIN "Booking" AS b
    ON b."eventId" = e."id"
GROUP BY e."id", e."title"
ORDER BY "bookingCount" DESC, e."title" ASC;


-- READ R7: Calculate successful payment revenue for each event.
-- Parameters: none
-- Revenue is based on successful Payment records, not merely Booking totals.
SELECT
    e."id" AS "eventId",
    e."title",
    COALESCE(SUM(p."amount"), 0) AS "totalRevenue",
    COUNT(p."id") AS "successfulPaymentCount"
FROM "Event" AS e
LEFT JOIN "Booking" AS b
    ON b."eventId" = e."id"
LEFT JOIN "Payment" AS p
    ON p."bookingId" = b."id"
   AND p."status" = 'SUCCESS'
GROUP BY e."id", e."title"
ORDER BY "totalRevenue" DESC;


-- READ R8: Calculate average rating and review count for each event.
-- Parameters: none
SELECT
    e."id" AS "eventId",
    e."title",
    ROUND(AVG(r."rating")::NUMERIC, 2) AS "averageRating",
    COUNT(r."id") AS "reviewCount"
FROM "Event" AS e
LEFT JOIN "Review" AS r
    ON r."eventId" = e."id"
GROUP BY e."id", e."title"
ORDER BY "averageRating" DESC NULLS LAST, "reviewCount" DESC;


-- READ R9: Fetch attendees registered for a particular event.
-- Parameters: $1 = event ID
SELECT
    a."id" AS "attendeeId",
    a."attendeeName",
    a."attendeeEmail",
    a."phone",
    a."checkInStatus",
    a."checkInTime",
    b."bookingReference",
    tt."name" AS "ticketType"
FROM "Attendee" AS a
INNER JOIN "Booking" AS b
    ON b."id" = a."bookingId"
INNER JOIN "TicketType" AS tt
    ON tt."id" = a."ticketTypeId"
WHERE a."eventId" = $1
ORDER BY a."attendeeName" ASC;


-- READ R10: Find events with at least one available ticket.
-- Parameters: none
SELECT
    e."id",
    e."title",
    e."startDate",
    e."availableCapacity",
    tt."id" AS "ticketTypeId",
    tt."name" AS "ticketType",
    tt."price",
    tt."availableQuantity"
FROM "Event" AS e
INNER JOIN "TicketType" AS tt
    ON tt."eventId" = e."id"
WHERE e."status" = 'PUBLISHED'
  AND e."startDate" > CURRENT_TIMESTAMP
  AND e."availableCapacity" > 0
  AND tt."availableQuantity" > 0
ORDER BY e."startDate" ASC, tt."price" ASC;


-- READ R11: Find users who have not made any bookings (NOT EXISTS subquery).
-- Parameters: none
SELECT
    u."id",
    u."name",
    u."email"
FROM "User" AS u
WHERE NOT EXISTS (
    SELECT 1
    FROM "Booking" AS b
    WHERE b."userId" = u."id"
)
ORDER BY u."name" ASC;


-- READ R12: Find the most-booked events by total tickets reserved.
-- Parameters: $1 = maximum number of events to return
SELECT
    e."id" AS "eventId",
    e."title",
    COALESCE(SUM(
        CASE
            WHEN b."status" <> 'CANCELLED' THEN b."quantity"
            ELSE 0
        END
    ), 0) AS "ticketsReserved"
FROM "Event" AS e
LEFT JOIN "Booking" AS b
    ON b."eventId" = e."id"
GROUP BY e."id", e."title"
ORDER BY "ticketsReserved" DESC, e."title" ASC
LIMIT $1;


-- READ R13: Fetch events created by a particular organiser.
-- Parameters: $1 = organiser user ID
SELECT
    e."id",
    e."title",
    e."category",
    e."startDate",
    e."status",
    e."totalCapacity",
    e."availableCapacity"
FROM "Event" AS e
WHERE e."organizerId" = $1
ORDER BY e."createdAt" DESC;


-- READ R14: Count confirmed bookings and ticket quantities for a particular event.
-- Parameters: $1 = event ID
SELECT
    e."id" AS "eventId",
    e."title",
    COUNT(b."id") FILTER (WHERE b."status" = 'CONFIRMED') AS "confirmedBookingCount",
    COALESCE(
        SUM(b."quantity") FILTER (WHERE b."status" = 'CONFIRMED'),
        0
    ) AS "confirmedTicketCount"
FROM "Event" AS e
LEFT JOIN "Booking" AS b
    ON b."eventId" = e."id"
WHERE e."id" = $1
GROUP BY e."id", e."title";


-- =============================================================================
-- WRITE QUERIES
-- =============================================================================

-- WRITE W1: Insert a new venue.
-- Parameters:
--   $1 = id, $2 = name, $3 = address, $4 = city, $5 = state (nullable),
--   $6 = country, $7 = postal code (nullable), $8 = capacity,
--   $9 = amenities (nullable), $10 = image URL (nullable)
INSERT INTO "Venue" (
    "id", "name", "address", "city", "state", "country",
    "postalCode", "capacity", "amenities", "imageUrl",
    "createdAt", "updatedAt"
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
RETURNING *;


-- WRITE W2: Insert a new event for an existing organiser.
-- Parameters:
--   $1 = event ID, $2 = title, $3 = description, $4 = category,
--   $5 = banner URL (nullable), $6 = start date, $7 = end date,
--   $8 = venue ID (nullable), $9 = organiser user ID,
--   $10 = total capacity, $11 = available capacity
INSERT INTO "Event" (
    "id", "title", "description", "category", "bannerUrl",
    "startDate", "endDate", "venueId", "organizerId",
    "totalCapacity", "availableCapacity", "status",
    "createdAt", "updatedAt"
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
    'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
RETURNING *;


-- WRITE W3: Add a review for an event by a user.
-- The UNIQUE(eventId, userId) constraint prevents duplicate reviews.
-- Parameters: $1 = review ID, $2 = event ID, $3 = user ID,
--             $4 = rating, $5 = comment
INSERT INTO "Review" (
    "id", "eventId", "userId", "rating", "comment",
    "createdAt", "updatedAt"
)
VALUES (
    $1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
RETURNING *;


-- WRITE W4: Mark an attendee as checked in.
-- Parameters: $1 = attendee ID
UPDATE "Attendee"
SET
    "checkInStatus" = TRUE,
    "checkInTime" = CURRENT_TIMESTAMP,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = $1
  AND "checkInStatus" = FALSE
RETURNING *;


-- WRITE W5: Cancel a booking and restore event/ticket availability.
-- Parameters: $1 = booking ID
-- Execute as one statement. The data-modifying CTEs run as part of the same
-- statement, so the cancellation and inventory restoration are atomic.
-- Only a booking that was not already cancelled is processed.
WITH cancelled_booking AS (
    UPDATE "Booking"
    SET
        "status" = 'CANCELLED',
        "cancelledAt" = CURRENT_TIMESTAMP,
        "updatedAt" = CURRENT_TIMESTAMP
    WHERE "id" = $1
      AND "status" <> 'CANCELLED'
    RETURNING "eventId", "ticketTypeId", "quantity"
),
restored_event_capacity AS (
    UPDATE "Event" AS e
    SET
        "availableCapacity" = e."availableCapacity" + cb."quantity",
        "updatedAt" = CURRENT_TIMESTAMP
    FROM cancelled_booking AS cb
    WHERE e."id" = cb."eventId"
    RETURNING e."id"
),
restored_ticket_quantity AS (
    UPDATE "TicketType" AS tt
    SET
        "availableQuantity" = tt."availableQuantity" + cb."quantity",
        "updatedAt" = CURRENT_TIMESTAMP
    FROM cancelled_booking AS cb
    WHERE tt."id" = cb."ticketTypeId"
    RETURNING tt."id"
)
SELECT
    cb."eventId",
    cb."ticketTypeId",
    cb."quantity",
    (SELECT COUNT(*) FROM restored_event_capacity) AS "eventCapacityRowsUpdated",
    (SELECT COUNT(*) FROM restored_ticket_quantity) AS "ticketQuantityRowsUpdated"
FROM cancelled_booking AS cb;


-- =============================================================================
-- END OF CP3 QUERY FILE
-- =============================================================================
