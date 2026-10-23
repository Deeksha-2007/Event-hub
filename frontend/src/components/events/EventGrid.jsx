
export default function EventGrid({ events = [], loading = false }) {
  if (loading) {
    return (
      <section
        className="mx-auto max-w-[1600px] px-5 py-10 sm:px-10 lg:px-16"
        aria-label="Loading events"
      >
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[4/3] rounded-2xl bg-white/[0.06]" />
              <div className="mt-4 h-4 w-3/4 rounded bg-white/[0.08]" />
              <div className="mt-3 h-3 w-1/2 rounded bg-white/[0.05]" />
              <div className="mt-3 h-3 w-2/3 rounded bg-white/[0.05]" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="mx-auto max-w-[1600px] px-5 py-16 text-center sm:px-10 lg:px-16">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 text-2xl text-[#d5b68a]">
            ↗
          </div>

          <h3 className="font-serif text-2xl text-[#f5f2ec]">
            No events found
          </h3>

          <p className="mt-2 text-sm leading-6 text-white/50">
            Try changing your filters to discover more experiences.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="event-list"
      className="mx-auto max-w-[1600px] px-5 py-8 sm:px-10 lg:px-16 lg:py-10"
    >
      {/* Results heading */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#d5b68a]">
            CURATED FOR YOU
          </p>

          <h2 className="font-serif text-2xl text-[#f5f2ec] sm:text-3xl">
            Discover experiences
          </h2>
        </div>

        <p className="shrink-0 text-xs text-white/45">
          {events.length} {events.length === 1 ? "event" : "events"}
        </p>
      </div>

      {/* Event cards */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => {
          const image =
            event.image ||
            event.imageUrl ||
            event.coverImage ||
            "";

          const title = event.title || event.name || "Untitled event";

          const category = event.category || "Event";

          const eventDate = event.date || event.eventDate || "";

          const location =
            event.location ||
            event.venue ||
            (event.format === "Online" ? "Online" : "");

          const price = Number(event.price ?? event.ticketPrice ?? 0);

          return (
            <article
              key={event.id ?? event._id ?? title}
              className="group min-w-0"
            >
              {/* Image */}
              <a
                href={
                  event.href ||
                  (event.id || event._id
                    ? `/events/${event.id ?? event._id}`
                    : "#event-list")
                }
                className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[#17151b] outline-none focus-visible:ring-2 focus-visible:ring-[#d5b68a]"
                aria-label={`View ${title}`}
              >
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#272033] to-[#111015]">
                    <span className="font-serif text-2xl text-white/20">
                      EventNest
                    </span>
                  </div>
                )}

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Category badge */}
                <span className="absolute left-3 top-3 max-w-[75%] truncate rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  {category}
                </span>

                {/* Bookmark visual */}
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition group-hover:bg-[#d5b68a] group-hover:text-[#17120c]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 stroke-current stroke-[1.6]"
                  >
                    <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />
                  </svg>
                </span>

                {/* Price */}
                <span className="absolute bottom-3 right-3 rounded-full bg-[#f5f2ec] px-3 py-1.5 text-xs font-semibold text-[#17120c]">
                  {price <= 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`}
                </span>
              </a>

              {/* Event details */}
              <div className="pt-4">
                <h3 className="line-clamp-2 font-serif text-xl leading-snug text-[#f5f2ec] transition-colors group-hover:text-[#d5b68a]">
                  {title}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/50">
                  {eventDate && <span>{eventDate}</span>}

                  {eventDate && location && (
                    <span aria-hidden="true">·</span>
                  )}

                  {location && <span>{location}</span>}
                </div>

                {event.time && (
                  <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-white/35">
                    {event.time}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
