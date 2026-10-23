import { useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/footer";
import { getBookings } from "../data/booking";
import BookingCard from "../components/MyBookings/BookingCard";

export default function MyBookingsPage() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const bookings = useMemo(() => {
    try { return getBookings(); } catch { return []; }
  }, []);

  const upcoming = bookings.filter(b => {
    const d = b.event?.date;
    return !d || new Date(d) >= new Date();
  });
  const past = bookings.filter(b => {
    const d = b.event?.date;
    return d && new Date(d) < new Date();
  });

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
        <Navbar />
        <div className="flex min-h-[75vh] flex-col items-center justify-center gap-6 px-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 text-2xl text-[#d5b68a]">▤</div>
          <p className="font-['Playfair_Display',Georgia,serif] text-3xl text-[#f5f2ec]">Sign in to view bookings</p>
          <p className="max-w-sm text-sm text-white/45">Log in to your account to see your upcoming and past event bookings.</p>
          <div className="flex gap-3">
            <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-[#d5b68a] px-7 py-3 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8]">Log in</Link>
            <Link to="/events" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm text-white/70 transition hover:border-white/40">Explore Events</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
      <Navbar />

      <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-28 sm:px-10 sm:pt-32 lg:px-16">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#d5b68a]">YOUR ACCOUNT</p>
            <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4vw,3.5rem)] font-normal tracking-[-0.03em] text-[#f5f2ec]">
              My Bookings
            </h1>
          </div>
          <Link to="/events" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/60 transition hover:border-white/30 hover:text-white">
            Explore Events ↗
          </Link>
        </div>

        {/* Demo notice */}
        {bookings.some(b => b.isDemoRecord) && (
          <div className="mb-8 rounded-2xl border border-[#d5b68a]/20 bg-[#d5b68a]/5 px-5 py-4 text-xs text-[#d5b68a]/70">
            ℹ️ Bookings marked <strong>Sample</strong> are pre-filled demo records. Complete a checkout to see your own booking appear here.
          </div>
        )}

        {/* Upcoming */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#f5f2ec]">Upcoming</h2>
            <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/35">{upcoming.length}</span>
          </div>
          {upcoming.length === 0 ? (
            <div className="rounded-3xl border border-white/8 bg-white/15 px-6 py-14 text-center">
              <p className="font-['Playfair_Display',Georgia,serif] text-xl text-[#f5f2ec]">No upcoming bookings</p>
              <p className="mt-2 text-sm text-white/40">Your confirmed bookings will appear here.</p>
              <Link to="/events" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d5b68a] px-7 py-3 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8]">
                Find events to book ↗
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map(b => <BookingCard key={b.id} booking={b} />)}
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section>
            <div className="mb-6 flex items-center gap-3">
              <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#f5f2ec]">Past</h2>
              <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/35">{past.length}</span>
            </div>
            <div className="space-y-4">
              {past.map(b => <BookingCard key={b.id} booking={b} />)}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
