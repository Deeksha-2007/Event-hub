
import { Link } from "react-router-dom";

export default function EventNotFound() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center px-5">
      <div className="text-center">
        <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-[#d5b68a]">
          404 — NOT FOUND
        </p>

        <h1 className="font-['Playfair_Display',Georgia,serif] text-4xl text-[#f5f2ec]">
          Event not found
        </h1>

        <p className="mt-3 text-sm text-white/45">
          The event you're looking for doesn't exist or has been removed.
        </p>

        <Link
          to="/events"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d5b68a] px-6 py-3 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8]"
        >
          Browse All Events ↗
        </Link>
      </div>
    </div>
  );
}
