
import { Link } from "react-router-dom";

export default function CategoryHero({ meta, eventCount }) {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#090909]"
      aria-label={`${meta.label} events`}
    >
      {meta.heroImage && (
        <div className="absolute inset-0">
          <img
            src={meta.heroImage}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center brightness-[0.28] saturate-[0.55]"
          />
        </div>
      )}

      <div className={`absolute inset-0 bg-linear-to-b ${meta.gradient} opacity-75`} />
      <div className="absolute inset-0 bg-linear-to-r from-[#090909]/90 via-[#090909]/50 to-[#090909]/10" />
      <div className="absolute inset-0 bg-linear-to-t from-[#090909] via-transparent to-[#090909]/40" />

      <div
        className="pointer-events-none absolute right-[10%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-[100px]"
        style={{ backgroundColor: `${meta.accent}18` }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-36 lg:px-16 lg:pt-40">
        <Link
          to="/events"
          className="mb-8 inline-flex items-center gap-1.5 text-xs text-white/35 transition hover:text-white"
        >
          ← All Events
        </Link>

        <div className="flex items-end gap-6">
          <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/4 backdrop-blur-md sm:flex lg:h-24 lg:w-24">
            <span
              className="select-none text-[48px] lg:text-[56px]"
              style={{
                color: meta.accent,
                textShadow: `0 0 40px ${meta.accent}40`,
              }}
            >
              {meta.emoji}
            </span>
          </div>

          <div className="min-w-0">
            <p
              className="mb-3 text-[10px] uppercase tracking-[0.28em]"
              style={{ color: meta.accent }}
            >
              CATEGORY
            </p>

            <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2.8rem,6.5vw,5.5rem)] font-normal leading-[0.95] tracking-[-0.04em] text-[#f7f3ed]">
              {meta.label}
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#aaa8a2] sm:text-base">
              {meta.longDesc}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-white/40">
          {[
            `${eventCount} ${eventCount === 1 ? "event" : "events"} available`,
            "Delhi NCR & online",
            "All ticket ranges",
          ].map((text) => (
            <span key={text} className="flex items-center gap-2">
              <span
                className="h-1 w-4 rounded-full"
                style={{ backgroundColor: meta.accent }}
              />
              {text}
            </span>
          ))}
        </div>

        <div className="mt-8">
          <a
            href="#events-grid"
            className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/4 px-6 py-3 text-sm text-white/70 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/8 hover:text-white"
          >
            Browse {meta.label} Events
            <span style={{ color: meta.accent }}>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
