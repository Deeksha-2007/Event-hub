
export default function EventHero() {
  return (
    <section className="relative isolate flex min-h-145 items-center justify-center overflow-hidden bg-[#08060e] sm:min-h-162.5 lg:min-h-175">

      {/* Background image — unchanged */}
      <img
        src="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=2400&q=90"
        alt="Live concert illuminated by purple stage lights"
        className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
      />

      {/* Cinematic overlays */}
      <div className="absolute inset-0 -z-20 bg-black/40" />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,rgba(126,54,255,0.22),transparent_55%)]" />

      <div className="absolute inset-0 -z-10 bg-linear-to-b from-[#08060e]/45 via-transparent to-[#08060e]/85" />

      {/* Centered typography */}
      <div className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-20 text-center sm:px-8 sm:pt-24 lg:px-16">

        <div className="mx-auto max-w-350">

          <p className="mb-2 font-serif text-[clamp(2.5rem,6.5vw,6.5rem)] font-normal leading-[0.95] tracking-[-0.045em] text-[#f7f3ed] sm:mb-3">
            FIND YOUR NEXT
          </p>

          <h1 className="font-serif text-[clamp(4rem,12vw,11.5rem)] font-normal italic leading-[0.86] tracking-[-0.055em] text-[#d9b88c]">
            EXPERIENCE<span className="not-italic">.</span>
          </h1>

          {/* Decorative line */}
          <div className="mx-auto mt-7 h-px w-20 bg-linear-to-r from-transparent via-[#d9b88c] to-transparent sm:mt-9 sm:w-28" />

          {/* Centered CTA */}
          <a
            href="#event-categories"
            className="group mt-7 inline-flex items-center gap-5 rounded-full border border-white/40 bg-black/10 px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-sm transition-all duration-300 hover:border-[#d9b88c] hover:bg-[#d9b88c] hover:text-[#100d12] sm:mt-8 sm:px-9 sm:py-4"
          >
            Explore Events
            <span className="text-base transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </a>

        </div>
      </div>

      {/* Bottom-left brand caption */}
      <p className="absolute bottom-7 left-5 text-[9px] font-medium uppercase tracking-[0.25em] text-[#d9b88c]/90 sm:bottom-9 sm:left-10 sm:text-[10px] sm:tracking-[0.35em] lg:left-16">
        EVENT HUB <span className="mx-2 text-white/40">·</span>
        EXPERIENCES THAT MATTER
      </p>

      {/* Bottom-right caption */}
      <div className="absolute bottom-7 right-5 hidden items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-white/55 sm:flex sm:bottom-9 sm:right-10 lg:right-16">
        <span className="h-px w-6 bg-[#d9b88c]/70" />
        Discover · Connect · Experience
      </div>

    </section>
  );
}
