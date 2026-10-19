
import React, { useState } from "react";

const events = [
  {
    id: 7,
    category: "Music",
    title: "Electric Nights",
    date: "24",
    month: "OCT",
    day: "SATURDAY",
    time: "7:00 PM",
    location: "New Delhi",
    venue: "Indira Gandhi Arena",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    id: 8,
    category: "Technology",
    title: "The Future Summit",
    date: "26",
    month: "OCT",
    day: "MONDAY",
    time: "10:00 AM",
    location: "Gurugram",
    venue: "Cyber Hub",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 9,
    category: "Workshops",
    title: "Ideas Into Action",
    date: "29",
    month: "OCT",
    day: "THURSDAY",
    time: "11:30 AM",
    location: "Noida",
    venue: "Creative Studio",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 10,
    category: "Culture",
    title: "A Table of Stories",
    date: "31",
    month: "OCT",
    day: "SATURDAY",
    time: "6:00 PM",
    location: "New Delhi",
    venue: "The Garden House",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 11,
    category: "Social",
    title: "Meet Your People",
    date: "02",
    month: "NOV",
    day: "MONDAY",
    time: "5:00 PM",
    location: "Gurugram",
    venue: "Urban Social Club",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 12,
    category: "Music",
    title: "Beyond The Sound",
    date: "07",
    month: "NOV",
    day: "SATURDAY",
    time: "8:00 PM",
    location: "New Delhi",
    venue: "Open Air Theatre",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=700&q=85",
  },
];

const filters = [
  "All",
  "Music",
  "Technology",
  "Workshops",
  "Culture",
  "Social",
];

function UpcomingEvents() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredEvents =
    activeFilter === "All"
      ? events
      : events.filter((event) => event.category === activeFilter);

  return (
    <section
      id="upcoming-events"
      className="bg-[#090909] px-[5%] py-12 text-[#f5f2ec] md:px-[4.3%] md:py-16"
    >
      {/* Section heading */}
      <header className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end md:mb-9">
        <div>
          <p className="mb-3 text-[10px] font-medium tracking-[2px] text-[#b8b3aa] sm:text-xs">
            SAVE YOUR SPOT
          </p>

          <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(30px,4vw,48px)] font-normal leading-tight tracking-[-1.2px]">
            Coming up <em className="text-[#aaa69e]">next.</em>
          </h2>

          <p className="mt-3 max-w-110 text-sm leading-6 text-[#aaa8a2]">
            Good plans start here. Find your next experience and make it
            memorable.
          </p>
        </div>

        <a
          href="/events"
          className="inline-flex w-fit shrink-0 items-center gap-2 pb-1 text-xs text-[#d4d0c8] transition hover:text-white"
        >
          Explore all events <span aria-hidden="true">↗</span>
        </a>
      </header>

      {/* Working category filters */}
      <div
        className="mb-7 flex gap-2 overflow-x-auto pb-2 sm:mb-8 sm:flex-wrap"
        aria-label="Filter upcoming events by category"
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={isActive}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-xs transition duration-200 ${
                isActive
                  ? "border-[#f5f2ec] bg-[#f5f2ec] font-semibold text-[#151515]"
                  : "border-white/15 bg-transparent text-[#c4c0b8] hover:border-white/40 hover:text-white"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Event cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {filteredEvents.map((event) => (
          <a
            key={event.id}
            href={`/events/${event.id}`}
            className="group min-w-0 overflow-hidden border border-white/10 bg-[#111111] transition duration-300 hover:-translate-y-1 hover:border-white/25"
            aria-label={`${event.title}, ${event.category}, from ₹${event.price}`}
          >
            {/* Image */}
            <div className="relative h-55 overflow-hidden sm:h-57.5 lg:h-62.5">
              <img
                src={event.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover brightness-[0.82] saturate-[0.8] transition duration-500 group-hover:scale-105 group-hover:brightness-100"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-black/20" />

              {/* Date badge */}
              <div className="absolute left-4 top-4 flex min-w-13.5 flex-col items-center bg-[#f5f2ec] px-3 py-2.5 text-[#151515]">
                <span className="text-[22px] font-semibold leading-none">
                  {event.date}
                </span>
                <span className="mt-1 text-[10px] font-semibold tracking-[1px]">
                  {event.month}
                </span>
              </div>

              {/* Category */}
              <span className="absolute bottom-4 left-4 text-[9px] font-medium tracking-[1.7px] text-[#e6c99b]">
                {event.category.toUpperCase()}
              </span>

              {/* Arrow */}
              <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-white/60 text-white transition group-hover:border-white group-hover:bg-white group-hover:text-[#151515]">
                ↗
              </span>
            </div>

            {/* Details */}
            <div className="p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#a9a69f]">
                <span>{event.day}</span>
                <span className="h-1 w-1 rounded-full bg-[#d5b68a]" />
                <span>{event.time}</span>
              </div>

              <h3 className="font-['Playfair_Display',Georgia,serif] text-[22px] font-normal leading-tight tracking-[-0.4px] text-[#f5f2ec] transition group-hover:text-[#e6c99b]">
                {event.title}
              </h3>

              <p className="mt-2 text-xs text-[#aaa8a2]">
                {event.venue}, {event.location}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <div>
                  <span className="block text-[10px] text-[#888780]">
                    TICKETS FROM
                  </span>
                  <span className="mt-1 block text-sm font-medium text-[#f5f2ec]">
                    ₹{event.price}
                  </span>
                </div>

                <span className="text-xs text-[#d5b68a] transition group-hover:translate-x-1">
                  View event →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <p className="py-12 text-center text-sm text-[#aaa8a2]">
          No events found in this category.
        </p>
      )}

      {/* Bottom link */}
      <div className="mt-9 flex justify-center md:mt-11">
        <a
          href="/events"
          className="inline-flex min-h-11.5 items-center justify-center gap-3 rounded-full border border-white/20 px-6 text-xs text-[#f5f2ec] transition hover:border-white/50 hover:bg-white/5"
        >
          Discover all events <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

export default UpcomingEvents;
