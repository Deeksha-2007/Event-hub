
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBookmarks } from "../../context/BookmarkContext";
import { eventService } from "../../services/api";

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

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchPastEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await eventService.getAll({
          limit: 100,
          sort: "desc",
          sortBy: "endDate",
        });

        // Handle the API response structure
        const events =
          res.data?.data?.events ||
          res.data?.events ||
          [];

        const now = new Date();

        // Keep only completed events
        const pastEvents = events
          .filter((event) => {
            if (!event.endDate) return false;

            const endDate = new Date(event.endDate);

            return (
              !isNaN(endDate.getTime()) &&
              endDate < now &&
              event.status === "COMPLETED"
            );
          })
          .sort(
            (a, b) =>
              new Date(b.endDate).getTime() -
              new Date(a.endDate).getTime()
          )
          .slice(0, 6);

        const formattedEvents = pastEvents.map((event) => ({
          ...event,
          image: event.bannerUrl || "",
          imageUrl: event.bannerUrl || "",
          location: event.Venue?.city || "Location unavailable",
        }));

        if (isMounted) {
          setFeaturedEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch past events:", error);

        if (isMounted) {
          setError("Unable to load past events. Please try again.");
          setFeaturedEvents([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPastEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="featured-events"
      className="bg-[#090909] px-[5%] pb-8 pt-8 text-[#f5f2ec] md:px-[4.3%] md:pb-10 md:pt-9"
    >
      {/* Section heading */}
      <header className="mb-5 flex items-end justify-between gap-4 sm:mb-6 md:mb-7">
        <div>
          <p className="mb-2 text-[9px] tracking-[2px] text-[#b8b3aa]">
            THE MEMORIES WE MADE
          </p>

          <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(27px,3.6vw,47px)] font-normal leading-tight tracking-[-1.4px]">
            The moments{" "}
            <em className="text-[#aaa69e]">that mattered.</em>
          </h2>
        </div>

        <Link
          to="/events"
          className="inline-flex shrink-0 items-center gap-2 pb-1 text-[10px] text-[#d4d0c8] transition-colors hover:text-white sm:text-xs"
        >
          Past events <span className="text-base">↗</span>
        </Link>
      </header>

      {/* Loading state */}
      {loading ? (
        <p className="py-12 text-center text-sm text-[#aaa8a2]">
          Loading past events...
        </p>
      ) : error ? (
        <div className="border border-white/10 bg-[#111111] px-5 py-14 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : featuredEvents.length === 0 ? (
        /* Empty state */
        <div className="border border-white/10 bg-[#111111] px-5 py-14 text-center">
          <p className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#f5f2ec]">
            Every great memory starts somewhere.
          </p>

          <p className="mt-3 text-sm text-[#aaa8a2]">
            Completed events and their highlights will appear here.
          </p>
        </div>
      ) : (
        /* Past event masonry grid */
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:h-[min(36vw,600px)] lg:grid-cols-[1.55fr_1fr_1fr_1.55fr] lg:grid-rows-2 lg:gap-3">
          {featuredEvents.map((event, index) => {
            const isLarge = index === 0 || index === 5;
            const bookmarked = isBookmarked(event.id);

            return (
              <div
                key={event.id}
                className={`group relative isolate h-47.5 min-w-0 overflow-hidden bg-[#171717] text-white sm:h-57.5 lg:h-auto ${
                  desktopPositions[index]
                } ${isLarge ? "col-span-2 lg:col-span-1" : "col-span-1"}`}
              >
                {/* Event image */}
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    className="absolute inset-0 -z-20 h-full w-full object-cover brightness-[0.82] saturate-[0.8] transition duration-500 group-hover:scale-[1.045] group-hover:brightness-95"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#29231e] to-[#090909]" />
                )}

                {/* Image overlay */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/15 via-transparent to-black/85" />

                {/* Card number */}
                <span className="absolute left-2.5 top-3 text-[9px] tracking-wider text-white/90 sm:left-3 sm:text-[10px]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Bookmark button */}
                <button
                  type="button"
                  aria-label={
                    bookmarked ? "Remove bookmark" : "Bookmark event"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle(event);
                  }}
                  className={`absolute right-11 top-2.5 z-20 grid h-7 w-7 place-items-center rounded-full border transition-colors sm:right-12 sm:top-3 ${
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

                {/* Arrow */}
                <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full border border-white/65 text-sm transition-colors group-hover:bg-[#f5f2ec] group-hover:text-[#090909] sm:right-3 sm:top-3">
                  ↗
                </span>

                {/* Event information */}
                <div
                  className={`absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 ${
                    isLarge ? "lg:bottom-4 lg:left-4 lg:right-4" : ""
                  }`}
                >
                  <span className="mb-1.5 block text-[7px] tracking-[1.2px] text-[#d5b68a] sm:text-[8px]">
                    {event.category || "EVENT"}
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

                  <div className="flex items-center justify-between gap-2 border-t border-white/35 pt-2 text-[8px] text-white/85 sm:text-[9px]">
                    <span>{event.location}</span>

                    <span className="whitespace-nowrap">
                      {new Date(event.endDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Open past event */}
                <Link
                  to={`/events/${event.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View highlights of ${event.title}`}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default FeaturedEvents;
