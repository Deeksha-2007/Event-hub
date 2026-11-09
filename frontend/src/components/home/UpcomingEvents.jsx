
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventService } from "../../services/api";
import { useBookmarks } from "../../context/BookmarkContext";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { bookmarks, toggleBookmark } = useBookmarks();

  const categories = [
    "All",
    "Technology",
    "Business",
    "Design",
    "Music",
    "Art",
    "Education",
    "Health",
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await eventService.getAll({
          limit: 100,
          sort: "asc",
          sortBy: "startDate",
        });

        // Support common API response structures
        const eventData =
          response.data?.data?.events ||
          response.data?.events ||
          response.data?.data ||
          response.data;

        const eventsArray = Array.isArray(eventData)
          ? eventData
          : [];

        const now = new Date();

        const formattedEvents = eventsArray
          .map((event) => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);

            const ticketTypes = event.TicketType || [];

            const lowestPrice =
              ticketTypes.length > 0
                ? Math.min(
                    ...ticketTypes.map((ticket) =>
                      Number(ticket.price)
                    )
                  )
                : 0;

            const isOnline = event.format === "ONLINE";

            return {
              ...event,
              image:
                event.bannerUrl ||
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
              eventDate: startDate,
              date: startDate,
              location: isOnline
                ? "Online"
                : event.Venue?.city || "Location TBA",
              venue: isOnline
                ? "Online Event"
                : event.Venue?.name || "Venue TBA",
              time: startDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              price: lowestPrice,
              endDate: endDate,
            };
          })
          .filter(
            (event) =>
              event.status === "PUBLISHED" &&
              !isNaN(event.eventDate.getTime()) &&
              event.eventDate > now
          )
          .sort(
            (a, b) =>
              a.eventDate.getTime() - b.eventDate.getTime()
          )
          .slice(0, 6);

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
        setError("Unable to load upcoming events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents =
    activeCategory === "All"
      ? events
      : events.filter(
          (event) =>
            event.category?.toLowerCase() ===
            activeCategory.toLowerCase()
        );

  const isBookmarked = (eventId) => {
    return bookmarks?.some(
      (bookmark) =>
        bookmark.id === eventId ||
        bookmark.eventId === eventId
    );
  };

  return (
    <section className="bg-[#080808] py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#b8a47a] mb-3">
              Don't Miss Out
            </p>

            <h2 className="text-3xl md:text-5xl font-semibold text-white">
              Upcoming Events
            </h2>

            <p className="text-gray-400 mt-3">
              Discover experiences worth looking forward to.
            </p>
          </div>

          <Link
            to="/explore"
            className="text-white border-b border-[#b8a47a] pb-2 hover:text-[#b8a47a] transition"
          >
            Explore All Events →
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm whitespace-nowrap transition ${
                activeCategory === category
                  ? "bg-[#b8a47a] text-black"
                  : "bg-[#171717] text-gray-300 hover:bg-[#292929]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 text-gray-400">
            Loading upcoming events...
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-white underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl text-white mb-2">
              No upcoming events found
            </h3>
            <p className="text-gray-400">
              Try selecting another category or check back later.
            </p>
          </div>
        )}

        {/* Event Cards */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group bg-[#141414] rounded-2xl overflow-hidden border border-white/5 hover:border-[#b8a47a]/40 transition duration-300"
              >
                {/* Event Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  <span className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-2 rounded-full">
                    {event.category}
                  </span>

                  {/* Bookmark */}
                  <button
                    onClick={() => toggleBookmark(event)}
                    className="absolute top-4 right-4 bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#b8a47a] hover:text-black transition"
                    aria-label="Toggle bookmark"
                  >
                    {isBookmarked(event.id) ? "♥" : "♡"}
                  </button>
                </div>

                {/* Event Details */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-400 mb-5">
                    <p>
                      📅{" "}
                      {event.eventDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <p>🕒 {event.time}</p>

                    <p>📍 {event.location}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-xs text-gray-500">
                        Starting from
                      </p>
                      <p className="text-lg font-semibold text-[#b8a47a]">
                        {event.price === 0
                          ? "Free"
                          : `₹${event.price}`}
                      </p>
                    </div>

                    <Link
                      to={`/events/${event.id}`}
                      className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-[#b8a47a] transition"
                    >
                      View Event
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default UpcomingEvents;
