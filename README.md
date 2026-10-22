# 🎟️ EventHub — Event & Ticket Management System

EventHub is a web-based **Event & Ticket Management System** that allows users to discover events, register for them, purchase tickets, and manage their bookings.

The platform also provides organizers with tools to create and manage events, define ticket types, track attendees, monitor event capacity, and view revenue.

---

## ✨ Features

### 👤 Users

* Create an account and log in
* Browse available events
* View detailed event information
* Register for events
* Choose from available ticket types
* Purchase tickets
* View booking history
* Cancel registrations
* View booking and payment details
* Leave reviews for events

### 🎤 Organizers

* Create new events
* Edit and manage events
* Add event descriptions, dates, and venues
* Set event capacity
* Create different ticket types
* Set ticket prices
* Track bookings and attendees
* Monitor ticket sales
* View revenue generated from events

### 🎟️ Tickets & Bookings

* Multiple ticket types for each event
* Ticket availability tracking
* Booking confirmation
* Booking history
* Registration cancellation
* Attendee tracking

### 💳 Payments

* Secure payment processing
* Payment status tracking
* Payment records linked to bookings
* Support for successful and failed payments

### ⭐ Reviews

* Users can review events
* Users can provide ratings
* Event reviews can be displayed for other users

---

## 📅 Event Details

Each event contains information such as:

* Event name
* Description
* Date and time
* Venue
* Organizer
* Event capacity
* Available tickets
* Ticket types
* Ticket prices
* Registered attendees
* Reviews

---

## 🎫 Ticket Types

Organizers can create multiple ticket categories for the same event.

For example:

| Ticket Type | Price |
| ----------- | ----: |
| Early Bird  |  ₹199 |
| Regular     |  ₹299 |
| VIP         |  ₹799 |

Users can select their preferred ticket type while booking.

---

## 📋 Booking Flow

```text
Browse Events
      ↓
Select Event
      ↓
Choose Ticket Type
      ↓
Make Booking
      ↓
Complete Payment
      ↓
Booking Confirmed
      ↓
Added to Attendees
```

---

## ❌ Cancellation

Users can cancel their registrations through their bookings.

After cancellation, the booking status is updated and the available event capacity is adjusted accordingly.

---

## 📊 Organizer Dashboard

Organizers can view:

* Events created
* Total bookings
* Total attendees
* Tickets sold
* Available capacity
* Revenue generated
* Ticket-type sales
* Event reviews

---

## 🗂️ Main Modules

```text
EventNest
│
├── User Management
├── Event Management
├── Venue Management
├── Ticket Management
├── Booking Management
├── Payment Management
├── Attendee Management
└── Review Management
```

---

## 🛠️ Tech Stack

**Frontend**

* React
* JavaScript
* HTML
* CSS

**Backend**

* Node.js
* Express.js

**Database**

* PostgreSQL
* Prisma

---

## 📁 Project Structure

```text
EventNest/
│
├── frontend/
│
├── backend/
│
├── prisma/
│   └── schema.prisma
│
├── database/
│
├── .env
├── package.json
└── README.md
```

---

## 🎯 Project Goal

The goal of EventHub is to provide a single platform where **users can discover and book events**, while **organizers can create, manage, and monitor their events** from one place.

EventHub brings event discovery, ticket booking, payments, attendee management, and event reviews together in one system.
