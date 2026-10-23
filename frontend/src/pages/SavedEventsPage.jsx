import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/footer";
import { useBookmarks } from "../context/BookmarkContext";
import SavedEventCard from "../components/saved/SavedEventCard";

export default function SavedEventsPage() {
  const { allBookmarks, toggle } = useBookmarks();

  return (
    <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
      <Navbar />

      <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-28 sm:px-10 sm:pt-32 lg:px-16">
        {/* Page Header */}
        <div className="mb-10">
          <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-[#d5b68a]">
            SAVED EXPERIENCES
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4vw,3.5rem)] font-normal leading-tight tracking-[-0.03em] text-[#f5f2ec]">
              Saved Events
            </h1>
            {allBookmarks.length > 0 && (
              <p className="shrink-0 text-xs text-white/45">
                {allBookmarks.length} {allBookmarks.length === 1 ? "saved event" : "saved events"}
              </p>
            )}
          </div>
        </div>

        {/* Empty state */}
        {allBookmarks.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[#0e0b14] px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#d5b68a]/30 bg-[#d5b68a]/10 text-2xl text-[#d5b68a]">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 stroke-current stroke-[1.6]">
                <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />
              </svg>
            </div>
            <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#f5f2ec]">
              No saved events yet.
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Bookmark events you are interested in to keep track of them here.
            </p>
            <Link
              to="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d5b68a] px-6 py-3 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8]"
            >
              Browse Events ↗
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allBookmarks.map(event => (
              <SavedEventCard
                key={event.id ?? event._id}
                event={event}
                onRemove={toggle}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
