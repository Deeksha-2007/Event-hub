import React from "react";
import { Link } from "react-router-dom";

/**
 * Single saved event card used on the Saved Events page.
 * Props: { event, onRemove }
 */
export default function SavedEventCard({ event, onRemove }) {
  const id       = event.id ?? event._id;
  const image    = event.image || event.imageUrl || event.coverImage || "";
  const title    = event.title || event.name || "Untitled event";
  const category = event.category || "Event";
  const date     = event.date || event.eventDate || "";
  const venue    = event.venue || event.location || "";
  const price    = Number(event.price ?? event.ticketPrice ?? 0);

  return (
    <article className="group min-w-0">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-[#17151b]">
        <Link to={`/events/${id}`} className="block h-full w-full">
          {image ? (
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover brightness-85 transition duration-500 group-hover:scale-105 group-hover:brightness-95"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#272033] to-[#111015]">
              <span className="font-serif text-2xl text-white/20">EventNest</span>
            </div>
          )}
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />

        {/* Category badge */}
        <span className="pointer-events-none absolute left-3 top-3 max-w-[65%] truncate rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[9px] uppercase tracking-[0.14em] text-white backdrop-blur-md">
          {category}
        </span>

        {/* Remove bookmark */}
        <button
          type="button"
          aria-label="Remove bookmark"
          onClick={() => onRemove(event)}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 backdrop-blur-md transition hover:border-red-400/50 hover:bg-red-500/20 hover:text-red-300"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current stroke-[1.8]">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Price */}
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-[#f5f2ec] px-3 py-1 text-xs font-semibold text-[#17120c]">
          {price <= 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`}
        </span>
      </div>

      <div className="pt-3">
        <h3 className="line-clamp-2 font-['Playfair_Display',Georgia,serif] text-lg leading-snug text-[#f5f2ec] transition-colors group-hover:text-[#d5b68a]">
          <Link to={`/events/${id}`}>{title}</Link>
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-white/50">
          {date && <span>{date}</span>}
          {date && venue && <span>·</span>}
          {venue && <span>{venue}</span>}
        </div>
      </div>
    </article>
  );
}
