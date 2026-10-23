
import { Link } from "react-router-dom";
import TicketSelection from "./TicketSelection";

export default function BookingSidebar({
  event,
  eventId,
  tickets,
  selectedTicketId,
  onSelectTicket,
  price,
  dateStr,
  bookmarked,
  onToggleBookmark,
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-3xl border border-white/10 bg-[#0e0b14] p-6">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#d5b68a]">
            TICKETS FROM
          </p>

          <p className="mt-2 font-['Playfair_Display',Georgia,serif] text-4xl text-[#f5f2ec]">
            {Number(price) === 0
              ? "Free"
              : `₹${Number(price).toLocaleString("en-IN")}`}
          </p>

          {tickets.find((t) => t.id === selectedTicketId) && (
            <p className="mt-1 text-xs text-white/35">
              {tickets.find((t) => t.id === selectedTicketId).name}
            </p>
          )}
        </div>

        {tickets.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-white/35">
              TICKET TYPE
            </p>

            <TicketSelection
              tickets={tickets}
              selectedTicketId={selectedTicketId}
              onSelect={onSelectTicket}
              title=""
            />
          </div>
        )}

        <Link
          to={`/events/${eventId}/book`}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#d5b68a] py-4 text-sm font-semibold text-[#17120c] transition hover:-translate-y-0.5 hover:bg-[#e8cfa8]"
        >
          Book Tickets <span aria-hidden="true">↗</span>
        </Link>

        <button
          type="button"
          onClick={() => onToggleBookmark(event)}
          className={`flex w-full items-center justify-center gap-2 rounded-full border py-3.5 text-sm transition ${
            bookmarked
              ? "border-[#d5b68a]/50 bg-[#d5b68a]/10 text-[#d5b68a]"
              : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill={bookmarked ? "currentColor" : "none"}
            className="h-4 w-4 stroke-current stroke-[1.6]"
          >
            <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />
          </svg>

          {bookmarked ? "Saved" : "Save Event"}
        </button>

        <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
          {dateStr && (
            <div className="flex items-center gap-2.5 text-xs text-white/45">
              <span className="text-[#d5b68a]">📅</span>
              {dateStr}
            </div>
          )}

          {event.time && (
            <div className="flex items-center gap-2.5 text-xs text-white/45">
              <span className="text-[#d5b68a]">⏱</span>
              {event.time}
            </div>
          )}

          {event.venue && (
            <div className="flex items-start gap-2.5 text-xs text-white/45">
              <span className="text-[#d5b68a]">📍</span>
              <span>{event.venue}</span>
            </div>
          )}

          {event.organizer && (
            <div className="flex items-center gap-2.5 text-xs text-white/45">
              <span className="text-[#d5b68a]">♙</span>
              {event.organizer}
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-[9px] text-white/20">
          Simulated booking — no real payment required
        </p>
      </div>
    </aside>
  );
}
