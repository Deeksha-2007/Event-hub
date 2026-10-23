import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatters";

/** Hero banner for an event detail page. Props: { event } */
export default function EventDetailHero({ event }) {
  const dateStr = formatDate(event.eventDate || event.startDate);
  return (
    <section className="relative isolate h-[55vh] min-h-72 overflow-hidden bg-[#090909] sm:h-[62vh] lg:h-[70vh]">
      <img
        src={event.image || event.imageUrl}
        alt={event.title}
        className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.32] saturate-[0.6]"
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#090909]/90 via-[#090909]/60 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-[#090909] via-[#090909]/20 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-[1600px]">
          <Link to="/events" className="mb-6 inline-flex items-center gap-1.5 text-xs text-white/35 transition hover:text-white">
            ← All Events
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full border border-[#d5b68a]/40 bg-[#d5b68a]/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#d5b68a]">
              {event.category}
            </span>
            {event.format && (
              <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-white/50">
                {event.format}
              </span>
            )}
          </div>
          <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,5.5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.03em] text-[#f7f3ed]">
            {event.title}
          </h1>
        </div>
      </div>
    </section>
  );
}
