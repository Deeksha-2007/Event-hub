
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

import { getEventsByCategory, slugToLabel } from "../data/mockdata";

const PAGE_SIZE = 8;

function getPrice(event) {
  return Number(event.price ?? event.ticketPrice ?? 0);
}

function matchDate(event, selectedDate) {
  if (selectedDate === "Any date") return true;

  const value = event.eventDate || event.date;
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

export default function CategoryEventsPage() {
  const { slug } = useParams();
  const label = slugToLabel(slug);
  const meta = CATEGORY_META[slug] || { ...DEFAULT_META, label };

  const allEvents = useMemo(
    () => getEventsByCategory(slug),
    [slug]
  );

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = allEvents.filter((event) => {
      const title = (event.title || "").toLowerCase();
      const location = (event.location || event.venue || "").toLowerCase();
      const description = (event.description || "").toLowerCase();
      const price = getPrice(event);

      const matchesSearch =
        !query || `${title} ${location} ${description}`.includes(query);

      const matchesLocation =
        filters.location === "All locations" ||
        location.includes(filters.location.toLowerCase());

      const matchesPrice =
        filters.price === "Any price" ||
        (filters.price === "Free" && price === 0) ||
        (filters.price === "Paid" && price > 0) ||
        (filters.price === "Under ₹500" && price > 0 && price < 500) ||
        (filters.price === "₹500 and above" && price >= 500);

      const matchesFormat =
        filters.format === "All formats" ||
        (event.format || "").toLowerCase() === filters.format.toLowerCase();

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
          new Date(b.eventDate || b.date || 0) -
          new Date(a.eventDate || a.date || 0)
      );
    }

    if (filters.sort === "Price: Low to High") {
      result = [...result].sort((a, b) => getPrice(a) - getPrice(b));
    }

    return result;
  }, [allEvents, filters, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageEvents = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const updateFilter = (key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ ...INITIAL_FILTERS });
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
      <Navbar />

      <CategoryHero meta={meta} eventCount={allEvents.length} />

      <div id="events-grid">
        {allEvents.length === 0 ? (
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
              There are no {label} events right now. Check back soon!
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

            <EventGrid events={pageEvents} loading={false} />

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

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <OtherCategories currentSlug={slug} />

      <Footer />
    </main>
  );
}
