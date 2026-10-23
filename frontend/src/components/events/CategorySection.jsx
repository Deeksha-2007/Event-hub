import React from "react";
import { Link } from "react-router-dom";

const CATEGORY_CARDS = [
  { slug:"music",          label:"Music",          desc:"Live shows & festivals",  emoji:"♫", gradient:"from-[#52352e] via-[#30211f] to-[#171313]", accent:"#e8bb83" },
  { slug:"technology",     label:"Technology",      desc:"Tech talks & summits",    emoji:"✦", gradient:"from-[#344b5a] via-[#202d37] to-[#12171c]", accent:"#b4d8ec" },
  { slug:"workshops",      label:"Workshops",       desc:"Learn something new",     emoji:"✎", gradient:"from-[#5b4634] via-[#30251e] to-[#171311]", accent:"#e9c49a" },
  { slug:"food-drinks",    label:"Food & Drinks",   desc:"Taste & discover",        emoji:"✳", gradient:"from-[#62502e] via-[#352a1c] to-[#19140f]", accent:"#edca83" },
  { slug:"business",       label:"Business",        desc:"Network & grow",          emoji:"◈", gradient:"from-[#31514e] via-[#20312f] to-[#111716]", accent:"#b5d8ce" },
  { slug:"entertainment",  label:"Entertainment",   desc:"Shows & experiences",     emoji:"◌", gradient:"from-[#55363e] via-[#302126] to-[#171214]", accent:"#e6b0b0" },
  { slug:"wellness",       label:"Wellness",        desc:"Mind, body & spirit",     emoji:"△", gradient:"from-[#3b4d2a] via-[#252f1c] to-[#131710]", accent:"#c4d89e" },
];

/**
 * Explore-by-Category grid shown on the Explore Events page.
 * Each card navigates to /events/category/:slug.
 */
export default function CategorySection() {
  return (
    <section id="explore-by-category" className="bg-[#090909] px-5 py-14 sm:px-10 lg:px-16">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[2px] text-[#aaa49a]">
            EXPLORE BY INTEREST
          </p>
          <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4vw,3.5rem)] font-normal leading-tight tracking-[-0.04em] text-[#f5f2ec]">
            Find your <em className="italic text-[#aaa49d]">scene.</em>
          </h2>
        </div>
        <a href="#explore-all" className="inline-flex items-center gap-2 text-xs text-[#d0cbc2] transition hover:text-white">
          All events <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-7 lg:gap-4">
        {CATEGORY_CARDS.map((cat, i) => (
          <Link
            key={cat.slug}
            to={`/events/category/${cat.slug}`}
            className="group relative flex min-h-72 flex-col overflow-hidden border border-white/10 bg-[#0e0e0e] p-3.5 transition duration-300 hover:-translate-y-1 hover:border-[#c7a779]/50 hover:shadow-[0_12px_35px_rgba(0,0,0,0.5)] sm:p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] tracking-[1px] text-white/45">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-xs text-white/70 transition group-hover:border-[#d5b68a] group-hover:bg-[#d5b68a] group-hover:text-[#111]">↗</span>
            </div>
            <div className={`relative mt-4 flex min-h-28 flex-1 items-center justify-center overflow-hidden border-y border-white/6 bg-linear-to-b ${cat.gradient}`}>
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8" />
              <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
              <span
                className="relative z-10 select-none text-[56px] font-light transition duration-300 group-hover:scale-110"
                style={{ color: cat.accent, textShadow: `0 0 30px ${cat.accent}25` }}
              >
                {cat.emoji}
              </span>
            </div>
            <div className="mt-auto pt-3">
              <h3 className="font-['Playfair_Display',Georgia,serif] text-[16px] leading-tight text-[#f5f2ec]">
                {cat.label}
              </h3>
              <p className="mt-1 text-[10px] leading-5 text-[#aaa49a]">{cat.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
