
import React from "react";

const exploreLinks = [
  { label: "All events", href: "/events" },
  { label: "Music", href: "/events?category=Music" },
  { label: "Technology", href: "/events?category=Technology" },
  { label: "Workshops", href: "/events?category=Workshops" },
  { label: "Food & Culture", href: "/events?category=Food%20%26%20Culture" },
];

const accountLinks = [
  { label: "My bookings", href: "/my-bookings" },
  { label: "Log in", href: "/login" },
  { label: "Create account", href: "/register" },
];

function Footer() {
  return (
    <footer className="overflow-hidden border-t border-white/10 bg-[#090909] text-[#f5f2ec]">
      {/* Main footer */}
      <div className="px-[5%] pb-9 pt-12 md:px-[4.3%] md:pb-12 md:pt-16">
        {/* Brand and description */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.2fr] lg:gap-12">
          <div>
            <a
              href="/"
              aria-label="Event Hub home"
              className="inline-flex items-center gap-2"
            >
              <span aria-hidden="true" className="grid grid-cols-2 gap-0.75">
                {Array.from({ length: 4 }, (_, index) => (
                  <span
                    key={index}
                    className="h-1.75 w-1.75 rounded-[1px] bg-[#f6f4f0]"
                  />
                ))}
              </span>

              <span className="text-[22px] font-semibold tracking-[-1px]">
                Event-hub<span className="text-[#d5b68a]">.</span>
              </span>
            </a>

            <p className="mt-5 max-w-75 text-sm leading-7 text-[#aaa8a2]">
              Bringing you closer to extraordinary experiences. Find your
              people, discover something new, and make memories that stay.
            </p>

            <a
              href="/events"
              className="mt-6 inline-flex items-center gap-2 text-xs text-[#e6c99b] transition hover:text-white"
            >
              Find your next experience <span aria-hidden="true">↗</span>
            </a>
          </div>

          {/* Explore links */}
          <div>
            <h3 className="mb-5 text-[10px] font-medium tracking-[1.8px] text-[#d5bd96]">
              EXPLORE
            </h3>

            <ul className="space-y-3.5">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#aaa8a2] transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="mb-5 text-[10px] font-medium tracking-[1.8px] text-[#d5bd96]">
              YOUR ACCOUNT
            </h3>

            <ul className="space-y-3.5">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#aaa8a2] transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter-style CTA */}
          <div>
            <h3 className="mb-4 text-[10px] font-medium tracking-[1.8px] text-[#d5bd96]">
              MAKE IT A MOMENT
            </h3>

            <p className="max-w-70 text-sm leading-6 text-[#aaa8a2]">
              Your next favourite experience is waiting to be discovered.
            </p>

            <a
              href="/events"
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-[#f6f4f0] px-5 text-xs font-semibold text-[#151515]! transition hover:-translate-y-0.5 hover:bg-white"
            >
              Explore events <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* Large editorial statement */}
        <div className="mt-14 border-t border-white/10 pt-8 md:mt-20 md:pt-10">
          <p className="font-['Playfair_Display',Georgia,serif] text-[clamp(35px,8vw,100px)] leading-[0.98] tracking-[-2px] text-[#f5f2ec] md:tracking-[-4px]">
            Make room for
            <br />
            <span className="italic text-[#77736c]">
              extraordinary.
            </span>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-[5%] py-5 md:px-[4.3%]">
        <div className="flex flex-col gap-3 text-[10px] text-[#85837d] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Event-hub. All rights reserved.
          </p>

          <p className="tracking-[1px]">
            DISCOVER. CONNECT. EXPERIENCE.
          </p>

          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex w-fit items-center gap-2 text-[#c5c1b9] transition hover:text-white"
          >
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
