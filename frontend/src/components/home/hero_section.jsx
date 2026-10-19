
import React from "react";

const heroImages = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=85",
    alt: "Elegant event gathering",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=85",
    alt: "Live music concert",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=85",
    alt: "Friends enjoying an event",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=85",
    alt: "Concert lights and music",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=85",
    alt: "Crowd at a live music event",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=85",
    alt: "People gathered at a venue",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=85",
    alt: "Outdoor live event",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=85",
    alt: "Live performance",
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1492681290082-e932832941e6?auto=format&fit=crop&w=600&q=85",
    alt: "People celebrating together",
  },
];

const tilePositions = [
  "col-start-1 row-start-1 md:col-start-1 md:row-start-1 md:col-span-2",
  "col-start-3 row-start-1 md:col-start-5 md:row-start-1 md:col-span-2",
  "col-start-2 row-start-1 translate-y-6 md:col-start-3 md:row-start-2 md:translate-y-0 md:col-span-2",
  "col-start-1 row-start-2 md:col-start-1 md:row-start-3 md:col-span-2",
  "col-start-3 row-start-2 md:col-start-5 md:row-start-3 md:col-span-2",
  "col-start-2 row-start-2 translate-y-5 md:col-start-3 md:row-start-4 md:translate-y-0 md:col-span-2",
  "col-start-1 row-start-3 md:hidden",
  "col-start-3 row-start-3 md:hidden",
  "col-start-2 row-start-4 md:hidden",
];

function HeroSection() {
  return (
    <section className="relative isolate flex min-h-190 w-full items-center justify-center overflow-hidden bg-[#090909] text-[#f8f6f1] md:h-[min(760px,calc(100svh-24px))] md:min-h-150">
      {/* Background image collage */}
      <div
        aria-hidden="true"
        className="absolute inset-x-[-20%] bottom-16.25 top-31.25 grid grid-cols-3 grid-rows-[repeat(4,minmax(70px,1fr))] gap-5.5 px-[6%] md:inset-0 md:grid-cols-6 md:grid-rows-4 md:gap-x-11.25 md:gap-y-8.75 md:px-[5%] md:pb-8.75 md:pt-17.5"
      >
        {heroImages.map((item, index) => (
          <div
            key={item.id}
            className={`relative min-h-0 min-w-0 overflow-hidden bg-[#171717] ${tilePositions[index]}`}
          >
            <img
              src={item.image}
              alt=""
              loading={item.id <= 3 ? "eager" : "lazy"}
              className="h-full w-full object-cover brightness-75 saturate-[0.8] transition-transform duration-500 hover:scale-[1.06]"
            />
          </div>
        ))}
      </div>

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.48)_0%,rgba(5,5,5,0.64)_58%,rgba(5,5,5,0.88)_100%)] md:bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.28)_0%,rgba(5,5,5,0.52)_42%,rgba(5,5,5,0.72)_100%),linear-gradient(180deg,rgba(5,5,5,0.22)_0%,rgba(5,5,5,0.03)_38%,rgba(5,5,5,0.43)_100%)]"
      />

      {/* Hero content */}
      <div className="relative z-2 mx-auto w-[92%] -translate-y-1 text-center md:mt-6 md:w-[min(850px,90%)]">
        <div className="mb-5.5 inline-flex items-center justify-center gap-2.25 text-[9px] font-medium tracking-[1.5px] text-[#d1d1d1] sm:text-[10px] md:mb-6.25 md:tracking-[2px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d5b68a] shadow-[0_0_12px_rgba(213,182,138,0.45)]" />
          YOUR NEXT EXPERIENCE AWAITS
        </div>

        <h1 className="mx-auto max-w-170 text-balance font-['Playfair_Display',Georgia,serif] text-[clamp(35px,8.2vw,48px)] font-medium leading-[1.12] tracking-[-1.5px] sm:text-[clamp(42px,7vw,58px)] md:max-w-none md:text-[clamp(42px,6.1vw,84px)] md:leading-[1.1] md:tracking-[-3.8px]">
          Bringing you closer to
          <br />
          <span className="font-medium italic text-[#c6c3bd]">
            extraordinary experiences.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-85 text-[13px] leading-[1.8] text-[#c3c1bd] sm:max-w-97.5 md:mt-6 md:max-w-none md:text-sm md:leading-[1.9]">
          Discover events, meet your people, and make
          <br className="hidden md:block" />
          room for stories worth remembering.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 md:mt-7.25">
          <a
            href="/events"
            className="inline-flex min-h-10.5 items-center justify-center gap-2.25 rounded-full bg-[#f6f4f0] px-4 text-[11px] font-medium text-[#151515]! transition hover:-translate-y-0.5 hover:bg-white md:min-h-10.75 md:gap-4.25 md:px-5 md:text-xs"
          >
            Explore events <span aria-hidden="true">↗</span>
          </a>

          <a
            href="#featured-events"
            className="inline-flex min-h-10.5 items-center justify-center rounded-full border border-white/20 bg-white/8 px-4 text-[11px] font-medium text-[#f1f1f1] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15 md:min-h-10.75 md:px-5 md:text-xs"
          >
            Discover more
          </a>
        </div>
      </div>

      {/* Bottom details */}
      <div className="absolute bottom-5 left-[5%] right-[5%] z-3 flex items-center justify-between text-[8px] tracking-[0.8px] text-[#c0c0c0] md:bottom-6.25 md:left-[4%] md:right-[4%] md:text-[9px] md:tracking-[1.2px]">
        <span className="inline-flex items-center gap-2.25">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d5b68a]" />
          EXPERIENCES, ALL IN ONE PLACE
        </span>

        <a
          href="#featured-events"
          className="hidden items-center gap-2.5 whitespace-nowrap text-[#e0e0e0] transition hover:text-white md:inline-flex"
        >
          SCROLL TO EXPLORE <span className="text-[15px]">↓</span>
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
