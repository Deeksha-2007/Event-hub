-- =============================================================================
-- EventHub (EventNest) — PostgreSQL Schema
-- Derived from: prisma/schema.prisma
-- Database: PostgreSQL
-- ORM: Prisma
-- =============================================================================
-- This file documents the logical SQL DDL that Prisma generates from the schema.
-- It is provided for DBMS study and reference only.
-- Do NOT run this file directly against the database — use:
--   npx prisma migrate dev
-- =============================================================================


-- ---------------------------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------------------------

CREATE TYPE "Role" AS ENUM (
    'USER',
    'ORGANIZER',
    'ADMIN'
);

CREATE TYPE "EventStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'CANCELLED',
    'COMPLETED'
);

CREATE TYPE "BookingStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED'
);

CREATE TYPE "PaymentStatus" AS ENUM (
    'SUCCESS',
    'FAILED',
    'REFUNDED',
    'PENDING'
);

CREATE TYPE "PaymentMethod" AS ENUM (
    'CARD',
    'UPI',
    'NETBANKING',
    'WALLET'
);


-- ---------------------------------------------------------------------------
-- TABLE: User
-- Stores all platform users (attendees, organisers, admins).
-- ---------------------------------------------------------------------------

CREATE TABLE "User" (
    "id"           TEXT         NOT NULL,
    "name"         TEXT         NOT NULL,
    "email"        TEXT         NOT NULL,          -- candidate key
    "passwordHash" TEXT         NOT NULL,
    "role"         "Role"       NOT NULL DEFAULT 'USER',
    "phone"        TEXT,                           -- optional
    "avatar"       TEXT,                           -- optional URL
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Each email address must be unique across all users
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");


-- ---------------------------------------------------------------------------
-- TABLE: Venue
-- Physical locations where events take place.
-- ---------------------------------------------------------------------------

CREATE TABLE "Venue" (
    "id"         TEXT         NOT NULL,
    "name"       TEXT         NOT NULL,
    "address"    TEXT         NOT NULL,
    "city"       TEXT         NOT NULL,
    "state"      TEXT,                             -- optional
    "country"    TEXT         NOT NULL DEFAULT 'India',
    "postalCode" TEXT,                             -- optional
    "capacity"   INTEGER      NOT NULL,
    "amenities"  TEXT,                             -- comma-separated list (nullable)
    "imageUrl"   TEXT,                             -- optional
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);


-- ---------------------------------------------------------------------------
-- TABLE: Event
-- Events created by organisers, optionally held at a venue.
-- venueId is nullable — online events have no venue.
-- ---------------------------------------------------------------------------

CREATE TABLE "Event" (
    "id"                TEXT          NOT NULL,
    "title"             TEXT          NOT NULL,
    "description"       TEXT          NOT NULL,
    "category"          TEXT          NOT NULL DEFAULT 'Technology',   -- free-text (see §10.5 of normalization doc)
    "bannerUrl"         TEXT,                                          -- optional
    "startDate"         TIMESTAMP(3)  NOT NULL,
    "endDate"           TIMESTAMP(3)  NOT NULL,
    "venueId"           TEXT,                                          -- NULLABLE FK → Venue
    "organizerId"       TEXT          NOT NULL,                        -- FK → User
    "totalCapacity"     INTEGER       NOT NULL,
    "availableCapacity" INTEGER       NOT NULL,                        -- mutable counter, not a CHECK constraint
    "status"            "EventStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt"         TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3)  NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id"),

    -- Optional FK to Venue (nullable venueId)
    CONSTRAINT "Event_venueId_fkey"
        FOREIGN KEY ("venueId") REFERENCES "Venue"("id")
        ON DELETE SET NULL ON UPDATE CASCADE,

    -- Mandatory FK to the organising User
    CONSTRAINT "Event_organizerId_fkey"
        FOREIGN KEY ("organizerId") REFERENCES "User"("id")
        ON UPDATE CASCADE
    -- No ON DELETE — deleting a User who organises events is blocked at DB level
);


-- ---------------------------------------------------------------------------
-- TABLE: TicketType
-- Named ticket tiers belonging to one Event.
-- Cascade-deleted when the parent Event is deleted.
-- ---------------------------------------------------------------------------

