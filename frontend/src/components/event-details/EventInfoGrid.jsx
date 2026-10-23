import React from "react";
import { formatDate } from "../../../utils/formatters"

/** Quick-info cards row: date, venue, organizer, capacity. Props: { event } */
export default function EventInfoGrid({ event }) {
  const dateStr = formatDate(event.eventDate || event.startDate);
  const items = [
    dateStr && {
      emoji: "📅", label: "DATE",
      primary: dateStr, secondary: event.time,
    },
    event.venue && {
      emoji: "📍", label: "VENUE",
      primary: event.venue, secondary: event.location,
    },
    event.organizer && {
      emoji: "♙", label: "ORGANIZER",
      primary: event.organizer,
    },
    event.capacity && {
      emoji: "◎", label: "CAPACITY",
      primary: `${event.capacity.toLocaleString("en-IN")} seats`,
    },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map(item => (
        <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#0e0b14] p-4">
          <span className="mt-0.5 text-xl text-[#d5b68a]">{item.emoji}</span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">{item.label}</p>
            <p className="mt-1 text-sm font-medium text-[#f5f2ec]">{item.primary}</p>
            {item.secondary && <p className="mt-0.5 text-xs text-white/45">{item.secondary}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
