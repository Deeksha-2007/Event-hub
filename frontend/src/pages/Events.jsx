import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/common/navbar";
import EventGrid from "../components/events/EventGrid";
import Pagination from "../components/events/Pagination";
import FeaturedHero from "../components/events/FeaturedHero";
import CategorySection from "../components/events/CategorySection";
import SlimFilters, { INITIAL_FILTERS } from "../components/events/SlimFilters";
import Footer from "../components/common/footer";
import { eventService } from "../services/api";
// Keep categoryToSlug for URL navigation; FeaturedHero now uses real API events
import { categoryToSlug } from "../data/mockdata";

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

// ─── Normalize a backend event to match the shape expected by EventGrid ───────
export function normalizeEvent(e) {
  const venue = e.Venue ? `${e.Venue.name}${e.Venue.city ? ', ' + e.Venue.city : ''}` : '';
  const lowestPrice =
    e.TicketType && e.TicketType.length > 0
      ? Math.min(...e.TicketType.map((t) => t.price))
      : 0;

  return {
    ...e,
    // Image
    image: e.bannerUrl || '',
    imageUrl: e.bannerUrl || '',
    // Dates
    eventDate: e.startDate || '',
    date: e.startDate ? e.startDate.split('T')[0] : '',
    // Venue / location
    venue,
    location: e.Venue?.city || '',
    // Organizer
    organizer: e.User?.name || '',
    // Capacity
    capacity: e.totalCapacity,
    // Price
    price: lowestPrice,
    ticketPrice: lowestPrice,
    // Ticket types — map to the shape the booking flow expects
    ticketTypes: (e.TicketType || []).map((t) => ({
      ...t,
      available: t.availableQuantity,
      total: t.totalQuantity,
    })),
  };
}

// ─── Client-side helpers for filters not supported by the backend ─────────────
function getEventPrice(event) {
  return Number(event.price ?? event.ticketPrice ?? 0);
}

function matchesDate(event, sel) {
  if (sel === "Any date") return true;
  const v = event.eventDate || event.date;
  if (!v) return false;
  const ed = new Date(v);
  ed.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (sel === "Today") return ed.getTime() === today.getTime();
  const tom = new Date(today);
  tom.setDate(today.getDate() + 1);
  if (sel === "Tomorrow") return ed.getTime() === tom.getTime();
  if (sel === "This Weekend") {
    const sat = new Date(today);
    sat.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7));
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    return ed >= sat && ed <= sun;
  }
  if (sel === "This Week") {
    const eow = new Date(today);
    eow.setDate(today.getDate() + (7 - today.getDay()) % 7);
    return ed >= today && ed <= eow;
  }
  return true;
}