CREATE TABLE "TicketType" (
    "id"                TEXT         NOT NULL,
    "eventId"           TEXT         NOT NULL,     -- FK → Event
    "name"              TEXT         NOT NULL,
    "price"             DOUBLE PRECISION NOT NULL,
    "totalQuantity"     INTEGER      NOT NULL,
    "availableQuantity" INTEGER      NOT NULL,     -- mutable counter
    "description"       TEXT,                      -- optional
    "perks"             TEXT,                      -- optional, comma-separated list
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketType_pkey" PRIMARY KEY ("id"),

    CONSTRAINT "TicketType_eventId_fkey"
        FOREIGN KEY ("eventId") REFERENCES "Event"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);


-- ---------------------------------------------------------------------------
-- TABLE: Booking
-- A confirmed ticket reservation made by a User.
-- Deletion of a parent Event or User is blocked (FK RESTRICT — no onDelete).
-- ---------------------------------------------------------------------------

CREATE TABLE "Booking" (
    "id"               TEXT            NOT NULL,
    "bookingReference" TEXT            NOT NULL,                        -- human-readable unique reference
    "userId"           TEXT            NOT NULL,                        -- FK → User
    "eventId"          TEXT            NOT NULL,                        -- FK → Event
    "ticketTypeId"     TEXT            NOT NULL,                        -- FK → TicketType
    "quantity"         INTEGER         NOT NULL DEFAULT 1,
    "unitPrice"        DOUBLE PRECISION NOT NULL,                       -- price snapshot at booking time
    "totalAmount"      DOUBLE PRECISION NOT NULL,                       -- stored derived: unitPrice × quantity
    "status"           "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "cancelledAt"      TIMESTAMP(3),                                    -- NULL until cancelled
    "createdAt"        TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3)    NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id"),

    -- Each booking reference is unique (e.g., EN-123456-ABC)
    CONSTRAINT "Booking_bookingReference_key" UNIQUE ("bookingReference"),

    -- FK to User — no ON DELETE (blocks User deletion if bookings exist)
    CONSTRAINT "Booking_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON UPDATE CASCADE,

    -- FK to Event — no ON DELETE (blocks Event deletion if bookings exist)
    CONSTRAINT "Booking_eventId_fkey"
        FOREIGN KEY ("eventId") REFERENCES "Event"("id")
        ON UPDATE CASCADE,

    -- FK to TicketType — no ON DELETE
    CONSTRAINT "Booking_ticketTypeId_fkey"
        FOREIGN KEY ("ticketTypeId") REFERENCES "TicketType"("id")
        ON UPDATE CASCADE
);


-- ---------------------------------------------------------------------------
-- TABLE: Attendee
-- One row per individual ticket seat under a Booking.
-- userId is nullable — guest seats (non-primary) have no linked User account.
-- ---------------------------------------------------------------------------

CREATE TABLE "Attendee" (
    "id"            TEXT         NOT NULL,
    "bookingId"     TEXT         NOT NULL,         -- FK → Booking (cascade)
    "eventId"       TEXT         NOT NULL,         -- FK → Event   (cascade) [denormalised]
    "userId"        TEXT,                          -- FK → User    (nullable — guest attendees)
    "ticketTypeId"  TEXT         NOT NULL,         -- FK → TicketType [denormalised]
    "attendeeName"  TEXT         NOT NULL,         -- snapshot at booking time
    "attendeeEmail" TEXT         NOT NULL,         -- snapshot at booking time
    "phone"         TEXT,                          -- optional
    "checkInStatus" BOOLEAN      NOT NULL DEFAULT FALSE,
    "checkInTime"   TIMESTAMP(3),                  -- NULL until checked in
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id"),

    -- Cascade: deleting a Booking removes all its Attendee rows
    CONSTRAINT "Attendee_bookingId_fkey"
        FOREIGN KEY ("bookingId") REFERENCES "Booking"("id")
        ON DELETE CASCADE ON UPDATE CASCADE,

    -- Cascade: deleting an Event removes all its Attendee rows
    CONSTRAINT "Attendee_eventId_fkey"
        FOREIGN KEY ("eventId") REFERENCES "Event"("id")
        ON DELETE CASCADE ON UPDATE CASCADE,

    -- No cascade on TicketType: deleting a TicketType is blocked if Attendees reference it
    CONSTRAINT "Attendee_ticketTypeId_fkey"
        FOREIGN KEY ("ticketTypeId") REFERENCES "TicketType"("id")
        ON UPDATE CASCADE,

    -- Nullable FK to User (no cascade — guest attendees have no User row)
    CONSTRAINT "Attendee_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON UPDATE CASCADE
);


