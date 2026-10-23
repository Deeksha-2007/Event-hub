import React from "react";
import { Link } from "react-router-dom";
import mockEvents from "../../data/mockdata";
import { useBookmarks } from "../../context/BookmarkContext";

const desktopPositions = [
  "lg:col-start-1 lg:row-start-1 lg:row-span-2",
  "lg:col-start-2 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-2 lg:row-start-2",
  "lg:col-start-3 lg:row-start-2",
  "lg:col-start-4 lg:row-start-1 lg:row-span-2",
];

function FeaturedEvents() {
  const { toggle, isBookmarked } = useBookmarks();
  const featuredEvents = mockEvents.slice(0, 6);

  return (
    <section
      id="featured-events"
      className="bg-[#090909] px-[5%] pb-8 pt-8 text-[#f5f2ec] md:px-[4.3%] md:pb-10 md:pt-9"
    >
      {/* Heading */}
      <header className="mb-5 flex items-end justify-between gap-4 sm:mb-6 md:mb-7">
        <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(27px,3.6vw,47px)] font-normal leading-tight tracking-[-1.4px]">
          Find your <em className="text-[#aaa69e]">next thing.</em>
        </h2>

        <Link
          to="/events"
          className="inline-flex shrink-0 items-center gap-2 pb-1 text-[10px] text-[#d4d0c8] transition-colors hover:text-white sm:text-xs"
        >
          All events <span className="text-base">↗</span>
        </Link>
      </header>

      {/* Desktop: large left + 2x2 center + large right */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:h-[min(36vw,600px)] lg:grid-cols-[1.55fr_1fr_1fr_1.55fr] lg:grid-rows-2 lg:gap-3">
        {featuredEvents.map((event, index) => {
          const isLarge = index === 0 || index === 5;
          const bookmarked = isBookmarked(event.id);

          return (
            <div
              key={event.id}
              className={`group relative isolate h-47.5 min-w-0 overflow-hidden bg-[#171717] text-white sm:h-57.5 lg:h-auto ${desktopPositions[index]} ${
                isLarge ? "col-span-2 lg:col-span-1" : "col-span-1"
              }`}
            >
              <img
                src={event.image || event.imageUrl}
                alt=""
                loading="lazy"
                className="absolute inset-0 -z-20 h-full w-full object-cover brightness-[0.82] saturate-[0.8] transition duration-500 group-hover:scale-[1.045] group-hover:brightness-95"
              />

              <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/15 via-transparent to-black/84" />

              <span className="absolute left-2.5 top-3 text-[9px] tracking-wider text-white/90 sm:left-3 sm:text-[10px]">
                {String(index + 1).padStart(2, "0")}
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
                className={`absolute right-11 top-2.5 z-10 grid h-7 w-7 place-items-center rounded-full border transition-colors sm:right-12 sm:top-3 ${
                  bookmarked
                    ? "border-[#d5b68a] bg-[#d5b68a] text-[#17120c]"
                    : "border-white/65 bg-black/40 text-white hover:bg-white/20"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={bookmarked ? "currentColor" : "none"}
                  className="h-3.5 w-3.5 stroke-current stroke-[1.6]"
                >
                  <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />
                </svg>
              </button>

              <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full border border-white/65 text-sm transition-colors group-hover:bg-[#f5f2ec] group-hover:text-[#090909] sm:right-3 sm:top-3">
                ↗
              </span>

              <div
                className={`absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 ${
                  isLarge ? "lg:bottom-4 lg:left-4 lg:right-4" : ""
                }`}
              >
                <span className="mb-1.5 block text-[7px] tracking-[1.2px] text-[#d5b68a] sm:text-[8px] sm:tracking-[1.4px]">
                  {event.category}
                </span>

                <h3
                  className={`mb-2 font-['Playfair_Display',Georgia,serif] font-normal leading-tight tracking-[-0.3px] ${
                    isLarge
                      ? "text-xl sm:text-2xl lg:text-[clamp(23px,2.2vw,34px)]"
                      : "text-sm sm:text-base lg:text-[clamp(14px,1.2vw,18px)]"
                  }`}
                >
                  {event.title}
                </h3>

                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-white/35 pt-2 text-[8px] text-white/85 sm:text-[9px]">
                  <span>{event.location}</span>
                  <span className="whitespace-nowrap">
                    From ₹{event.price}
                  </span>
                </div>
              </div>

              {/* Book Tickets overlay — appears on hover */}
              <Link
                to={`/events/${event.id}/book`}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
                className="absolute inset-x-2.5 bottom-2.5 z-20 hidden items-center justify-center gap-2 rounded-full bg-[#d5b68a] py-2.5 text-[10px] font-semibold text-[#17120c] opacity-0 transition-all duration-200 group-hover:opacity-100 sm:flex sm:inset-x-3 sm:bottom-3"
              >
                Book Tickets ↗
              </Link>

              {/* Make whole card navigable */}
              <Link
                to={`/events/${event.id}`}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 z-10"
                aria-label={`View ${event.title}`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturedEvents;
