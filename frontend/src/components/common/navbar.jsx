
import React, { useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { useBookmarks } from "../../context/BookmarkContext";

function Navbar() {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const { allBookmarks } = useBookmarks();

  // Uses the existing localStorage token for authentication.
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const isHome = location.pathname === "/";
  const isExplore = location.pathname.startsWith("/events");
  const isBookings = location.pathname.startsWith("/my-bookings");
  const isSaved = location.pathname.startsWith("/saved");

  const handleSearch = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = formData.get("event-search")?.toString().trim();

    if (query) {
      window.location.href = `/events?search=${encodeURIComponent(query)}`;
    }
  };

  const navClass = (active) =>
    `whitespace-nowrap rounded-full px-4 py-3 text-sm transition-colors duration-200 ${
      active
        ? "bg-white/10 text-white"
        : "text-[#d0d0d0] hover:bg-white/10 hover:text-white"
    }`;

  const searchValue = isExplore
    ? new URLSearchParams(location.search).get("search") || ""
    : "";

  const savedCount = allBookmarks.length;

  return (
    <header className="absolute left-0 right-0 top-0 z-50 w-full px-5 py-4 sm:px-8 lg:px-8">
      <div className="flex w-full items-center justify-between gap-4">

        {/* Brand: far left */}
        <NavLink
          to="/"
          aria-label="EventNest home"
          className="inline-flex shrink-0 items-center gap-2.5"
        >
          <span
            className="grid -rotate-8 grid-cols-2 gap-1"
            aria-hidden="true"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <span
                key={index}
                className="h-1.5 w-1.5 rounded-[1px] bg-[#f6f4f0]"
              />
            ))}
          </span>

          <span className="text-lg font-semibold tracking-tight text-[#f6f4f0]">
            EventNest
          </span>
        </NavLink>

        {/* Right-side controls */}
        <div className="flex min-w-0 items-center gap-3 lg:gap-5">

          {/* Search */}
          <form
            role="search"
            onSubmit={handleSearch}
            className="hidden h-11 w-65 items-center gap-3 rounded-full border border-white/15 bg-white/[0.07] px-4 backdrop-blur-xl transition-colors focus-within:border-white/35 lg:flex xl:w-87.5"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="h-4.5 w-4.5 shrink-0 stroke-[#c9c9c9] stroke-[1.7]"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              type="search"
              name="event-search"
              defaultValue={searchValue}
              placeholder="Find your next experience..."
              aria-label="Search events"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#b4b4b4]"
            />

            <span
              className="text-sm text-[#b7b7b7]"
              aria-hidden="true"
            >
              ↵
            </span>
          </form>

          {/* Main navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden shrink-0 items-center gap-1 md:flex"
          >
            <NavLink
              to="/"
              end
              className={() => navClass(isHome)}
            >
              Home
            </NavLink>

            <NavLink
              to="/events"
              className={() => navClass(isExplore)}
            >
              Explore
            </NavLink>

            {/* Saved Events link with count badge */}
            <NavLink
              to="/saved"
              className={() => `relative ${navClass(isSaved)}`}
            >
              Saved
              {savedCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d5b68a] px-1 text-[9px] font-bold text-[#17120c]">
                  {savedCount}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Authentication / Profile */}
          <div className="relative flex shrink-0 items-center gap-3 lg:gap-5">
            {!isLoggedIn ? (
              <>
                <NavLink
                  to="/login"
                  className="whitespace-nowrap text-sm text-[#e1e1e1] transition-colors hover:text-white"
                >
                  Log in
                </NavLink>

                <NavLink
                  to="/register"
                  className="inline-flex min-h-10 items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[#f6f4f0] px-5 text-sm font-semibold text-[#151515] transition hover:-translate-y-px hover:bg-white"
                >
                  Sign up
                  <span aria-hidden="true">↗</span>
                </NavLink>
              </>
            ) : (
              <>
                {/* Bookmark icon shortcut */}
                <Link
                  to="/saved"
                  aria-label={`Saved events${savedCount > 0 ? ` (${savedCount})` : ""}`}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" fill={savedCount > 0 ? "currentColor" : "none"} className={`h-5 w-5 stroke-current stroke-[1.7] ${savedCount > 0 ? "text-[#d5b68a]" : ""}`}>
                    <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />
                  </svg>
                  {savedCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d5b68a] px-1 text-[9px] font-bold text-[#17120c]">
                      {savedCount}
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="h-5 w-5 stroke-current stroke-[1.7]"
                  >
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 20c.5-3.5 3.2-5.5 7-5.5s6.5 2 7 5.5" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 z-60 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#15131b] p-2 shadow-2xl">

                    <NavLink
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                      <span aria-hidden="true">♙</span>
                      My Profile
                    </NavLink>

                    <NavLink
                      to="/my-bookings"
                      onClick={() => setProfileOpen(false)}
                      className={() =>
                        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-white/10 hover:text-white ${
                          isBookings
                            ? "bg-white/10 text-white"
                            : "text-white/80"
                        }`
                      }
                    >
                      <span aria-hidden="true">▤</span>
                      My Bookings
                    </NavLink>

                    <NavLink
                      to="/saved"
                      onClick={() => setProfileOpen(false)}
                      className={() =>
                        `flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-white/10 hover:text-white ${
                          isSaved ? "bg-white/10 text-white" : "text-white/80"
                        }`
                      }
                    >
                      <span className="flex items-center gap-3">
                        <span aria-hidden="true">♡</span>
                        Saved Events
                      </span>
                      {savedCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d5b68a] px-1.5 text-[9px] font-bold text-[#17120c]">
                          {savedCount}
                        </span>
                      )}
                    </NavLink>

                    <div className="my-1 border-t border-white/10" />

                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/";
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-300 transition hover:bg-red-400/10"
                    >
                      <span aria-hidden="true">↗</span>
                      Log out
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="mt-3 flex flex-wrap items-center gap-2 md:hidden">
        <nav aria-label="Mobile navigation" className="flex items-center gap-1">
          <NavLink to="/" end className={() => navClass(isHome)}>
            Home
          </NavLink>

          <NavLink
            to="/events"
            className={() => navClass(isExplore)}
          >
            Explore
          </NavLink>

          <NavLink
            to="/saved"
            className={() => `relative ${navClass(isSaved)}`}
          >
            Saved
            {savedCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d5b68a] px-1 text-[9px] font-bold text-[#17120c]">
                {savedCount}
              </span>
            )}
          </NavLink>
        </nav>

        <form
          role="search"
          onSubmit={handleSearch}
          className="flex h-10 min-w-0 flex-1 basis-full items-center gap-3 rounded-full border border-white/15 bg-white/[0.07] px-4 backdrop-blur-xl sm:basis-auto"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="h-4 w-4 shrink-0 stroke-[#c9c9c9] stroke-[1.7]"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" />
          </svg>

          <input
            type="search"
            name="event-search"
            defaultValue={searchValue}
            placeholder="Find your next experience..."
            aria-label="Search events"
            className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-[#b4b4b4]"
          />
        </form>
      </div>
    </header>
  );
}

export default Navbar;
