
import { Link } from "react-router-dom";

export default function MobileBookingBar({
  eventId,
  price,
  bookmarked,
  onToggleBookmark,
  event,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#090909]/95 p-4 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <p className="text-[10px] text-white/35">
            TICKETS FROM
          </p>

          <p className="font-medium text-[#f5f2ec]">
            {Number(price) === 0
              ? "Free"
              : `₹${Number(price).toLocaleString("en-IN")}`}
          </p>
        </div>

        <Link
          to={`/events/${eventId}/book`}
          className="ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#d5b68a] px-6 py-3 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8]"
        >
          Book Tickets ↗
        </Link>

        <button
          type="button"
          aria-label={bookmarked ? "Remove bookmark" : "Save event"}
          onClick={() => onToggleBookmark(event)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
            bookmarked
              ? "border-[#d5b68a]/50 bg-[#d5b68a]/10 text-[#d5b68a]"
              : "border-white/15 text-white/60"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill={bookmarked ? "currentColor" : "none"}
            className="h-4 w-4 stroke-current stroke-[1.6]"
          >
            <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
