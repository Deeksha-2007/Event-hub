
import { useState } from "react";

const categories = [
  "All",
  "Music",
  "Technology",
  "Workshops",
  "Food & Culture",
  "Networking",
  "Social",
  "Adventure",
  "Sports",
];

const dates = [
  "Any date",
  "Today",
  "Tomorrow",
  "This Weekend",
  "This Week",
];

const locations = [
  "All locations",
  "New Delhi",
  "Gurugram",
  "Noida",
  "Online",
];

const prices = [
  "Any price",
  "Free",
  "Paid",
  "Under ₹500",
  "₹500 and above",
];

const sortOptions = [
  "Recommended",
  "Newest",
  "Price: Low to High",
];

const formats = ["All formats", "In-person", "Online"];
const times = ["Any time", "Morning", "Afternoon", "Evening"];

const selectClass =
  "w-full appearance-none rounded-xl border border-white/10 bg-[#17151b] px-3 py-3 text-sm text-[#f5f2ec] outline-none transition focus:border-[#d5b68a]";

function FilterGroup({ title, options, value, onChange }) {
  return (
    <div>
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white/50">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={selected}
              className={`rounded-full border px-3.5 py-2 text-xs transition-all duration-200 ${
                selected
                  ? "border-[#d5b68a] bg-[#d5b68a] text-[#17120c]"
                  : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/30 hover:text-white"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function EventFilters({
  category = "All",
  onCategoryChange = () => {},
  date = "Any date",
  onDateChange = () => {},
  location = "All locations",
  onLocationChange = () => {},
  price = "Any price",
  onPriceChange = () => {},
  sort = "Recommended",
  onSortChange = () => {},
  format = "All formats",
  onFormatChange = () => {},
  time = "Any time",
  onTimeChange = () => {},
  onReset = () => {},
}) {
  const [openFilter, setOpenFilter] = useState(null);
  const [showAllFilters, setShowAllFilters] = useState(false);

  const activeAdvancedCount = [
    format !== "All formats",
    time !== "Any time",
  ].filter(Boolean).length;

  const filterItems = [
    {
      key: "category",
      label: category === "All" ? "Category" : category,
      value: category,
      options: categories,
      onChange: onCategoryChange,
    },
    {
      key: "date",
      label: date === "Any date" ? "Date" : date,
      value: date,
      options: dates,
      onChange: onDateChange,
    },
    {
      key: "location",
      label: location === "All locations" ? "Location" : location,
      value: location,
      options: locations,
      onChange: onLocationChange,
    },
    {
      key: "price",
      label: price === "Any price" ? "Price" : price,
      value: price,
      options: prices,
      onChange: onPriceChange,
    },
    {
      key: "sort",
      label: sort === "Recommended" ? "Sort by" : sort,
      value: sort,
      options: sortOptions,
      onChange: onSortChange,
    },
  ];

  const activeCount = [
    category !== "All",
    date !== "Any date",
    location !== "All locations",
    price !== "Any price",
    sort !== "Recommended",
    format !== "All formats",
    time !== "Any time",
  ].filter(Boolean).length;

  function resetAll() {
    onReset();
    setOpenFilter(null);
    setShowAllFilters(false);
  }

  return (
    <section className="relative z-20 mx-auto w-full max-w-[1600px] px-5 sm:px-10 lg:px-16">
      {/* Filter heading */}
      <div className="flex flex-col gap-4 border-b border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-[#d5b68a]">
            FIND YOUR NEXT EXPERIENCE
          </p>

          <h2 className="font-serif text-3xl text-[#f5f2ec] sm:text-4xl">
            Explore Events
          </h2>
        </div>

        <p className="text-xs text-white/45">
          Refine your experience
        </p>
      </div>

      {/* Compact filter bar */}
      <div className="relative border-b border-white/10 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {filterItems.map((filter) => (
            <div key={filter.key} className="relative">
              <button
                type="button"
                aria-expanded={openFilter === filter.key}
                onClick={() =>
                  setOpenFilter((current) =>
                    current === filter.key ? null : filter.key
                  )
                }
                className={`inline-flex max-w-[220px] items-center gap-2 rounded-full border px-3.5 py-2.5 text-xs transition ${
                  openFilter === filter.key
                    ? "border-[#d5b68a]/60 bg-white/[0.08] text-white"
                    : "border-white/10 text-white/65 hover:border-white/25 hover:text-white"
                }`}
              >
                <span className="truncate">{filter.label}</span>
                <span
                  className={`text-[10px] transition-transform ${
                    openFilter === filter.key ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  ↓
                </span>
              </button>

              {/* Individual dropdown */}
              {openFilter === filter.key && (
                <div className="absolute left-0 top-full z-50 mt-3 w-[min(300px,calc(100vw-40px))] rounded-2xl border border-white/10 bg-[#15131b] p-4 shadow-2xl">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                      {filter.key === "sort"
                        ? "Sort events"
                        : `Filter by ${filter.key}`}
                    </p>

                    <button
                      type="button"
                      onClick={() => setOpenFilter(null)}
                      aria-label="Close filter"
                      className="text-lg text-white/50 hover:text-white"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {filter.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          filter.onChange(option);
                          setOpenFilter(null);
                        }}
                        className={`rounded-full border px-3 py-2 text-xs transition ${
                          filter.value === option
                            ? "border-[#d5b68a] bg-[#d5b68a] text-[#17120c]"
                            : "border-white/10 text-white/75 hover:border-white/30"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* All Filters */}
          <button
            type="button"
            aria-expanded={showAllFilters}
            onClick={() => {
              setShowAllFilters((current) => !current);
              setOpenFilter(null);
            }}
            className={`ml-auto inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-medium transition ${
              showAllFilters
                ? "bg-[#d5b68a] text-[#17120c]"
                : "border border-white/15 text-[#f5f2ec] hover:border-[#d5b68a]/60"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="h-3.5 w-3.5"
            >
              <path
                d="M4 7h16M7 12h10M10 17h4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>

            All Filters

            {activeAdvancedCount > 0 && (
              <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px]">
                {activeAdvancedCount}
              </span>
            )}

            <span aria-hidden="true">
              {showAllFilters ? "−" : "+"}
            </span>
          </button>
        </div>

        {/* All Filters expanded panel */}
        {showAllFilters && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#111015] p-5 shadow-xl sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl text-[#f5f2ec]">
                  All filters
                </h3>
                <p className="mt-1 text-xs text-white/45">
                  Fine-tune your event discovery.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAllFilters(false)}
                aria-label="Close all filters"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FilterGroup
                title="Event format"
                options={formats}
                value={format}
                onChange={onFormatChange}
              />

              <FilterGroup
                title="Time of day"
                options={times}
                value={time}
                onChange={onTimeChange}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={resetAll}
                className="text-xs text-white/55 underline underline-offset-4 transition hover:text-white"
              >
                Reset all filters
              </button>

              <button
                type="button"
                onClick={() => setShowAllFilters(false)}
                className="rounded-full bg-[#d5b68a] px-6 py-3 text-xs font-semibold text-[#17120c] transition hover:bg-[#e5cba4]"
              >
                Show results
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active filter summary */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <span className="text-xs text-white/50">
            {activeCount} active {activeCount === 1 ? "filter" : "filters"}
          </span>

          <button
            type="button"
            onClick={resetAll}
            className="text-xs text-[#d5b68a] transition hover:text-[#f5f2ec]"
          >
            Clear all
          </button>
        </div>
      )}
    </section>
  );
}
