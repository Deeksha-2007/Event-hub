
import React from "react";

const categories = [
  {
    id: 1,
    name: "Music",
    description: "Live shows & festivals",
    emoji: "♫",
    gradient: "from-[#52352e] via-[#30211f] to-[#171313]",
    accent: "#e8bb83",
    href: "/events?category=Music",
  },
  {
    id: 2,
    name: "Technology",
    description: "Tech talks & summits",
    emoji: "✦",
    gradient: "from-[#344b5a] via-[#202d37] to-[#12171c]",
    accent: "#b4d8ec",
    href: "/events?category=Technology",
  },
  {
    id: 3,
    name: "Workshops",
    description: "Learn something new",
    emoji: "✎",
    gradient: "from-[#5b4634] via-[#30251e] to-[#171311]",
    accent: "#e9c49a",
    href: "/events?category=Workshops",
  },
  {
    id: 4,
    name: "Food & Culture",
    description: "Taste & discover",
    emoji: "✳",
    gradient: "from-[#62502e] via-[#352a1c] to-[#19140f]",
    accent: "#edca83",
    href: "/events?category=Food%20%26%20Culture",
  },
  {
    id: 5,
    name: "Social",
    description: "Meet your people",
    emoji: "◌",
    gradient: "from-[#55363e] via-[#302126] to-[#171214]",
    accent: "#e6b0b0",
    href: "/events?category=Social",
  },
  {
    id: 6,
    name: "Adventure",
    description: "Outdoor experiences",
    emoji: "△",
    gradient: "from-[#31514e] via-[#20312f] to-[#111716]",
    accent: "#b5d8ce",
    href: "/events?category=Adventure",
  },
];

function EventCategories() {
  return (
    <section
      id="event-categories"
      className="bg-[#090909] px-[5%] py-12 text-[#f5f2ec] sm:py-14 lg:px-[4.3%] lg:py-16"
    >
      {/* Section heading */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-10">
        <div>
          <p className="mb-3 text-[10px] font-medium tracking-[2px] text-[#aaa49a] sm:text-[11px]">
            EXPLORE BY INTEREST
          </p>

          <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(34px,4.5vw,54px)] font-medium leading-tight tracking-[-1.5px]">
            Find your <em className="text-[#aaa49d]">scene.</em>
          </h2>
        </div>

        <a
          href="/events"
          className="inline-flex w-fit items-center gap-2 pb-1 text-xs text-[#d0cbc2] transition hover:text-white sm:text-sm"
        >
          All categories <span aria-hidden="true">↗</span>
        </a>
      </header>

      {/* Category cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-5">
        {categories.map((category, index) => (
          <a
            key={category.id}
            href={category.href}
            className="group relative flex min-h-87.5 flex-col overflow-hidden border border-white/12 bg-[#090909] p-3.5 transition duration-300 hover:-translate-y-1 hover:border-[#c7a779]/60 hover:shadow-[0_12px_35px_rgba(0,0,0,0.35)] sm:min-h-97.5 sm:p-4 lg:min-h-102.5 lg:p-5"
          >
            {/* Number and arrow */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] tracking-[1px] text-white/55">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-sm text-white/80 transition group-hover:border-[#d5b68a] group-hover:bg-[#d5b68a] group-hover:text-[#111111]">
                ↗
              </span>
            </div>

            {/* Colored gradient directly behind the icon */}
            <div
              className={`relative mt-5 flex min-h-37.5 flex-1 items-center justify-center overflow-hidden border-y border-white/[0.07] bg-linear-to-b ${category.gradient} sm:min-h-43.75 lg:min-h-47.5`}
            >
              {/* Decorative rings */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/9 sm:h-32 sm:w-32"
              />

              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 sm:h-24 sm:w-24"
              />

              {/* Icon */}
              <span
                aria-hidden="true"
                className="relative z-10 select-none text-[68px] font-light transition duration-300 group-hover:scale-110 sm:text-[78px]"
                style={{
                  color: category.accent,
                  textShadow: `0 0 35px ${category.accent}30`,
                }}
              >
                {category.emoji}
              </span>

              {/* Accent line */}
              <span
                aria-hidden="true"
                className="absolute bottom-4 left-1/2 h-px w-12 -translate-x-1/2"
                style={{
                  backgroundColor: `${category.accent}90`,
                }}
              />
            </div>

            {/* Solid black text area */}
            <div className="mt-auto bg-[#090909] pt-5">
              <h3 className="font-['Playfair_Display',Georgia,serif] text-[19px] leading-tight text-[#f5f2ec] sm:text-[21px]">
                {category.name}
              </h3>

              <p className="mt-2 text-[10px] leading-5 text-[#aaa49a] sm:text-[11px]">
                {category.description}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Section footer */}
      <footer className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 text-[9px] tracking-[0.6px] text-[#aaa49a] sm:flex-row sm:items-center sm:justify-between sm:text-[10px]">
        <span>YOUR INTERESTS. YOUR EXPERIENCES.</span>

        <a
          href="/events"
          className="inline-flex w-fit items-center gap-2 transition hover:text-white"
        >
          EXPLORE SOMETHING NEW <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </section>
  );
}

export default EventCategories;
