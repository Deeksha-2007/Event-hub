# ER Diagram — EventHub (EventNest)

This diagram represents the final, normalised Entity-Relationship model that the production
Prisma schema implements. It is derived directly from
[`prisma/schema.prisma`](../prisma/schema.prisma).

---

## Entity-Relationship Diagram

```mermaid
erDiagram

    User {
        String  id           PK
        String  name
        String  email        UK
        String  passwordHash
        Role    role
        String  phone
        String  avatar
        DateTime createdAt
        DateTime updatedAt
    }

    Venue {
        String  id         PK
        String  name
        String  address
        String  city
        String  state
        String  country
        String  postalCode
        Int     capacity
        String  amenities
        String  imageUrl
        DateTime createdAt
        DateTime updatedAt
    }

    Event {
        String      id                PK
        String      title
        String      description
        String      category
        String      bannerUrl
        DateTime    startDate
        DateTime    endDate
        String      venueId           FK
        String      organizerId       FK
        Int         totalCapacity
        Int         availableCapacity
        EventStatus status
        DateTime    createdAt
        DateTime    updatedAt
    }

    TicketType {
        String   id                PK
        String   eventId           FK
        String   name
        Float    price
        Int      totalQuantity
        Int      availableQuantity
        String   description
        String   perks
        DateTime createdAt
        DateTime updatedAt
    }

    Booking {
        String        id               PK
        String        bookingReference UK
        String        userId           FK
        String        eventId          FK
        String        ticketTypeId     FK
        Int           quantity
        Float         unitPrice
        Float         totalAmount
        BookingStatus status
        DateTime      cancelledAt
        DateTime      createdAt
        DateTime      updatedAt
    }

    Attendee {
        String   id            PK
        String   bookingId     FK
        String   eventId       FK
        String   userId        FK
        String   ticketTypeId  FK
        String   attendeeName
        String   attendeeEmail
        String   phone
        Boolean  checkInStatus
        DateTime checkInTime
        DateTime createdAt
        DateTime updatedAt
    }

    Payment {
        String        id             PK
        String        bookingId      FK_UK
        String        transactionId  UK
        Float         amount
        String        currency
        PaymentMethod paymentMethod
        PaymentStatus status
        String        paymentDetails
        String        failureReason
        DateTime      createdAt
        DateTime      updatedAt
    }

    Review {
        String   id        PK
        String   eventId   FK
        String   userId    FK
        Int      rating
        String   comment
        DateTime createdAt
        DateTime updatedAt
    }

    %% ─── Relationships ───────────────────────────────────────────────

    %% A User can organise zero or many Events (organizer role)
    User ||--o{ Event        : "organises"

    %% A Venue hosts zero or many Events (venueId is nullable)
    Venue |o--o{ Event       : "hosts"

    %% An Event has one or many TicketTypes
    Event ||--o{ TicketType  : "has ticket tiers"

    %% A User makes zero or many Bookings
    User ||--o{ Booking      : "makes"

    %% An Event has zero or many Bookings
    Event ||--o{ Booking     : "receives"

    %% A TicketType is chosen for zero or many Bookings
    TicketType ||--o{ Booking : "is booked as"

    %% A Booking has exactly one Payment (1-to-1)
    Booking ||--o| Payment   : "is paid via"

    %% A Booking covers one or many Attendees (one per ticket seat)
    Booking ||--o{ Attendee  : "covers"

    %% An Event has zero or many Attendees (denormalised FK for direct lookup)
    Event ||--o{ Attendee    : "is attended by"

    %% A TicketType is associated with zero or many Attendees (denormalised FK)
    TicketType ||--o{ Attendee : "is used by"

    %% A User may optionally be linked to an Attendee seat (nullable)
    User |o--o{ Attendee     : "is recorded as"

    %% A User leaves zero or many Reviews; one review per event per user
    User ||--o{ Review       : "writes"

    %% An Event has zero or many Reviews
    Event ||--o{ Review      : "receives"
```

---

## Relationship Summary

| Relationship | Cardinality | Notes |
|---|---|---|
| `User` → `Event` | 1 : N | Via `Event.organizerId`. One organiser can run many events. |
| `Venue` → `Event` | 0..1 : N | `Event.venueId` is nullable — events may have no physical venue. |
| `Event` → `TicketType` | 1 : N | An event must have at least one ticket tier. `onDelete: Cascade` — deleting an event removes all its ticket types. |
| `User` → `Booking` | 1 : N | A user can hold many bookings across different events. |
| `Event` → `Booking` | 1 : N | An event accumulates many bookings. No `onDelete` — event deletion is blocked if bookings exist. |
| `TicketType` → `Booking` | 1 : N | Each booking selects exactly one ticket tier. |
| `Booking` → `Payment` | 1 : 0..1 | One-to-one enforced by `Payment.bookingId UNIQUE`. `onDelete: Cascade` — deleting a booking removes its payment. |
| `Booking` → `Attendee` | 1 : N | One attendee row per ticket seat in the booking. `onDelete: Cascade`. |
| `Event` → `Attendee` | 1 : N | Denormalised FK for direct event-attendee queries. `onDelete: Cascade`. |
| `TicketType` → `Attendee` | 1 : N | Denormalised FK for filtering attendees by ticket tier. No `onDelete` specified. |
| `User` → `Attendee` | 0..1 : N | Nullable — only the primary buyer (first seat) is linked to a User; guest seats have `userId = NULL`. |
| `User` → `Review` | 1 : N | One user may review many events. `onDelete: Cascade`. |
| `Event` → `Review` | 1 : N | Composite unique `(eventId, userId)` — one review per user per event. `onDelete: Cascade`. |

---

## Key Constraints Visualised

| Constraint | Type | Models |
|---|---|---|
| `User.email` | `UNIQUE` | User |
| `Booking.bookingReference` | `UNIQUE` | Booking |
| `Payment.bookingId` | `UNIQUE` (enforces 1-to-1 with Booking) | Payment |
| `Payment.transactionId` | `UNIQUE` | Payment |
| `Review.(eventId, userId)` | Composite `UNIQUE` | Review |
| `Attendee.bookingId`, `Attendee.eventId`, `Payment.bookingId`, `TicketType.eventId`, `Review.eventId`, `Review.userId` | `ON DELETE CASCADE` | Attendee, Payment, TicketType, Review |
| `Booking.eventId`, `Booking.userId`, `Booking.ticketTypeId` | FK RESTRICT (no `onDelete` = PostgreSQL default) | Booking |

---

## Enum Types

```
Role            : USER | ORGANIZER | ADMIN
EventStatus     : DRAFT | PUBLISHED | CANCELLED | COMPLETED
BookingStatus   : PENDING | CONFIRMED | CANCELLED
PaymentStatus   : SUCCESS | FAILED | REFUNDED | PENDING
PaymentMethod   : CARD | UPI | NETBANKING | WALLET
```

> [!NOTE]
> The `Attendee.eventId` and `Attendee.ticketTypeId` foreign keys are denormalised copies of
> `Booking.eventId` and `Booking.ticketTypeId`. They are drawn here as direct relationships for
> clarity, but they are logically redundant — the same information is reachable via the
> `Booking` entity. See [`01_normalization.md`](01_normalization.md) §8 for the full explanation.
