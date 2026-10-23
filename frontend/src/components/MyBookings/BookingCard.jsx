import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/formatters";

function StatusBadge({ status }) {
  const cls =
    status === "Confirmed"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
      : "border-white/10 bg-white/[0.03] text-white/40";
  return (
    <span className={`rounded-full border px-3 py-1 text-[9px] uppercase tracking-[0.15em] ${cls}`}>
      {status}
    </span>
  );
}

export default function BookingCard({ booking }) {
  const ev = booking.event || {};
  const isPast = ev.date ? new Date(ev.date) < new Date() : false;
  return (
    <article
      className={`group overflow-hidden rounded-3xl border transition duration-300 hover:-translate-y-0.5 ${
        isPast
          ? "border-white/6 bg-[#0c0c0c]"
          : "border-white/10 bg-[#0e0b14] hover:border-white/20"
      }`}
    >
      <div className="grid sm:grid-cols-[180px_1fr]">
        {/* Image */}
        <div className="relative h-48 overflow-hidden sm:h-auto sm:min-h-45">
          {ev.image ? (
            <img
              src={ev.image}
              alt={ev.title || "Event"}
              className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                isPast ? "brightness-40 saturate-50" : "brightness-60"
              }`}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#17151b] text-3xl text-white/20">
              EventNest
            </div>
          )}
          {isPast && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-white/50 backdrop-blur-md">
                Past
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/3 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-white/40">
                {ev.category || "Event"}
              </span>
              <StatusBadge status={booking.status || "Confirmed"} />
              {booking.isDemoRecord && (
                <span className="rounded-full border border-[#d5b68a]/25 px-2.5 py-1 text-[9px] uppercase tracking-widest text-[#d5b68a]/60">
                  Sample
                </span>
              )}
            </div>

            <h3 className="font-['Playfair_Display',Georgia,serif] text-xl leading-snug text-[#f5f2ec]">
              {ev.title || "Event"}
            </h3>

            <div className="mt-3 space-y-1.5 text-xs text-white/45">
              {ev.date && (
                <p>
                  📅 {formatDate(ev.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })} · {ev.time}
                </p>
              )}
              {ev.venue && <p>📍 {ev.venue}</p>}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-white/8 pt-4">
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-white/35">Ticket</span>
                <span className="text-white/70">
                  {booking.ticketType} × {booking.quantity}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/35">Ref</span>
                <span className="font-mono text-[#d5b68a]">{booking.ref}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/35">Total</span>
                <span className="font-semibold text-[#f5f2ec]">
                  {booking.total === 0
                    ? "Free"
                    : `₹${booking.total?.toLocaleString("en-IN")}`}
                </span>
              </div>
            </div>

            {ev.id && (
              <Link
                to={`/events/${ev.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/60 transition hover:border-white/30 hover:text-white"
              >
                View event ↗
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
