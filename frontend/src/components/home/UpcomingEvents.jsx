import React, { useState } from "react";
import { Link } from "react-router-dom";
import mockEvents from "../../data/mockdata";
import { useBookmarks } from "../../context/BookmarkContext";

const filters = [
  "All",
  "Music",
  "Technology",
  "Business",
  "Workshops",
  "Food & Drinks",
  "Entertainment",
];

function UpcomingEvents() {
  const { toggle, isBookmarked } = useBookmarks();
  const [activeFilter, setActiveFilter] = useState("All");

  const upcomingEvents = mockEvents
    .filter((e) => new Date(e.eventDate) > new Date())
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
    .slice(0, 6);

  const filteredEvents =
    activeFilter === "All"
      ? upcomingEvents
      : upcomingEvents.filter((e) => e.category === activeFilter);

  return (
    <section
      id="upcoming-events"
      className="bg-[#090909] px-[5%] py-12 text-[#f5f2ec] md:px-[4.3%] md:py-16"
    >
      {/* Section heading */}
      <header className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end md:mb-9">
        <div>
          <p className="mb-3 text-[10px] font-medium tracking-[2px] text-[#b8b3aa] sm:text-xs">
            SAVE YOUR SPOT
          </p>

          <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(30px,4vw,48px)] font-normal leading-tight tracking-[-1.2px]">
            Coming up <em className="text-[#aaa69e]">next.</em>
          </h2>

          <p className="mt-3 max-w-110 text-sm leading-6 text-[#aaa8a2]">
            Good plans start here. Find your next experience and make it
            memorable.
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex w-fit shrink-0 items-center gap-2 pb-1 text-xs text-[#d4d0c8] transition hover:text-white"
        >
          Explore all events <span aria-hidden="true">↗</span>
        </Link>
      </header>

      {/* Working category filters */}
      <div
        className="mb-7 flex gap-2 overflow-x-auto pb-2 sm:mb-8 sm:flex-wrap"
        aria-label="Filter upcoming events by category"
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={isActive}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-xs transition duration-200 ${
                isActive
                  ? "border-[#f5f2ec] bg-[#f5f2ec] font-semibold text-[#151515]"
                  : "border-white/15 bg-transparent text-[#c4c0b8] hover:border-white/40 hover:text-white"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Event cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {filteredEvents.map((event) => {
          const eventDateObj = new Date(event.eventDate || event.date);
          const isValidDate = !isNaN(eventDateObj.getTime());
          const dateNum = isValidDate
            ? eventDateObj.getDate().toString().padStart(2, "0")
            : event.date || "";
          const monthStr = isValidDate
            ? eventDateObj
                .toLocaleDateString("en-US", { month: "short" })
                .toUpperCase()
            : event.month || "";
          const dayStr = isValidDate
            ? eventDateObj
                .toLocaleDateString("en-US", { weekday: "long" })
                .toUpperCase()
            : event.day || "";

          const bookmarked = isBookmarked(event.id);

          return (
            <article
              key={event.id}
              className="group min-w-0 overflow-hidden border border-white/10 bg-[#111111] transition duration-300 hover:-translate-y-1 hover:border-white/25"
            >
              {/* Image */}
              <div className="relative h-55 overflow-hidden sm:h-57.5 lg:h-62.5">
                <img
                  src={event.image || event.imageUrl}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover brightness-[0.82] saturate-[0.8] transition duration-500 group-hover:scale-105 group-hover:brightness-100"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-black/20" />

                {/* Date badge */}
                <div className="absolute left-4 top-4 flex min-w-13.5 flex-col items-center bg-[#f5f2ec] px-3 py-2.5 text-[#151515]">
                  <span className="text-[22px] font-semibold leading-none">
                    {dateNum}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold tracking-[1px]">
                    {monthStr}
                  </span>
                </div>

                {/* Category */}
                <span className="absolute bottom-4 left-4 text-[9px] font-medium tracking-[1.7px] text-[#e6c99b]">
                  {event.category.toUpperCase()}
                </span>

                {/* Bookmark button */}
                <button
                  type="button"
                  aria-label={bookmarked ? "Remove bookmark" : "Bookmark event"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle(event);
                  }}
                  className={`absolute right-14 top-4 z-10 grid h-8 w-8 place-items-center rounded-full border transition ${
                    bookmarked
                      ? "border-[#d5b68a] bg-[#d5b68a] text-[#17120c]"
                      : "border-white/60 bg-black/40 text-white hover:bg-white/20"
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

                {/* Arrow */}
                <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-white/60 text-white transition group-hover:border-white group-hover:bg-white group-hover:text-[#151515]">
                  ↗
                </span>
              </div>

              {/* Details */}
              <div className="p-4 sm:p-5">
                <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#a9a69f]">
                  <span>{dayStr}</span>
                  <span className="h-1 w-1 rounded-full bg-[#d5b68a]" />
                  <span>{event.time}</span>
                </div>

                <h3 className="font-['Playfair_Display',Georgia,serif] text-[22px] font-normal leading-tight tracking-[-0.4px] text-[#f5f2ec] transition group-hover:text-[#e6c99b]">
                  {event.title}
                </h3>

                <p className="mt-2 text-xs text-[#aaa8a2]">
                  {event.venue}, {event.location}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <Link
                      to={`/events/${event.id}/book`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#d5b68a]/15 px-4 py-2 text-xs font-medium text-[#d5b68a] transition hover:bg-[#d5b68a]/25"
                    >
                      Book Tickets ↗
                    </Link>
                    <Link
                      to={`/events/${event.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#d5b68a] transition group-hover:translate-x-1"
                    >
                      View event →
                    </Link>
                  </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <p className="py-12 text-center text-sm text-[#aaa8a2]">
          No events found in this category.
        </p>
      )}

      {/* Bottom link */}
      <div className="mt-9 flex justify-center md:mt-11">
        <Link
          to="/events"
          className="inline-flex min-h-11.5 items-center justify-center gap-3 rounded-full border border-white/20 px-6 text-xs text-[#f5f2ec] transition hover:border-white/50 hover:bg-white/5"
        >
          Discover all events <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}

export default UpcomingEvents;
