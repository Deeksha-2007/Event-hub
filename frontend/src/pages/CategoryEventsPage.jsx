
import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import Navbar from "../components/common/navbar";
import Footer from "../components/common/footer";
import EventGrid from "../components/events/EventGrid";
import Pagination from "../components/events/Pagination";
import SlimFilters, {
  INITIAL_FILTERS,
} from "../components/events/SlimFilters";

import CategoryHero from "../components/events/category/CategoryHero";
import OtherCategories from "../components/events/category/OtherCategories";

import {
  CATEGORY_META,
  DEFAULT_META,
} from "../components/events/category/categoryConfig";

import { eventService } from "../services/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;
const API_PAGE_SIZE = 100;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugToLabel(slug = "") {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getPrice(event) {
  const ticketTypes = event.TicketType || event.ticketTypes || [];

  const prices = ticketTypes
    .map((ticket) => Number(ticket.price))
    .filter((price) => Number.isFinite(price));

  if (prices.length > 0) {
    return Math.min(...prices);
  }

  return Number(event.price ?? event.ticketPrice ?? 0);
}

function getEventEndDate(event) {
  const value =
    event.endDate ||
    event.eventDate ||
    event.startDate ||
    event.date;

  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function hasEventPassed(event) {
  const endDate = getEventEndDate(event);

  return endDate ? endDate.getTime() < Date.now() : false;
}

function normalizeEvent(event) {
  const venue = event.Venue || event.venue || null;
  const organizer = event.User || event.organizer || null;

  const ticketTypes = event.TicketType || event.ticketTypes || [];

  return {
    ...event,

    id: event.id,

    title: event.title || event.name || "Untitled Event",

    name: event.title || event.name || "Untitled Event",

    image:
      event.bannerUrl ||
      event.image ||
      event.imageUrl ||
      "",

    bannerUrl:
      event.bannerUrl ||
      event.image ||
      event.imageUrl ||
      "",

    eventDate:
      event.startDate ||
      event.eventDate ||
      event.date,

    date:
      event.startDate ||
      event.eventDate ||
      event.date,

    endDate: event.endDate,

    venue: venue?.name || event.venueName || "Online",

    location:
      event.format === "ONLINE"
        ? "Online"
        : [
            venue?.city,
            venue?.state,
          ]
            .filter(Boolean)
            .join(", ") ||
          event.location ||
          "Location unavailable",

    organizer:
      organizer?.name ||
      organizer?.fullName ||
      event.organizerName ||
      "Event Organizer",

    capacity:
      event.totalCapacity ||
      event.capacity ||
      0,

    price: getPrice(event),

    ticketTypes,
  };
}

function matchDate(event, selectedDate) {
  if (selectedDate === "Any date") return true;

  const value =
    event.startDate ||
    event.eventDate ||
    event.date;

  if (!value) return false;

  const eventDate = new Date(value);
  eventDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate === "Today") {
    return eventDate.getTime() === today.getTime();
  }

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (selectedDate === "Tomorrow") {
    return eventDate.getTime() === tomorrow.getTime();
  }

  if (selectedDate === "This Weekend") {
    const saturday = new Date(today);

    saturday.setDate(
      today.getDate() + ((6 - today.getDay() + 7) % 7)
    );

    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);

    return eventDate >= saturday && eventDate <= sunday;
  }

  if (selectedDate === "This Week") {
    const endOfWeek = new Date(today);

    endOfWeek.setDate(
      today.getDate() + ((7 - today.getDay()) % 7)
    );

    return eventDate >= today && eventDate <= endOfWeek;
  }

  return true;
}

function getApiEvents(response) {
  const data = response?.data?.data;

  return {
    events: data?.events || [],
    pagination: data?.pagination || {},
  };
}

// ─── Main Category Page ───────────────────────────────────────────────────────

