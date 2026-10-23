import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

function getEventPrice(event) { return Number(event.price ?? event.ticketPrice ?? 0); }

/**
 * Auto-cycling hero carousel showing the top upcoming events.
 * Props: { events }  – array of event objects (up to 5 recommended)
 */
export default function FeaturedHero({ events }) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = useCallback((next) => {
    if (animating || next === active) return;
    setAnimating(true);
    setTimeout(() => { setActive(next); setAnimating(false); }, 300);
  }, [animating, active]);

  useEffect(() => {
    const id = setInterval(() => go((active + 1) % events.length), 5000);
    return () => clearInterval(id);
  }, [active, events.length, go]);

  if (!events.length) return null;
  const ev = events[active];
  const dateStr = ev.eventDate
    ? new Date(ev.eventDate).toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric" })
    : ev.date || "";

  return (
    <section className="relative isolate overflow-hidden bg-[#090909]" aria-label="Featured upcoming events">
      <div className={`absolute inset-0 transition-opacity duration-700 ${animating ? "opacity-0" : "opacity-100"}`}>
        <img src={ev.image || ev.imageUrl} alt="" aria-hidden="true"
          className="h-full w-full object-cover object-center brightness-[0.35] saturate-[0.6]" />
      </div>
      <div className="absolute inset-0 bg-linear-to-r from-[#090909]/95 via-[#090909]/65 to-[#090909]/15" />
      <div className="absolute inset-0 bg-linear-to-t from-[#090909] via-transparent to-[#090909]/30" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 pb-16 pt-28 sm:px-10 sm:pb-20 sm:pt-32 lg:px-16 lg:pt-36">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className={`transition-all duration-500 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#d5b68a]/40 bg-[#d5b68a]/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#d5b68a]">
                {ev.category}
              </span>
              {ev.format && (
                <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-white/55">
                  {ev.format}
                </span>
              )}
            </div>
            <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2.2rem,5.5vw,4.8rem)] font-normal leading-[1.05] tracking-[-0.03em] text-[#f7f3ed]">
              {ev.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#aaa8a2] sm:text-base">
              {ev.description?.slice(0, 180)}{ev.description?.length > 180 ? "…" : ""}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-white/60">
              {dateStr && <span className="flex items-center gap-2"><span className="text-[#d5b68a]">📅</span>{dateStr} · {ev.time}</span>}
              {ev.venue && <span className="flex items-center gap-2"><span className="text-[#d5b68a]">📍</span>{ev.venue}</span>}
              {ev.organizer && <span className="flex items-center gap-2"><span className="text-[#d5b68a]">♙</span>{ev.organizer}</span>}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={`/events/${ev.id}/book`} target="_blank" rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#d5b68a] px-7 text-sm font-semibold text-[#17120c] transition hover:-translate-y-0.5 hover:bg-[#e8cfa8]">
                Book Tickets <span aria-hidden="true">↗</span>
              </Link>
              <Link to={`/events/${ev.id}`} target="_blank" rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10">
                View Details
              </Link>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="hidden lg:block">
            <p className="mb-3 text-[9px] uppercase tracking-[0.28em] text-white/35">Featured Events</p>
            <div className="space-y-2.5">
              {events.map((e, idx) => (
                <button key={e.id} type="button" onClick={() => go(idx)} aria-pressed={active === idx}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${
                    active === idx
                      ? "border-[#d5b68a]/50 bg-white/[0.07]"
                      : "border-white/8 bg-white/2 hover:border-white/20 hover:bg-white/5"
                  }`}>
                  <img src={e.image || e.imageUrl} alt="" className="h-14 w-20 shrink-0 rounded-xl object-cover brightness-75" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-[#f5f2ec]">{e.title}</p>
                    <p className="mt-1 truncate text-[10px] text-white/45">{e.venue}</p>
                    <p className="mt-1 text-[10px] text-[#d5b68a]">
                      {getEventPrice(e) === 0 ? "Free" : `₹${getEventPrice(e).toLocaleString("en-IN")}`}
                    </p>
                  </div>
                  {active === idx && <div className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#d5b68a]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile dots */}
        <div className="mt-8 flex items-center gap-2 lg:hidden">
          {events.map((_, idx) => (
            <button key={idx} type="button" onClick={() => go(idx)} aria-label={`Go to event ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${active === idx ? "w-8 bg-[#d5b68a]" : "w-1.5 bg-white/25"}`} />
          ))}
        </div>

        {/* Price badge */}
        <div className={`absolute right-5 top-28 sm:right-10 sm:top-32 lg:right-16 lg:top-36 transition-all duration-500 ${animating ? "opacity-0" : "opacity-100"}`}>
          <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-center backdrop-blur-xl">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">From</p>
            <p className="mt-1 font-['Playfair_Display',Georgia,serif] text-2xl text-[#d5b68a]">
              {getEventPrice(ev) === 0 ? "Free" : `₹${getEventPrice(ev).toLocaleString("en-IN")}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
