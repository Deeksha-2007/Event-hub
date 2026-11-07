# Database Normalization — EventHub (EventNest)

This document traces the normalization of the **EventHub** (internally called *EventNest*) database
from a conceptual flat register through to the Boyce–Codd Normal Form (BCNF) that the production
Prisma schema implements. Every table, column, constraint and functional dependency cited below is
drawn directly from [`prisma/schema.prisma`](../prisma/schema.prisma) and
[`prisma/seed.js`](../prisma/seed.js).

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Requirements and Entities](#2-system-requirements-and-entities)
3. [Unnormalized Form (UNF)](#3-unnormalized-form-unf)
4. [First Normal Form (1NF)](#4-first-normal-form-1nf)
5. [Second Normal Form (2NF)](#5-second-normal-form-2nf)
6. [Third Normal Form (3NF)](#6-third-normal-form-3nf)
7. [Boyce–Codd Normal Form (BCNF)](#7-boycecodd-normal-form-bcnf)
8. [Deliberate Denormalization](#8-deliberate-denormalization)
9. [Database Constraints and Integrity Rules](#9-database-constraints-and-integrity-rules)
10. [Design Issues and Honest Notes](#10-design-issues-and-honest-notes)
11. [Conclusion](#11-conclusion)

---

## 1. Introduction

EventHub is a full-stack event-and-ticket management platform. Users can browse events, book
tickets, and leave reviews. Organisers create and manage events with multiple ticket tiers. Admins
oversee the platform. The database is built on **PostgreSQL** via **Prisma ORM**.

The goal of normalization is to eliminate redundancy and anomalies — insert, update, and delete
anomalies — while preserving every fact that the system must store. This document shows each step
of that process.

---

## 2. System Requirements and Entities

The following are the core entities inferred from the Prisma schema and the application logic.

| Entity | Purpose |
|---|---|
| **User** | Stores all platform users: regular users (`USER`), event organisers (`ORGANIZER`), and admins (`ADMIN`). |
| **Venue** | Physical locations where events take place. |
| **Event** | An event created by an organiser, held at a venue, with capacity tracking. |
| **TicketType** | A named tier of ticket for one event (e.g., "Early Bird", "VIP"). Tracks quantities. |
| **Booking** | A confirmed reservation by a user for a specific ticket type and quantity. |
| **Attendee** | One actual person attending under a booking. Multiple attendees per booking (one per ticket). |
| **Payment** | Financial record linked one-to-one with a booking. |
| **Review** | A rating and comment left by a user for an event they attended. |

**Enumerations defined in the schema:**

| Enum | Values |
|---|---|
| `Role` | `USER`, `ORGANIZER`, `ADMIN` |
| `EventStatus` | `DRAFT`, `PUBLISHED`, `CANCELLED`, `COMPLETED` |
| `BookingStatus` | `PENDING`, `CONFIRMED`, `CANCELLED` |
| `PaymentStatus` | `SUCCESS`, `FAILED`, `REFUNDED`, `PENDING` |
| `PaymentMethod` | `CARD`, `UPI`, `NETBANKING`, `WALLET` |

---

## 3. Unnormalized Form (UNF): The Flat Register

Before any normalization, imagine the system stored everything in one flat "booking register" sheet.
A single row might look like this:

| booking_ref | user_name | user_email | user_password | user_role | user_phone | venue_name | venue_address | venue_city | event_title | event_category | event_start | event_end | event_capacity | ticket_name | ticket_price | quantity | total_amount | booking_status | attendees | payment_method | review_rating | review_comment |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| EN-123-ABC | Aarav Mehta | user@eventnest.com | hashed_pw | USER | +91 98111 … | Bangalore Intl Centre | 7, 4th Main Rd | Bengaluru | Global AI Summit 2026 | Technology | 2026-11-15 | 2026-11-16 | 600 | Regular Delegate | 999 | 2 | 1998 | CONFIRMED | "Aarav Mehta; Neha Kapoor" | UPI | 5 | Great event! |

**Problems in this flat form:**

- `attendees` holds **multiple names in one cell** — a repeating group.
- User details (`user_name`, `user_email`, `user_password`, `user_role`) are **repeated** on every
  booking row for the same user (update anomaly: changing a name requires editing many rows).
- Venue and event details are repeated on every booking row they appear in.
- A **user with no bookings cannot be stored** without empty booking, event, and venue columns
  (insert anomaly).
- Deleting a user's last booking **loses the user record** (delete anomaly).
- A venue with no current events cannot be stored (insert anomaly).
- `review_rating` and `review_comment` are `NULL` on most rows, polluting the register.

---

## 4. First Normal Form (1NF)

**Rule:** every cell holds exactly one atomic value; there are no repeating groups.

**Changes made:**

1. `attendees` (a list of names in one cell) is extracted into a separate table where each row
   holds one attendee.
2. The booking register is split into separate tables to give each entity its own rows.
3. Every column now holds a single, atomic value.

**Resulting flat tables (1NF):**

**Register_1NF**(<u>booking_id</u>, booking_reference, user_id, user_name, user_email,
user_password_hash, user_role, user_phone, venue_id, venue_name, venue_address, venue_city,
venue_state, venue_country, venue_postal_code, venue_capacity, venue_amenities, event_id,
event_title, event_category, event_start_date, event_end_date, event_total_capacity,
event_available_capacity, event_status, ticket_type_id, ticket_name, ticket_price,
ticket_total_qty, ticket_available_qty, quantity, unit_price, total_amount, booking_status,
cancelled_at, payment_method, payment_status, payment_amount, review_rating, review_comment)

**Attendee_1NF**(<u>attendee_id</u>, booking_id, attendee_name, attendee_email, phone,
check_in_status, check_in_time)

All cells are now atomic; no cell contains a list or a nested structure.

---

## 5. Second Normal Form (2NF)

**Rule:** 1NF, **and** every non-key attribute depends on the **whole** primary key — no partial
dependency on a composite key.

`Register_1NF` has a single-column primary key (`booking_id`), so it is **automatically** free
from partial dependencies. However, it contains many transitive dependencies (addressed in §6
below), and mixing entities that have no logical reason to be in the same table is still a problem
at this stage.

`Attendee_1NF` also has a single-column primary key (`attendee_id`), so it too is in 2NF.

The key normalization work for this schema is in removing **transitive** dependencies, which is
the concern of 3NF.

> [!NOTE]
> A schema with only single-column primary keys trivially satisfies 2NF. The EventHub entities all
> have surrogate `String @id` primary keys, so the 2NF step here is about confirming that
> condition and preparing for 3NF decomposition.

---

## 6. Third Normal Form (3NF)

**Rule:** 2NF, **and** no non-key attribute depends on another non-key attribute (no transitive
dependency: key → non-key A → non-key B).

### 6.1 Transitive Dependencies in `Register_1NF`

| Functional Dependency | Type | Problem |
|---|---|---|
| `booking_id → user_id` | Direct ✔ | — |
| `user_id → user_name, user_email, user_password_hash, user_role, user_phone` | **Transitive** | booking_id → user_id → user attributes |
| `booking_id → venue_id` | **Transitive** (via event_id) | booking_id → event_id → venue_id |
| `venue_id → venue_name, venue_address, venue_city, venue_state, venue_country, venue_postal_code, venue_capacity, venue_amenities` | **Transitive** | booking_id → venue_id → venue attributes |
| `booking_id → event_id` | Direct ✔ | — |
| `event_id → event_title, event_category, event_start_date, event_end_date, event_total_capacity, event_available_capacity, event_status, event_organizer_id, venue_id` | **Transitive** | booking_id → event_id → event attributes |
| `booking_id → ticket_type_id` | Direct ✔ | — |
| `ticket_type_id → ticket_name, ticket_price, ticket_total_qty, ticket_available_qty` | **Transitive** | booking_id → ticket_type_id → ticket attributes |
| `booking_id → quantity, unit_price, total_amount, booking_status, cancelled_at` | Direct ✔ | — |

### 6.2 Decomposition into 3NF Tables

Each transitive group is extracted into its own table. This produces exactly the tables in the
Prisma schema:

#### `users` (model `User`)

```
User (id PK, name, email UNIQUE, passwordHash, role, phone?, avatar?, createdAt, updatedAt)
```

Removes: `user_name`, `user_email`, `user_password_hash`, `user_role`, `user_phone` from every
other table. FD: `id → all other attributes`. No transitive dependency remains.

#### `venues` (model `Venue`)

```
Venue (id PK, name, address, city, state?, country, postalCode?, capacity, amenities?, imageUrl?, createdAt, updatedAt)
```

Removes: all venue attributes from the booking register. FD: `id → all other attributes`.

#### `events` (model `Event`)

```
Event (id PK, title, description, category, bannerUrl?, startDate, endDate, venueId? FK→Venue, organizerId FK→User,
       totalCapacity, availableCapacity, status, createdAt, updatedAt)
```

FD: `id → all other attributes`. `venueId` is a nullable foreign key (`String?` in the schema) —
an event may be created without a venue (e.g., a fully online event). When a venue is linked,
venue details are accessed via JOIN.

#### `ticket_types` (model `TicketType`)

```
TicketType (id PK, eventId FK→Event, name, price, totalQuantity, availableQuantity,
            description?, perks?, createdAt, updatedAt)
```

FD: `id → all other attributes`. Each ticket tier belongs to exactly one event (`eventId`).

#### `bookings` (model `Booking`)

```
Booking (id PK, bookingReference UNIQUE, userId FK→User, eventId FK→Event,
         ticketTypeId FK→TicketType, quantity, unitPrice, totalAmount, status,
         cancelledAt?, createdAt, updatedAt)
```

After decomposition, `Booking` retains only columns that **directly** describe the booking
transaction. All user, event, venue and ticket details are accessed via foreign keys.

#### `attendees` (model `Attendee`)

```
Attendee (id PK, bookingId FK→Booking, eventId FK→Event, userId? FK→User,
          ticketTypeId FK→TicketType, attendeeName, attendeeEmail, phone?,
          checkInStatus, checkInTime?, createdAt, updatedAt)
```

One row per ticket seat. FD: `id → all other attributes`.

#### `payments` (model `Payment`)

```
Payment (id PK, bookingId UNIQUE FK→Booking, transactionId UNIQUE, amount, currency,
         paymentMethod, status, paymentDetails?, failureReason?, createdAt, updatedAt)
```

FD: `id → all other attributes`. The 1-to-1 relationship with Booking is enforced by
`bookingId UNIQUE`.

#### `reviews` (model `Review`)

```
Review (id PK, eventId FK→Event, userId FK→User, rating, comment, createdAt, updatedAt)
       UNIQUE(eventId, userId)
```

FD: `id → all other attributes`. The composite unique constraint ensures one review per
user per event.

---

## 7. Boyce–Codd Normal Form (BCNF)

**Rule:** for every non-trivial functional dependency X → Y, X must be a **candidate key** of the
table.

A relation in BCNF has no functional dependency where the determinant is not a superkey. BCNF is
stricter than 3NF only when a table has overlapping composite candidate keys. Because every table
in this schema uses a **surrogate single-column primary key** (`String @id`) and additional
candidate keys are either single-column or enforced as UNIQUE constraints, BCNF analysis is
straightforward.

| Table (Prisma model) | Primary Key | Additional Candidate Keys | Non-Trivial FDs | BCNF? |
|---|---|---|---|---|
| `users` (`User`) | `id` | `email` (UNIQUE) | `id → *`; `email → *` | ✔ Both determinants are keys |
| `venues` (`Venue`) | `id` | — | `id → *` | ✔ |
| `events` (`Event`) | `id` | — | `id → *` | ✔ |
| `ticket_types` (`TicketType`) | `id` | — | `id → *` | ✔ |
| `bookings` (`Booking`) | `id` | `bookingReference` (UNIQUE) | `id → *`; `bookingReference → *` | ✔ Both determinants are keys |
| `attendees` (`Attendee`) | `id` | — | `id → *` | ✔ |
| `payments` (`Payment`) | `id` | `bookingId` (UNIQUE), `transactionId` (UNIQUE) | `id → *`; `bookingId → *`; `transactionId → *` | ✔ All three determinants are keys |
| `reviews` (`Review`) | `id` | `(eventId, userId)` (UNIQUE) | `id → *`; `(eventId, userId) → *` | ✔ Both determinants are keys |

### 7.1 Why `users` Is Interesting

`users` has two candidate keys: `id` and `email`. Both fully determine every other attribute. This
means any FD of the form `email → name` is not a violation — `email` is itself a candidate key.
BCNF is satisfied.

### 7.2 Why `reviews` Is Interesting

`reviews` has a composite candidate key `(eventId, userId)`. Both `id` and `(eventId, userId)`
determine the same row. Neither determinant is a subset of the other. Because every non-trivial FD
has a determinant that is a candidate key, BCNF is satisfied.

### 7.3 Why `payments` Is Interesting

`payments` has three candidate keys: `id`, `bookingId`, and `transactionId`. Each uniquely
identifies a payment row, and each is marked `UNIQUE` (or is the primary key) in the schema. All
FDs therefore have a determinant that is a candidate key. BCNF is satisfied.

---

## 8. Deliberate Denormalization

A handful of columns are **copied on purpose** and break strict 3NF. They are acceptable trade-offs
because the data is immutable after creation or because they eliminate expensive JOINs on
frequently read paths.

| Column | Table | Copied From | Justification |
|---|---|---|---|
| `unitPrice` | `Booking` | `TicketType.price` | The ticket price at booking time is a **snapshot**. If a ticket's price changes later, historical bookings must still show what the user paid. `TicketType.price` can change; `Booking.unitPrice` must not. Note: some authorities would argue that `unitPrice` is not denormalization at all — it is a legitimate independent fact about the transaction (the price agreed at the moment of sale), since `TicketType.price` and `Booking.unitPrice` measure different things — current price vs. price at time of booking. |
| `totalAmount` | `Booking` | Derived: `unitPrice × quantity` | A **stored derived value**. It can always be recomputed as `unitPrice * quantity`, but storing it avoids a calculation on every read and provides an exact record of what was charged (useful if pricing logic changes). |
| `attendeeName`, `attendeeEmail`, `phone` | `Attendee` | `User.name`, `User.email`, `User.phone` | At booking time, the attendee's details are captured as a snapshot. Guest attendees (`userId IS NULL`) have no User row at all, so these columns are **structurally required**, not just for convenience. |
| `eventId` | `Attendee` | `Booking.eventId` | Denormalized for **direct query convenience** — quickly listing all attendees at an event without joining through Booking. It is redundant since `Booking.eventId` already carries this. |
| `ticketTypeId` | `Attendee` | `Booking.ticketTypeId` | Same rationale as `eventId` above — it is redundant but convenient for filtering attendees by ticket tier without a Booking join. |

> [!WARNING]
> `Attendee.eventId` and `Attendee.ticketTypeId` create **redundant foreign keys** relative to
> `Booking`. If a booking's `eventId` or `ticketTypeId` were ever updated (which the application
> does not currently do), the attendee copies could become inconsistent. This is the main design
> risk of this denormalization choice.

---

## 9. Database Constraints and Integrity Rules

The table below separates rules enforced at the **database level** (by Prisma's generated DDL and
PostgreSQL) from rules enforced only at the **application level**.

### 9.1 Database-Level Constraints (actual schema)

| Rule | Mechanism | Table / Column |
|---|---|---|
| Each user has a unique email address | `@unique` → `UNIQUE` index | `User.email` |
| Each booking has a unique human-readable reference | `@unique` → `UNIQUE` index | `Booking.bookingReference` |
| Each payment is linked to exactly one booking | `@unique` on `Payment.bookingId` | `Payment.bookingId` |
| Each payment has a unique external transaction ID | `@unique` → `UNIQUE` index | `Payment.transactionId` |
| One review per user per event | `@@unique([eventId, userId])` → composite `UNIQUE` index | `Review` |
| Referential integrity: bookings reference real users, events, ticket types | `REFERENCES` (foreign keys) | `Booking.userId`, `Booking.eventId`, `Booking.ticketTypeId` |
| Referential integrity: attendees reference real bookings, events, ticket types | `REFERENCES` (foreign keys) | `Attendee.bookingId`, `Attendee.eventId`, `Attendee.ticketTypeId` |
| Referential integrity: events reference real venues and organisers | `REFERENCES` (foreign keys) | `Event.venueId`, `Event.organizerId` |
| Referential integrity: ticket types belong to real events | `REFERENCES` with `onDelete: Cascade` | `TicketType.eventId` |
| Cascading delete: deleting a booking removes its attendees and payment | `onDelete: Cascade` | `Attendee.bookingId`, `Payment.bookingId` |
| Cascading delete: deleting an event removes its ticket types, attendees, and reviews — **but NOT its bookings** (`Booking.eventId` has no `onDelete`; deletion is blocked at DB level if bookings exist) | `onDelete: Cascade` | `TicketType.eventId`, `Attendee.eventId`, `Review.eventId` |
| Cascading delete: deleting a user removes their reviews | `onDelete: Cascade` | `Review.userId` |
| Deleting an Event is **blocked** at DB level if any Booking references it (no `onDelete` on `Booking.eventId`) | FK RESTRICT (PostgreSQL default when no `onDelete` is set) | `Booking.eventId` |
| Deleting a User is **blocked** at DB level if any Booking references them (no `onDelete` on `Booking.userId`) | FK RESTRICT (PostgreSQL default when no `onDelete` is set) | `Booking.userId` |
| Default booking quantity is 1 | `@default(1)` | `Booking.quantity` |
| Default booking status is `CONFIRMED` | `@default(CONFIRMED)` | `Booking.status` |
| Default payment currency is `INR` | `@default("INR")` | `Payment.currency` |
| Default payment method is `UPI` | `@default(UPI)` | `Payment.paymentMethod` |
| Default payment status is `SUCCESS` | `@default(SUCCESS)` | `Payment.status` |
| Default event status is `PUBLISHED` | `@default(PUBLISHED)` | `Event.status` |
| Default user role is `USER` | `@default(USER)` | `User.role` |
| Default event category is `Technology` | `@default("Technology")` | `Event.category` |
| Default venue country is `India` | `@default("India")` | `Venue.country` |
| Default attendee check-in status is `false` | `@default(false)` | `Attendee.checkInStatus` |
| Timestamps are auto-set on creation | `@default(now())` | `createdAt` on all models |
| `role` values constrained to `USER`, `ORGANIZER`, `ADMIN` | PostgreSQL enum type (generated by Prisma from `enum Role {}`) | `User.role` |

### 9.2 Application-Level Validations (not enforced by the database)

These rules exist in the backend controllers (`booking.controller.js`, `event.controller.js`) but
are **not** expressed as database constraints. A direct database write bypassing the API would not
be caught.

| Rule | Where enforced | Location in code |
|---|---|---|
| Quantity must be a positive integer | Application | `booking.controller.js` — `createBooking` |
| Ticket type must belong to the booked event | Application | `booking.controller.js` — `ticketType.eventId !== eventId` check |
| Cannot book a cancelled or completed event | Application | `booking.controller.js` — event status check |
| Available ticket quantity must be ≥ requested quantity | Application (with optimistic concurrency) | `booking.controller.js` — `updateMany` with `gte` guard |
| Event available capacity must be ≥ requested quantity | Application (with optimistic concurrency) | `booking.controller.js` — `updateMany` with `gte` guard |
| Event capacity cannot exceed venue capacity | Application | `event.controller.js` — `createEvent` / `updateEvent` |
| Ticket price must be a positive number | Application (implicit) | `event.controller.js` — `parseFloat(t.price)` |
| End date must not be before start date | Application | `event.controller.js` — date comparison |
| `totalAmount = unitPrice × quantity` invariant | Application | `booking.controller.js` — computed before insert |
| `availableCapacity` decrements/increments on booking/cancellation | Application | `booking.controller.js` — `updateMany` |
| `availableQuantity` decrements/increments on booking/cancellation | Application | `booking.controller.js` — `updateMany` |
| Only organisers or admins can create/update/delete events | Application (auth middleware) | `event.routes.js` / middleware |
| Only the booking owner or an admin can cancel a booking | Application | `booking.controller.js` — ownership check |
| Cannot delete an event that has existing bookings | Application | `event.controller.js` — `bookingCount` guard before deletion |
| Rating should be between 1 and 5 | **Recommendation only** — no DB CHECK or application guard found | (Not currently enforced) |
| Email format validation | **Not implemented** — `auth.controller.js` is a TODO stub; no registration logic exists | (Recommendation only) |

---

## 10. Design Issues and Honest Notes

The following points are design observations worth flagging honestly — they are not bugs, but they
are trade-offs or areas for future hardening.

### 10.1 Redundant Foreign Keys on `Attendee`

```prisma
model Attendee {
  bookingId    String   // FK → Booking
  eventId      String   // FK → Event    ← also in Booking.eventId
  ticketTypeId String   // FK → TicketType ← also in Booking.ticketTypeId
  ...
}
```

`Attendee.eventId` and `Attendee.ticketTypeId` duplicate information already reachable through
`Attendee → Booking → eventId / ticketTypeId`. If a booking's event or ticket type were ever
changed (even though the application does not allow this today), the attendee copies would
silently diverge. The trade-off is faster direct queries against the `Attendee` table.

### 10.2 Nullable `userId` on `Attendee`

```prisma
model Attendee {
  userId String?   // nullable — guest attendees have no User account
  ...
}
```

`userId` is nullable to support group bookings where only the first attendee (the buyer) has a
User account. The remaining seats use `userId = NULL`. This is intentional and consistent with the
booking logic in `booking.controller.js`, but it means referential integrity for
guest attendees rests entirely on the application layer, not on a foreign key.

### 10.3 Stored Derived Value: `totalAmount`

```prisma
model Booking {
  unitPrice   Float
  quantity    Int
  totalAmount Float   // = unitPrice × quantity
  ...
}
```

`totalAmount` is always equal to `unitPrice × quantity` and can be recomputed at any time. It is
stored for read convenience and as a snapshot. No database constraint enforces the
`totalAmount = unitPrice * quantity` invariant — it is computed once in the application before
the `INSERT`.

### 10.4 `availableCapacity` and `availableQuantity` as Mutable Counters

```prisma
model Event {
  totalCapacity     Int
  availableCapacity Int   // decremented on booking, incremented on cancellation
  ...
}

model TicketType {
  totalQuantity     Int
  availableQuantity Int   // same pattern
  ...
}
```

These fields are derived values (they equal `total - booked`), but they are stored and mutated
transactionally to avoid expensive aggregation queries on every booking check. The correctness of
these counters depends entirely on the application always running them inside atomic transactions.
No `CHECK` constraint verifies `availableCapacity BETWEEN 0 AND totalCapacity`.

### 10.5 `category` as a Free-Text String on `Event`

```prisma
model Event {
  category String @default("Technology")
  ...
}
```

Category values like `"Technology"`, `"Music"`, `"Business"`, `"Entertainment"`, `"Food & Drinks"`
are stored as free text. There is no enum or foreign key to a `categories` table, so a typo
(`"Technolgy"`) would silently create a new effective category. Filtering by category in
`event.controller.js` uses a case-insensitive match, which partially mitigates this but does not
prevent it.

### 10.6 `amenities` and `perks` as Delimiter-Separated Strings

```prisma
model Venue {
  amenities String?   // e.g., "Auditorium, Wi-Fi, VIP Lounge"
  ...
}

model TicketType {
  perks String?   // e.g., "Front row seats, Gala dinner, Exclusive merchandise"
  ...
}
```

Both fields store comma-separated lists in a single text column, which violates 1NF in the
strictest interpretation. For the current scale of the application this is acceptable (the values
are displayed as text, not filtered or joined), but extracting them into junction tables would be
necessary if individual amenities or perks needed to be queried or enforced.

### 10.7 `Payment` Controller is a Stub

The `payment.controller.js` file currently returns empty objects for all endpoints. The `Payment`
model and its constraints exist in the schema, but no actual payment processing is implemented.
The defaults (`@default(SUCCESS)`, `@default(UPI)`) mean a Payment row could be created with
`SUCCESS` even when no real transaction occurred.

### 10.8 No `CHECK` Constraint on `rating` in `Review`

```prisma
model Review {
  rating Int   // intended range: 1–5, but no constraint
  ...
}
```

The schema does not add a `CHECK (rating BETWEEN 1 AND 5)` constraint. Prisma does not support
raw `CHECK` constraints natively; they would need to be added via a raw SQL migration. This is
flagged as a **recommendation**.

---

## 11. Conclusion

The EventHub database schema reaches **Boyce–Codd Normal Form** for every table. The normalization
path was:

| Step | Key action |
|---|---|
| **UNF → 1NF** | Extracted the `attendees` repeating group into its own table; ensured all cells hold atomic values. |
| **1NF → 2NF** | Confirmed that all primary keys are single-column surrogates, so no partial dependencies can exist. |
| **2NF → 3NF** | Removed transitive dependencies by splitting `User`, `Venue`, `Event`, `TicketType`, `Booking`, `Attendee`, `Payment`, and `Review` into separate tables, each holding only facts that depend on its own primary key. |
| **3NF → BCNF** | Verified that every non-trivial functional dependency has a determinant that is a candidate key. The tables with multiple candidate keys (`User`, `Booking`, `Payment`, `Review`) all satisfy BCNF because every determinant (`id`, `email`, `bookingReference`, `transactionId`, `(eventId, userId)`) is itself a candidate key. |

**Deliberate denormalization** is used in `Booking` (price snapshot, stored derived total) and
`Attendee` (redundant `eventId`, `ticketTypeId`; guest attendee name/email snapshot). These
trade-offs are explicitly documented in §8 and §10.

**Key recommendations for future hardening:**
- Add a `CHECK (rating BETWEEN 1 AND 5)` constraint to `Review` via a raw SQL migration.
- Add `CHECK (availableCapacity BETWEEN 0 AND totalCapacity)` to `Event` and the equivalent to
  `TicketType` to guard counter integrity at the database level.
- Replace the free-text `category` field with an enum or a foreign key to a `categories` table.
- Consider normalizing `amenities` and `perks` into junction tables if individual values ever need
  to be filtered or enforced.

