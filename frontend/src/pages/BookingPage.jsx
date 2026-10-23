
import { useState, useMemo } from "react";
import {
  useParams,
  Link,
  Navigate,
} from "react-router-dom";

import Navbar from "../components/common/navbar";
import Footer from "../components/common/footer";

import BookingForm from "../components/booking/BookingForm";
import BookingSummary from "../components/booking/BookingSummary";
import ConfirmationView from "../components/booking/ConfirmationView";

import { getEventById } from "../data/mockdata";
import { addBooking, generateRef } from "../data/bookings";

export default function BookingPage() {
  const { id } = useParams();

  const event = useMemo(() => getEventById(id), [id]);

  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [attendee, setAttendee] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  if (!event) {
    return (
      <div className="min-h-screen bg-[#090909] text-[#f5f2ec]">
        <Navbar />

        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
          <p className="font-['Playfair_Display',Georgia,serif] text-3xl">
            Event not found
          </p>

          <Link
            to="/events"
            className="text-sm text-[#d5b68a] underline underline-offset-4"
          >
            Browse Events
          </Link>
        </div>

        <Footer />
      </div>
    );
  }

  if (!isLoggedIn) {
    localStorage.setItem(
      "eventnest_redirect",
      `/events/${id}/book`
    );

    return <Navigate to="/login" replace />;
  }

  const tickets = event.ticketTypes || [];

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedTicketId) ||
    tickets[0] ||
    null;

  const pricePerTicket =
    selectedTicket?.price ?? event.price ?? 0;

  const subtotal = pricePerTicket * quantity;

  const convenienceFee =
    subtotal > 0 ? Math.round(subtotal * 0.03) : 0;

  const total = subtotal + convenienceFee;

  const maxQuantity =
    selectedTicket?.available === undefined
      ? 10
      : Math.min(10, selectedTicket.available);

  function handleTicketSelect(ticketId) {
    const ticket = tickets.find((item) => item.id === ticketId);

    if (!ticket || ticket.available === 0) return;

    setSelectedTicketId(ticketId);

    setQuantity((current) => {
      const limit =
        ticket.available === undefined
          ? 10
          : Math.min(10, ticket.available);

      return Math.max(1, Math.min(current, limit));
    });

    setErrors((current) => ({
      ...current,
      ticket: undefined,
    }));
  }

  function validate() {
    const nextErrors = {};

    if (!selectedTicket) {
      nextErrors.ticket = "Please select a ticket type.";
    } else if (selectedTicket.available === 0) {
      nextErrors.ticket = "This ticket type is sold out.";
    } else if (
      selectedTicket.available !== undefined &&
      quantity > selectedTicket.available
    ) {
      nextErrors.ticket =
        "Not enough tickets are available.";
    }

    if (!attendee.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!attendee.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendee.email)
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!attendee.phone.trim()) {
      nextErrors.phone = "Phone is required.";
    } else if (!/^\+?[\d\s\-()]{8,}$/.test(attendee.phone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    return nextErrors;
  }

  function handleConfirm(e) {
    e.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setConfirming(true);

    setTimeout(() => {
      try {
        const booking = addBooking({
          ref: generateRef(),

          event: {
            id: event.id,
            title: event.title,
            date: event.date,
            time: event.time,
            venue: event.venue,
            location: event.location,
            image: event.image || event.imageUrl,
            category: event.category,
          },

          ticketType: selectedTicket?.name || "General",
          quantity,
          pricePerTicket,
          total,
          attendee,
        });

        setConfirmed(booking);
      } catch (error) {
        console.error("Booking failed:", error);

        setErrors({
          submit: "Unable to create your booking. Please try again.",
        });
      } finally {
        setConfirming(false);
      }
    }, 900);
  }

  if (confirmed) {
    return (
      <ConfirmationView
        booking={confirmed}
        event={event}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
      <Navbar />

      <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-28 sm:px-10 sm:pt-32 lg:px-16">
        <Link
          to={`/events/${event.id}`}
          className="mb-8 inline-flex items-center gap-1.5 text-xs text-white/40 transition hover:text-white"
        >
          ← Back to event
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <BookingForm
              tickets={tickets}
              selectedTicketId={selectedTicketId}
              onTicketSelect={handleTicketSelect}
              quantity={quantity}
              onQuantityChange={setQuantity}
              maxQuantity={maxQuantity}
              attendee={attendee}
              onAttendeeChange={setAttendee}
              errors={errors}
              confirming={confirming}
              total={total}
              onSubmit={handleConfirm}
            />

            {errors.submit && (
              <p
                role="alert"
                className="mt-3 text-sm text-red-400"
              >
                {errors.submit}
              </p>
            )}
          </div>

          <BookingSummary
            event={event}
            selectedTicket={selectedTicket}
            quantity={quantity}
            subtotal={subtotal}
            convenienceFee={convenienceFee}
            total={total}
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