// ─── Organizer CTA ────────────────────────────────────────────────────────────
function OrganizerCTA() {
  return (
    <section className="bg-[#090909] px-5 pb-20 pt-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0e0b14] p-10 sm:p-14 lg:p-16">
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 -translate-y-1/2 translate-x-1/3 rounded-full bg-[#d5b68a]/8 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-56 w-56 translate-y-1/2 rounded-full bg-[#7e36ff]/8 blur-3xl" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#d5b68a]">FOR EVENT ORGANISERS</p>
              <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4vw,3.5rem)] font-normal leading-tight tracking-[-0.04em] text-[#f5f2ec]">
                Host your event<br /><em className="italic text-[#aaa49d]">on EventNest.</em>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-[#aaa8a2]">
                Reach thousands of experience-seekers in Delhi NCR and beyond. Manage tickets, track attendance and grow your audience — all from one clean dashboard.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {["Free to list", "Real-time analytics", "Simple ticket management"].map((f) => (
                  <span key={f} className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d5b68a]" />{f}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/organizer"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#f6f4f0] px-8 text-sm font-semibold text-[#151515] whitespace-nowrap transition hover:-translate-y-0.5 hover:bg-white">
                Go to Organizer Dashboard <span aria-hidden="true">↗</span>
              </Link>
              <a href="#explore-all"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm text-white/70 whitespace-nowrap transition hover:border-white/40 hover:text-white">
                Browse Events Instead
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ExploreEvents() {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Backend state
  const [rawEvents, setRawEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Featured hero uses the first 5 real backend events so links use real UUIDs.
  // Falls back to empty array (hero is hidden) until events load.
  const featuredEvents = useMemo(() => rawEvents.slice(0, 5), [rawEvents]);

  // Parse URL search param on initial load
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("search") || "";
    setSearch(q);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect category query param to category page
  useEffect(() => {
    const cat = new URLSearchParams(location.search).get("category");
    if (cat) navigate(`/events/category/${categoryToSlug(cat)}`, { replace: true });
  }, [location.search, navigate]);

  // ─── Fetch events from backend ──────────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build sort params from filters.sort
      let sortBy = 'startDate';
      let sort = 'asc';
      if (filters.sort === 'Newest') {
        sortBy = 'startDate';
        sort = 'desc';
      }

      const params = {
        page: currentPage,
        limit: PAGE_SIZE,
        sortBy,
        sort,
      };

      if (search.trim()) params.search = search.trim();
      if (filters.category && filters.category !== 'All') params.category = filters.category;

      const res = await eventService.getAll(params);
      const { events = [], pagination = {} } = res.data?.data || {};
      setRawEvents(events.map(normalizeEvent));
      setTotalPages(pagination.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events. Please try again.');
      setRawEvents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, filters.sort, filters.category]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Reset to page 1 when filters/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, search]);

  // ─── Client-side filtering for params the backend doesn't handle ────────────
  const pageEvents = useMemo(() => {
    return rawEvents.filter((event) => {
      const loc = (event.location || event.venue || '').toLowerCase();
      const price = getEventPrice(event);

      const matchLoc =
        filters.location === "All locations" ||
        loc.includes(filters.location.toLowerCase());

      const matchPrice =
        filters.price === "Any price" ||
        (filters.price === "Free" && price === 0) ||
        (filters.price === "Paid" && price > 0) ||
        (filters.price === "Under ₹500" && price > 0 && price < 500) ||
        (filters.price === "₹500 and above" && price >= 500);

      const matchFormat =
        filters.format === "All formats" ||
        (event.format || "").toLowerCase() === filters.format.toLowerCase();

      return matchLoc && matchPrice && matchFormat && matchesDate(event, filters.date);
    });
  }, [rawEvents, filters]);

  function updateFilter(key, val) {
    setFilters((prev) => ({ ...prev, [key]: val }));
  }

  function resetFilters() {
    setFilters({ ...INITIAL_FILTERS });
    setSearch("");
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
      <Navbar />

      {/* 1. Featured Hero (uses mock data — decorative only) */}
      {featuredEvents.length > 0 && <FeaturedHero events={featuredEvents} />}

      {/* 2. Explore by Category */}
      <CategorySection />

      {/* Divider */}
      <div className="mx-auto max-w-[1600px] border-t border-white/8 px-5 sm:px-10 lg:px-16" />

      {/* 3. Explore All Events */}
      <section id="explore-all" className="pt-10">
        <div className="mx-auto max-w-[1600px] px-5 pb-4 sm:px-10 lg:px-16">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#d5b68a]">DISCOVER MORE</p>
          <h2 className="mt-2 font-['Playfair_Display',Georgia,serif] text-[clamp(1.8rem,3.5vw,3rem)] font-normal tracking-[-0.03em] text-[#f5f2ec]">
            Explore All Events
          </h2>
        </div>

        <SlimFilters
          filters={filters}
          onUpdate={updateFilter}
          onReset={resetFilters}
          search={search}
          onSearch={setSearch}
        />

        {/* Error state */}
        {error && !loading && (
          <div className="mx-auto max-w-[1600px] px-5 pb-4 sm:px-10 lg:px-16">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
              {error}
              <button
                onClick={fetchEvents}
                className="ml-4 underline underline-offset-2 hover:text-red-300"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <EventGrid events={pageEvents} loading={loading} />

        {!loading && !error && pageEvents.length === 0 && (
          <div className="mx-auto max-w-md px-5 py-16 text-center">
            <p className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#f5f2ec]">No events found</p>
            <p className="mt-2 text-sm text-white/50">Try adjusting your filters or search query.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 text-sm text-[#d5b68a] underline underline-offset-4"
            >
              Reset filters
            </button>
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </section>

      {/* 4. Organizer CTA */}
      <OrganizerCTA />

      {/* 5. Footer */}
      <Footer />
    </main>
  );
}
