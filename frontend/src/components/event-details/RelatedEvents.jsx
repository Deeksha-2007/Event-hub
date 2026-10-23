import React from "react";
import { Link } from "react-router-dom";
import { mockEvents } from "../../data/mockdata";
import { formatDate } from "../../../utils/formatters";

/**
 * "You Might Also Like" section at the bottom of EventDetails.
 * Shows related or other upcoming events, each opening in a new tab.
 * Props: { currentId, category }
 */
export default function RelatedEvents({ currentId, category }) {
  const related = React.useMemo(() => {
    const same  = mockEvents.filter(e => e.id !== currentId && e.category === category);
    const other = mockEvents.filter(e => e.id !== currentId && e.category !== category);
    return [...same, ...other].slice(0, 4);
  }, [currentId, category]);

  if (!related.length) return null;

  return (
    <section className="border-t border-white/8 bg-[#090909] px-5 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1600px]">
        <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#d5b68a]">DISCOVER MORE</p>
        <h2 className="mb-8 font-['Playfair_Display',Georgia,serif] text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal tracking-[-0.03em] text-[#f5f2ec]">
          You Might Also Like
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map(ev => {
            const price = Number(ev.price ?? ev.ticketPrice ?? 0);
            const dateStr = ev.eventDate
              ? formatDate(ev.eventDate, { day:"numeric", month:"short", year:"numeric" })
              : ev.date || "";
            return (
              <article key={ev.id} className="group min-w-0">
                <Link to={`/events/${ev.id}`} target="_blank" rel="noreferrer"
                  className="relative block aspect-4/3 overflow-hidden rounded-2xl bg-[#17151b]">
                  <img src={ev.image || ev.imageUrl} alt={ev.title} loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/10" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-white backdrop-blur-md">
                    {ev.category}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-[#f5f2ec] px-2.5 py-1 text-[10px] font-semibold text-[#17120c]">
                    {price <= 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`}
                  </span>
                </Link>
                <div className="pt-3">
                  <h3 className="line-clamp-2 font-['Playfair_Display',Georgia,serif] text-lg leading-snug text-[#f5f2ec] transition-colors group-hover:text-[#d5b68a]">
                    <Link to={`/events/${ev.id}`} target="_blank" rel="noreferrer">{ev.title}</Link>
                  </h3>
                  <p className="mt-1.5 text-xs text-white/45">{dateStr} · {ev.venue || ev.location}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Link to={`/events/${ev.id}/book`} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#d5b68a]/15 px-4 py-2 text-xs font-medium text-[#d5b68a] transition hover:bg-[#d5b68a]/25">
                      Book Tickets ↗
                    </Link>
                    <Link to={`/events/${ev.id}`} target="_blank" rel="noreferrer"
                      className="text-xs text-white/40 transition hover:text-white">
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}