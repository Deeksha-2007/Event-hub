
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/common/navbar";
import EventHero from "../components/events/EventHero";
import EventFilters from "../components/events/EventFilters";
import EventGrid from "../components/events/EventGrid";
import Pagination from "../components/events/Pagination";
import Footer from "../components/common/footer";
import mockEvents from "../data/mockdata";

const INITIAL_FILTERS = {
  category: "All",
  date: "Any date",
  location: "All locations",
  price: "Any price",
  sort: "Recommended",
  format: "All formats",
  time: "Any time",
};

const PAGE_SIZE = 8;

function getEventPrice(event) {
  return Number(event.price ?? event.ticketPrice ?? 0);
}

function getEventDate(event) {
  const value = event.eventDate || event.date;

  if (!value) return null;

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function matchesDate(event, selectedDate) {
  if (selectedDate === "Any date") return true;

  const eventDate = getEventDate(event);

  if (!eventDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDay = new Date(eventDate);
  eventDay.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (selectedDate === "Today") {
    return eventDay.getTime() === today.getTime();
  }

  if (selectedDate === "Tomorrow") {
    return eventDay.getTime() === tomorrow.getTime();
  }

  if (selectedDate === "This Weekend") {
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + daysUntilSaturday);

    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);

    return eventDay >= saturday && eventDay <= sunday;
  }

  if (selectedDate === "This Week") {
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()) % 7);

    return eventDay >= today && eventDay <= endOfWeek;
  }

  return true;
}

function matchesTime(event, selectedTime) {
  if (selectedTime === "Any time") return true;

  const value = (event.time || "").toLowerCase();
  const match = value.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);

  if (!match) return false;

  let hour = Number(match[1]);

  if (match[3] === "pm" && hour !== 12) hour += 12;
  if (match[3] === "am" && hour === 12) hour = 0;

  if (selectedTime === "Morning") return hour < 12;
  if (selectedTime === "Afternoon") return hour >= 12 && hour < 17;
  if (selectedTime === "Evening") return hour >= 17;

  return true;
}

export default function ExploreEvents() {
  const location = useLocation();

  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchQuery = useMemo(
    () =>
      new URLSearchParams(location.search)
        .get("search")
        ?.trim()
        .toLowerCase() || "",
    [location.search]
  );

  // Load local preview data; no backend or database is required.
  useEffect(() => {
    setLoading(true);
    setError(null);
    setEvents(mockEvents);
    setLoading(false);
  }, []);

  const filteredEvents = useMemo(() => {
    let result = events.filter((event) => {
      const title = event.title || event.name || "";
      const description = event.description || "";
      const category = event.category || "";
      const eventLocation = event.location || event.venue || "";
      const format = event.format || "";

      const matchesSearch =
        !searchQuery ||
        `${title} ${description} ${category} ${eventLocation}`
          .toLowerCase()
          .includes(searchQuery);

      const matchesCategory =
        filters.category === "All" ||
        category.toLowerCase() === filters.category.toLowerCase();

      const matchesLocation =
        filters.location === "All locations" ||
        eventLocation.toLowerCase().includes(
          filters.location.toLowerCase()
        );

      const price = getEventPrice(event);

      const matchesPrice =
        filters.price === "Any price" ||
        (filters.price === "Free" && price === 0) ||
        (filters.price === "Paid" && price > 0) ||
        (filters.price === "Under ₹500" &&
          price > 0 &&
          price < 500) ||
        (filters.price === "₹500 and above" && price >= 500);

      const matchesFormat =
        filters.format === "All formats" ||
        format.toLowerCase() === filters.format.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesPrice &&
        matchesFormat &&
        matchesDate(event, filters.date) &&
        matchesTime(event, filters.time)
      );
    });

    if (filters.sort === "Newest") {
      result = [...result].sort((a, b) => {
        const dateA = new Date(
          a.createdAt || a.created_at || a.eventDate || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || b.created_at || b.eventDate || 0
        ).getTime();

        return dateB - dateA;
      });
    }

    if (filters.sort === "Price: Low to High") {
      result = [...result].sort(
        (a, b) => getEventPrice(a) - getEventPrice(b)
      );
    }

    return result;
  }, [events, filters, searchQuery]);

  // Return to page one whenever search or filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function updateFilter(key, value) {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function resetFilters() {
    setFilters({ ...INITIAL_FILTERS });
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[#090909] text-[#f5f2ec]">
      <Navbar />

      <EventHero />

      <EventFilters
        category={filters.category}
        onCategoryChange={(value) => updateFilter("category", value)}
        date={filters.date}
        onDateChange={(value) => updateFilter("date", value)}
        location={filters.location}
        onLocationChange={(value) => updateFilter("location", value)}
        price={filters.price}
        onPriceChange={(value) => updateFilter("price", value)}
        sort={filters.sort}
        onSortChange={(value) => updateFilter("sort", value)}
        format={filters.format}
        onFormatChange={(value) => updateFilter("format", value)}
        time={filters.time}
        onTimeChange={(value) => updateFilter("time", value)}
        onReset={resetFilters}
      />

      {loading && (
        <div className="mx-auto max-w-[1600px] px-5 py-16 text-center sm:px-10 lg:px-16">
          <p className="font-serif text-2xl">
            Finding your next experience...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="mx-auto max-w-[1600px] px-5 py-16 text-center sm:px-10 lg:px-16">
          <h2 className="font-serif text-2xl">
            Unable to load events
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm text-white/55">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <EventGrid
            events={paginatedEvents}
            loading={false}
          />

          {filteredEvents.length === 0 && (
            <div className="mx-auto max-w-[1600px] px-5 pb-12 text-center sm:px-10 lg:px-16">
              <p className="text-white/60">
                No events match your current filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 text-sm text-[#d5b68a] underline underline-offset-4"
              >
                Clear filters and try again
              </button>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <Footer />
    </main>
  );
}
