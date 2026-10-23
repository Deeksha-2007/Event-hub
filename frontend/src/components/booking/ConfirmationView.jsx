import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../common/navbar";
import Footer from "../common/footer";
import { formatDate, formatPrice } from "../../utils/formatters";

/**
 * Full-page confirmation screen shown after a successful simulated booking.
 * Props: { booking, event, onDone }
 */
export default function ConfirmationView({ booking, event }) {
  return (
    <div className="min-h-screen bg-[#090909] text-[#f5f2ec]">
      <Navbar />
      <div className="flex min-h-[85vh] items-center justify-center px-5 py-24">
        <div className="w-full max-w-lg">
          {/* Checkmark */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#d5b68a]/30 bg-[#d5b68a]/10">
            <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 stroke-[#d5b68a] stroke-[1.5]">
              <path d="m5 13 4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p className="text-center text-[10px] uppercase tracking-[0.28em] text-[#d5b68a]">
            BOOKING CONFIRMED
          </p>
          <h1 className="mt-3 text-center font-['Playfair_Display',Georgia,serif] text-3xl text-[#f5f2ec]">
            You're all set!
          </h1>
          <p className="mt-3 text-center text-sm leading-6 text-white/50">
            This is a simulated booking for preview purposes. No real payment or reservation has been made.
          </p>

          {/* Booking card */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/12 bg-[#0e0b14]">
            <div className="relative h-36 overflow-hidden">
              <img
                src={event.image || event.imageUrl}
                alt={event.title}
                className="h-full w-full object-cover brightness-50"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0e0b14] via-transparent" />
            </div>
            <div className="p-6">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <span className="block text-[9px] uppercase tracking-[0.2em] text-[#d5b68a]">
                    {event.category}
                  </span>
                  <h2 className="mt-1 font-['Playfair_Display',Georgia,serif] text-xl text-[#f5f2ec]">
                    {event.title}
                  </h2>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-center">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-white/35">Ref</p>
                  <p className="mt-0.5 font-mono text-sm font-bold text-[#d5b68a]">
                    {booking.ref}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/8 pt-4 text-xs">
                <div>
                  <p className="text-white/35">Date</p>
                  <p className="mt-1 text-[#f5f2ec]">{formatDate(event.eventDate || event.date)}</p>
                </div>
                <div>
                  <p className="text-white/35">Venue</p>
                  <p className="mt-1 text-[#f5f2ec]">{event.venue || event.location}</p>
                </div>
                <div>
                  <p className="text-white/35">Ticket</p>
                  <p className="mt-1 text-[#f5f2ec]">
                    {booking.ticketType} × {booking.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-white/35">Total Paid</p>
                  <p className="mt-1 font-semibold text-[#d5b68a]">
                    {formatPrice(booking.total)}
                  </p>
                </div>
                {booking.attendee?.name && (
                  <div>
                    <p className="text-white/35">Attendee</p>
                    <p className="mt-1 text-[#f5f2ec]">{booking.attendee.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/my-bookings"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d5b68a] px-7 py-3 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8]"
            >
              View My Bookings
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Explore More Events
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