export default function CategoryEventsPage() {
  const { slug } = useParams();

  const label = CATEGORY_META[slug]?.label || slugToLabel(slug);

  const meta = CATEGORY_META[slug] || {
    ...DEFAULT_META,
    label,
  };

  const [allEvents, setAllEvents] = useState([]);

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── Fetch all upcoming events for this category from API ───────────────────

  useEffect(() => {
    let cancelled = false;

    async function fetchCategoryEvents() {
      setLoading(true);
      setError("");

      try {
        let page = 1;
        let totalPages = 1;
        let fetchedEvents = [];

        // Fetch all API pages so client-side filters and pagination
        // operate on the complete category event list.
        do {
          const response = await eventService.getAll({
            category: label,
            page,
            limit: API_PAGE_SIZE,
            sortBy: "startDate",
            sort: "asc",
            upcoming: true,
          });

          const result = getApiEvents(response);

          fetchedEvents = [
            ...fetchedEvents,
            ...result.events,
          ];

          totalPages = Math.max(
            Number(result.pagination.totalPages) || 1,
            1
          );

          page += 1;
        } while (page <= totalPages);

        const upcomingEvents = fetchedEvents
          .filter((event) => {
            const matchesCategory =
              (event.category || "").toLowerCase() ===
              label.toLowerCase();

            return (
              matchesCategory &&
              event.status === "PUBLISHED" &&
              !hasEventPassed(event)
            );
          })
          .map(normalizeEvent);

        // Remove duplicate records if the API returns overlapping pages.
        const uniqueEvents = Array.from(
          new Map(
            upcomingEvents.map((event) => [event.id, event])
          ).values()
        );

        if (!cancelled) {
          setAllEvents(uniqueEvents);
        }
      } catch (err) {
        console.error("Category events API error:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load category events. Please try again."
          );

          setAllEvents([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCategoryEvents();

    return () => {
      cancelled = true;
    };
  }, [slug, label]);

  // ─── Search and filters ─────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = allEvents.filter((event) => {
      const title = (event.title || "").toLowerCase();

      const location = (
        event.location ||
        event.venue ||
        ""
      ).toLowerCase();

      const description = (
        event.description || ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        `${title} ${location} ${description}`.includes(query);

      const matchesLocation =
        filters.location === "All locations" ||
        location.includes(filters.location.toLowerCase());

      const price = getPrice(event);

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
        (event.format || "").toLowerCase() ===
          filters.format.toLowerCase();

      return (
        matchesSearch &&
        matchesLocation &&
        matchesPrice &&
        matchesFormat &&
        matchDate(event, filters.date)
      );
    });

    if (filters.sort === "Newest") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.startDate || b.eventDate || b.date) -
          new Date(a.startDate || a.eventDate || a.date)
      );
    }

    if (filters.sort === "Price: Low to High") {
      result = [...result].sort(
        (a, b) => getPrice(a) - getPrice(b)
      );
    }

    return result;
  }, [allEvents, filters, search]);

  // ─── Pagination ─────────────────────────────────────────────────────────────

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, search, slug]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const pageEvents = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ─── Filter handlers ────────────────────────────────────────────────────────

  const updateFilter = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({ ...INITIAL_FILTERS });
    setSearch("");
    setCurrentPage(1);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
      <Navbar />

      {/* 1. Category Hero */}
      <CategoryHero
        meta={meta}
        eventCount={allEvents.length}
      />

      {/* 2. Category Events */}
      <div id="events-grid">

        {loading ? (
          <div className="mx-auto max-w-md px-5 py-24 text-center">
            <p className="text-sm text-white/50">
              Loading {label} events...
            </p>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md px-5 py-24 text-center">
            <p className="text-sm text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 text-sm text-[#d5b68a] underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        ) : allEvents.length === 0 ? (
          <div className="mx-auto max-w-md px-5 py-24 text-center">
            <span
              className="mb-4 block text-5xl"
              style={{ color: meta.accent }}
            >
              {meta.emoji}
            </span>

            <p className="font-['Playfair_Display',Georgia,serif] text-3xl">
              No events yet
            </p>

            <p className="mt-3 text-sm text-white/45">
              There are no upcoming {label} events right now.
              Check back soon!
            </p>

            <Link
              to="/events"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm transition hover:border-white/40"
            >
              Browse all events ↗
            </Link>
          </div>
        ) : (
          <>
            <SlimFilters
              filters={filters}
              onUpdate={updateFilter}
              onReset={resetFilters}
              search={search}
              onSearch={setSearch}
              searchPlaceholder={`Search ${label} events…`}
            />

            <EventGrid
              events={pageEvents}
              loading={false}
            />

            {filtered.length === 0 && (
              <div className="mx-auto max-w-md px-5 py-16 text-center">
                <p className="text-sm text-white/50">
                  No events match your filters.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 text-sm text-[#d5b68a] underline underline-offset-4"
                >
                  Reset filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {/* 3. Other Categories */}
      <OtherCategories currentSlug={slug} />

      {/* 4. Footer */}
      <Footer />
    </main>
  );
}
