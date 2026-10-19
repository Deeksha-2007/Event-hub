
import React from "react";

function Navbar() {
  const handleSearch = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = formData.get("event-search")?.toString().trim();

    if (query) {
      window.location.href = `/events?search=${encodeURIComponent(query)}`;
    }
  };

  return (
    <header className="absolute left-[4%] right-[4%] top-5 z-10 grid grid-cols-2 items-center gap-3 md:grid-cols-[1fr_minmax(170px,240px)_auto] md:gap-3.5 lg:grid-cols-[1fr_minmax(200px,300px)_1fr_auto] lg:gap-5.5">
      {/* Brand */}
      <a
        href="/"
        className="inline-flex w-fit items-center gap-2.25"
        aria-label="Event Hub home"
      >
        <span
          className="grid grid-cols-2 gap-0.75 transform:rotate(-8deg)"
          aria-hidden="true"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <span
              key={index}
              className="h-1.25 w-1.25 rounded-[1px] bg-[#f6f4f0]"
            />
          ))}
        </span>

        <span className="text-[17px] font-semibold tracking-[-0.7px] text-[#f6f4f0] lg:text-base">
          Event-hub<span className="text-[#d5b68a]">.</span>
        </span>
      </a>

      {/* Search */}
      <form
        role="search"
        onSubmit={handleSearch}
        className="col-span-2 row-start-2 flex h-10 min-w-0 items-center gap-2.5 rounded-full border border-white/17 bg-white/9 px-3.25 backdrop-blur-[18px] transition-colors focus-within:border-white/50 focus-within:bg-white/13 md:col-span-1 md:col-start-2 md:row-start-1 md:px-3.25"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="h-4 w-4 shrink-0 stroke-[#d0d0d0] stroke-[1.7]"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 4 4" />
        </svg>

        <input
          type="search"
          name="event-search"
          placeholder="Find your next experience..."
          aria-label="Search events"
          className="min-w-0 w-full bg-transparent text-xs text-white outline-none placeholder:text-[#b4b4b4]"
        />

        <span className="text-[13px] text-[#b7b7b7]" aria-hidden="true">
          ↵
        </span>
      </form>

      {/* Main navigation */}
      <nav
        className="hidden items-center justify-center gap-1 md:flex"
        aria-label="Main navigation"
      >
        <a
          className="rounded-full bg-white/11 px-3 py-2.5 text-xs text-white transition-colors hover:bg-white/11"
          href="/"
          aria-current="page"
        >
          Home
        </a>

        <a
          className="whitespace-nowrap rounded-full px-3 py-2.5 text-xs text-[#d0d0d0] transition-colors hover:bg-white/11 hover:text-white"
          href="/events"
        >
          Explore
        </a>

        <a
          className="whitespace-nowrap rounded-full px-3 py-2.5 text-xs text-[#d0d0d0] transition-colors hover:bg-white/11 hover:text-white"
          href="/my-bookings"
        >
          My Bookings
        </a>
      </nav>

      {/* Authentication */}
      <div className="col-start-2 row-start-1 flex items-center justify-end gap-3 md:col-start-3 lg:col-start-4 lg:gap-4">
        <a
          href="/login"
          className="whitespace-nowrap text-xs text-[#e1e1e1] transition-colors hover:text-white"
        >
          Log in
        </a>

        <a
          href="/register"
          className="inline-flex min-h-8.75 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-[#f6f4f0] px-3.25 text-xs font-semibold text-[#151515]! transition hover:-translate-y-px hover:bg-white lg:min-h-9.25 lg:px-3.75"
        >
          Sign up <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}

export default Navbar;
