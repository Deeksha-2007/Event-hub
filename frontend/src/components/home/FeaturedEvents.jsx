
import React from "react";

const featuredEvents = [
  {
    id: 1,
    category: "MUSIC",
    title: "The After Hours",
    location: "New Delhi",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=85",
    position: "left",
  },
  {
    id: 2,
    category: "TECHNOLOGY",
    title: "Future Forward",
    location: "Gurugram",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=85",
    position: "top-left",
  },
  {
    id: 3,
    category: "CREATIVE",
    title: "Ideas in Motion",
    location: "Noida",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=85",
    position: "top-right",
  },
  {
    id: 4,
    category: "CULTURE",
    title: "The Gathering",
    location: "New Delhi",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=85",
    position: "bottom-left",
  },
  {
    id: 5,
    category: "LIFESTYLE",
    title: "Creative Nights",
    location: "Delhi NCR",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=700&q=85",
    position: "bottom-right",
  },
  {
    id: 6,
    category: "EXPERIENCE",
    title: "Beyond Ordinary",
    location: "Gurugram",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85",
    position: "right",
  },
];

const desktopPositions = {
  left: "lg:col-start-1 lg:row-start-1 lg:row-span-2",
  "top-left": "lg:col-start-2 lg:row-start-1",
  "top-right": "lg:col-start-3 lg:row-start-1",
  "bottom-left": "lg:col-start-2 lg:row-start-2",
  "bottom-right": "lg:col-start-3 lg:row-start-2",
  right: "lg:col-start-4 lg:row-start-1 lg:row-span-2",
};

function FeaturedEvents() {
  return (
    <section
      id="featured-events"
      className="bg-[#090909] px-[5%] pb-8 pt-8 text-[#f5f2ec] md:px-[4.3%] md:pb-10 md:pt-9"
    >
      {/* Heading */}
      <header className="mb-5 flex items-end justify-between gap-4 sm:mb-6 md:mb-7">
        <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(27px,3.6vw,47px)] font-normal leading-tight tracking-[-1.4px]">
          Find your <em className="text-[#aaa69e]">next thing.</em>
        </h2>

        <a
          href="/events"
          className="inline-flex shrink-0 items-center gap-2 pb-1 text-[10px] text-[#d4d0c8] transition-colors hover:text-white sm:text-xs"
        >
          All events <span className="text-base">↗</span>
        </a>
      </header>

      {/* Desktop: large left + 2x2 center + large right */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:h-[min(36vw,600px)] lg:grid-cols-[1.55fr_1fr_1fr_1.55fr] lg:grid-rows-2 lg:gap-3">
        {featuredEvents.map((event, index) => {
          const isLarge =
            event.position === "left" || event.position === "right";

          return (
            <a
              key={event.id}
              href={`/events/${event.id}`}
              aria-label={`${event.title}, ${event.category}, from ₹${event.price}`}
              className={`group relative isolate block h-47.5 min-w-0 overflow-hidden bg-[#171717] text-white sm:h-57.5 lg:h-auto ${desktopPositions[event.position]} ${
                isLarge ? "col-span-2 lg:col-span-1" : "col-span-1"
              }`}
            >
              <img
                src={event.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 -z-20 h-full w-full object-cover brightness-[0.82] saturate-[0.8] transition duration-500 group-hover:scale-[1.045] group-hover:brightness-95"
              />

              <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/15 via-transparent to-black/84" />

              <span className="absolute left-2.5 top-3 text-[9px] tracking-wider text-white/90 sm:left-3 sm:text-[10px]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full border border-white/65 text-sm transition-colors group-hover:bg-[#f5f2ec] group-hover:text-[#090909] sm:right-3 sm:top-3">
                ↗
              </span>

              <div
                className={`absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 ${
                  isLarge ? "lg:bottom-4 lg:left-4 lg:right-4" : ""
                }`}
              >
                <span className="mb-1.5 block text-[7px] tracking-[1.2px] text-[#d5bd96] sm:text-[8px] sm:tracking-[1.4px]">
                  {event.category}
                </span>

                <h3
                  className={`mb-2 font-['Playfair_Display',Georgia,serif] font-normal leading-tight tracking-[-0.3px] ${
                    isLarge
                      ? "text-xl sm:text-2xl lg:text-[clamp(23px,2.2vw,34px)]"
                      : "text-sm sm:text-base lg:text-[clamp(14px,1.2vw,18px)]"
                  }`}
                >
                  {event.title}
                </h3>

                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-white/35 pt-2 text-[8px] text-white/85 sm:text-[9px]">
                  <span>{event.location}</span>
                  <span className="whitespace-nowrap">
                    From ₹{event.price}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturedEvents;
