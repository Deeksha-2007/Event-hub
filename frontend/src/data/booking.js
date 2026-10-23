
// ─── EventNest Booking Store ──────────────────────────────────────────────────
// Simulated localStorage-backed booking store for the frontend preview.
// No real payment or reservation is made. This is clearly a demo.

const STORAGE_KEY = "eventnest_bookings";

/** Generate a short booking reference like EVT-A3B2K1 */
export function generateRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "EVT-";
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

/** Safely read all bookings from localStorage. */
export function getBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getSeedBookings();
  } catch {
    return getSeedBookings();
  }
}

/** Write a booking to localStorage and return it. */
export function addBooking(booking) {
  const bookings = getBookings();
  const newBooking = {
    ...booking,
    id: `booking-${Date.now()}`,
    ref: booking.ref || generateRef(),
    createdAt: new Date().toISOString(),
    status: "Confirmed",
  };
  const updated = [newBooking, ...bookings];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore quota errors
  }
  return newBooking;
}

/**
 * Pre-seeded demo bookings — shown on My Bookings when the user
 * has not yet completed a checkout in this session.
 * Clearly identified as sample / demo records.
 */
function getSeedBookings() {
  return [
    {
      id: "seed-booking-1",
      ref: "EVT-DEMO01",
      status: "Confirmed",
      createdAt: "2026-10-10T14:22:00.000Z",
      isDemoRecord: true,
      event: {
        id: "event-1",
        title: "Future of Artificial Intelligence",
        date: "2026-11-12",
        time: "10:00 AM",
        venue: "India Habitat Centre, New Delhi",
        location: "New Delhi",
        image:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
        category: "Technology",
      },
      ticketType: "General",
      quantity: 2,
      pricePerTicket: 499,
      total: 998,
      attendee: { name: "Demo User", email: "demo@eventnest.in" },
    },
    {
      id: "seed-booking-2",
      ref: "EVT-DEMO02",
      status: "Confirmed",
      createdAt: "2026-09-25T09:00:00.000Z",
      isDemoRecord: true,
      event: {
        id: "event-19",
        title: "Jazz Under the Stars",
        date: "2026-09-14",
        time: "7:30 PM",
        venue: "IGNCA, Janpath, New Delhi",
        location: "New Delhi",
        image:
          "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=800&q=80",
        category: "Music",
      },
      ticketType: "General",
      quantity: 1,
      pricePerTicket: 649,
      total: 649,
      attendee: { name: "Demo User", email: "demo@eventnest.in" },
    },
  ];
}
