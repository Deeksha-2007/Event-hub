
import React, { useState, useEffect, useRef } from "react";

// ─── Filter options ───────────────────────────────────────────────

const DATE_OPTIONS = [
  "Any date",
  "Today",
  "Tomorrow",
  "This Weekend",
  "This Week",
];

const LOCATION_OPTIONS = [
  "All locations",
  "New Delhi",
  "Gurugram",
  "Noida",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Jaipur",
  "Ahmedabad",
  "Chandigarh",
  "Lucknow",
  "Kochi",
  "Indore",
  "Bhopal",
  "Goa",
  "Online",
];

const PRICE_OPTIONS = [
  "Any price",
  "Free",
  "Paid",
  "Under ₹500",
  "₹500 and above",
];

const FORMAT_OPTIONS = [
  "All formats",
  "In-person",
  "Online",
];

const SORT_OPTIONS = [
  "Recommended",
  "Newest",
  "Price: Low to High",
];

export const FILTER_DEFS = [
  {
    key: "date",
    label: "Date",
    options: DATE_OPTIONS,
    defaultVal: "Any date",
  },
  {
    key: "location",
    label: "Location",
    options: LOCATION_OPTIONS,
    defaultVal: "All locations",
  },
  {
    key: "price",
    label: "Price",
    options: PRICE_OPTIONS,
    defaultVal: "Any price",
  },
  {
    key: "format",
    label: "Format",
    options: FORMAT_OPTIONS,
    defaultVal: "All formats",
  },
  {
    key: "sort",
    label: "Sort by",
    options: SORT_OPTIONS,
    defaultVal: "Recommended",
  },
];

export const INITIAL_FILTERS = {
  date: "Any date",
  location: "All locations",
  price: "Any price",
  format: "All formats",
  sort: "Recommended",
};

// ─── Dropdown panel ───────────────────────────────────────────────

function DropdownPanel({ btnRef, options, selected, onSelect }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (!btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const panelWidth = 300;
    const panelHeight = Math.min(options.length * 42, 320);

    const left = Math.max(
      12,
      Math.min(rect.left, window.innerWidth - panelWidth - 12)
    );

    const spaceBelow = window.innerHeight - rect.bottom;

    const top =
      spaceBelow > panelHeight + 20
        ? rect.bottom + 8
        : Math.max(12, rect.top - panelHeight - 8);

    setStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: `${Math.min(panelWidth, window.innerWidth - 24)}px`,
      maxHeight: "320px",
      overflowY: "auto",
      zIndex: 9999,
    });
  }, [btnRef, options.length]);

  return (
    <div
      style={style}
      className="rounded-2xl border border-white/10 bg-[#15131b] p-3 shadow-2xl"
    >
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-full border px-3.5 py-2 text-xs transition ${
              selected === option
                ? "border-[#d5b68a] bg-[#d5b68a] text-[#17120c]"
                : "border-white/10 text-white/70 hover:border-white/25 hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Filter chip ──────────────────────────────────────────────────

function FilterChip({ def, value, isOpen, onToggle, onSelect }) {
  const btnRef = useRef(null);
  const isActive = value !== def.defaultVal;

  return (
    <div className="relative shrink-0">
      <button
        ref={btnRef}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs transition-all duration-200 ${
          isActive || isOpen
            ? "border-[#d5b68a]/60 bg-[#d5b68a]/10 text-[#d5b68a]"
            : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
        }`}
      >
        {isActive ? value : def.label}

        <span
          className={`text-[10px] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ↓
        </span>
      </button>

      {isOpen && (
        <DropdownPanel
          btnRef={btnRef}
          options={def.options}
          selected={value}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}

// ─── Main filter component ────────────────────────────────────────

export default function SlimFilters({
  filters,
  onUpdate,
  onReset,
  search,
  onSearch,
  searchPlaceholder,
}) {
  const [openKey, setOpenKey] = useState(null);

  const activeCount = FILTER_DEFS.filter(
    (filter) => filters[filter.key] !== filter.defaultVal
  ).length;

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!event.target.closest("[data-filter-area]")) {
        setOpenKey(null);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpenKey(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      className="sticky top-0 z-30 border-b border-white/10 bg-[#090909]/95 backdrop-blur-xl"
      data-filter-area
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-10 lg:px-16">

        {/* Search */}
        <div className="flex items-center gap-3 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/12 bg-white/4 px-4 py-2.5 transition focus-within:border-[#d5b68a]/50">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 shrink-0 stroke-white/40 stroke-[1.6]"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder={
                searchPlaceholder ||
                "Search events, venues, organizers..."
              }
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />

            {search && (
              <button
                type="button"
                onClick={() => onSearch("")}
                className="text-white/40 hover:text-white"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 pb-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scrollbar-none">
            {FILTER_DEFS.map((filter) => (
              <FilterChip
                key={filter.key}
                def={filter}
                value={filters[filter.key]}
                isOpen={openKey === filter.key}
                onToggle={() =>
                  setOpenKey(
                    openKey === filter.key ? null : filter.key
                  )
                }
                onSelect={(value) => {
                  onUpdate(filter.key, value);
                  setOpenKey(null);
                }}
              />
            ))}
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="ml-2 shrink-0 text-xs text-white/40 underline underline-offset-4 transition hover:text-white"
            >
              Clear ({activeCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