-- ---------------------------------------------------------------------------
-- TABLE: Payment
-- One-to-one financial record linked to a Booking.
-- Cascade-deleted when the parent Booking is deleted.
-- ---------------------------------------------------------------------------

CREATE TABLE "Payment" (
    "id"             TEXT            NOT NULL,
    "bookingId"      TEXT            NOT NULL,     -- FK → Booking (1-to-1, UNIQUE)
    "transactionId"  TEXT            NOT NULL,     -- external payment gateway reference
    "amount"         DOUBLE PRECISION NOT NULL,
    "currency"       TEXT            NOT NULL DEFAULT 'INR',
    "paymentMethod"  "PaymentMethod" NOT NULL DEFAULT 'UPI',
    "status"         "PaymentStatus" NOT NULL DEFAULT 'SUCCESS',
    "paymentDetails" TEXT,                         -- optional JSON blob / notes
    "failureReason"  TEXT,                         -- NULL unless status = FAILED
    "createdAt"      TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3)    NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id"),

    -- Enforces 1-to-1 relationship with Booking
    CONSTRAINT "Payment_bookingId_key" UNIQUE ("bookingId"),

    -- Each external transaction ID must be unique
    CONSTRAINT "Payment_transactionId_key" UNIQUE ("transactionId"),

    -- Cascade: deleting a Booking removes its Payment
    CONSTRAINT "Payment_bookingId_fkey"
        FOREIGN KEY ("bookingId") REFERENCES "Booking"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);


-- ---------------------------------------------------------------------------
-- TABLE: Review
-- One review per User per Event.
-- Cascade-deleted when the parent Event or User is deleted.
-- ---------------------------------------------------------------------------

CREATE TABLE "Review" (
    "id"        TEXT         NOT NULL,
    "eventId"   TEXT         NOT NULL,             -- FK → Event
    "userId"    TEXT         NOT NULL,             -- FK → User
    "rating"    INTEGER      NOT NULL,             -- intended 1–5; no CHECK constraint in Prisma schema
    "comment"   TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id"),

    -- Composite unique: one review per user per event
    CONSTRAINT "Review_eventId_userId_key" UNIQUE ("eventId", "userId"),

    -- Cascade: deleting an Event removes all its Reviews
    CONSTRAINT "Review_eventId_fkey"
        FOREIGN KEY ("eventId") REFERENCES "Event"("id")
        ON DELETE CASCADE ON UPDATE CASCADE,

    -- Cascade: deleting a User removes all their Reviews
    CONSTRAINT "Review_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);


-- =============================================================================
-- RECOMMENDED CONSTRAINTS (not in current Prisma schema; require raw migration)
-- =============================================================================

-- Enforce 1–5 star rating range
-- ALTER TABLE "Review"
--     ADD CONSTRAINT "Review_rating_check" CHECK ("rating" BETWEEN 1 AND 5);

-- Prevent availableCapacity from going negative or exceeding totalCapacity
-- ALTER TABLE "Event"
--     ADD CONSTRAINT "Event_capacity_check"
--     CHECK ("availableCapacity" BETWEEN 0 AND "totalCapacity");

-- Prevent availableQuantity from going negative or exceeding totalQuantity
-- ALTER TABLE "TicketType"
--     ADD CONSTRAINT "TicketType_quantity_check"
--     CHECK ("availableQuantity" BETWEEN 0 AND "totalQuantity");

-- Enforce the totalAmount invariant at the database level
-- ALTER TABLE "Booking"
--     ADD CONSTRAINT "Booking_totalAmount_check"
--     CHECK ("totalAmount" = "unitPrice" * "quantity");


-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
