import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ─── Filter option sets ────────────────────────────────────────────────────────
const DATE_OPTIONS     = ["Any date","Today","Tomorrow","This Weekend","This Week"];
const LOCATION_OPTIONS = ["All locations","New Delhi","Gurugram","Noida","Online"];
const PRICE_OPTIONS    = ["Any price","Free","Paid","Under ₹500","₹500 and above"];
const FORMAT_OPTIONS   = ["All formats","In-person","Online"];
const SORT_OPTIONS     = ["Recommended","Newest","Price: Low to High"];

export const FILTER_DEFS = [
  { key:"date",     label:"Date",     options:DATE_OPTIONS,     defaultVal:"Any date" },
  { key:"location", label:"Location", options:LOCATION_OPTIONS, defaultVal:"All locations" },
  { key:"price",    label:"Price",    options:PRICE_OPTIONS,    defaultVal:"Any price" },
  { key:"format",   label:"Format",   options:FORMAT_OPTIONS,   defaultVal:"All formats" },
  { key:"sort",     label:"Sort by",  options:SORT_OPTIONS,     defaultVal:"Recommended" },
];

export const INITIAL_FILTERS = {
  date: "Any date",
  location: "All locations",
  price: "Any price",
  format: "All formats",
  sort: "Recommended",
};

// ─── Fixed-position dropdown panel (avoids overflow-x-auto clipping bug) ──────
function DropdownPanel({ btnRef, options, selected, onSelect }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropH = Math.min(options.length * 40, 220);
    const top = spaceBelow > dropH + 16 ? rect.bottom + 8 : rect.top - dropH - 8;
    setStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${rect.left}px`,
      width: "200px",
      zIndex: 9999,
    });
  }, [btnRef, options.length]);

  return (
    <div style={style} className="rounded-2xl border border-white/10 bg-[#15131b] p-3 shadow-2xl">
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              selected === opt
                ? "border-[#d5b68a] bg-[#d5b68a] text-[#17120c]"
                : "border-white/10 text-white/70 hover:border-white/25 hover:text-white"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterChip({ def, value, isOpen, onToggle, onSelect }) {
  const btnRef = useRef(null);
  const isActive = value !== def.defaultVal;
  return (
    <div className="relative shrink-0">
      <button
        ref={btnRef}
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs transition-all duration-200 ${
          isActive || isOpen
            ? "border-[#d5b68a]/60 bg-[#d5b68a]/10 text-[#d5b68a]"
            : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
        }`}
      >
        {isActive ? value : def.label}
        <span className={`text-[10px] transition-transform ${isOpen ? "rotate-180" : ""}`}>↓</span>
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

/**
 * Slim sticky filter bar with search and pill dropdowns.
 *
 * Props:
 *   filters          – current filter state object
 *   onUpdate(key,val)– update one filter
 *   onReset()        – reset all filters + search
 *   search           – current search string
 *   onSearch(str)    – update search string
 *   searchPlaceholder– optional placeholder text
 */
export default function SlimFilters({ filters, onUpdate, onReset, search, onSearch, searchPlaceholder }) {
  const [openKey, setOpenKey] = useState(null);
  const activeCount = FILTER_DEFS.filter(f => filters[f.key] !== f.defaultVal).length;

  useEffect(() => {
    function handler(e) {
      if (!e.target.closest("[data-filter-area]")) setOpenKey(null);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className="sticky top-0 z-30 border-b border-white/10 bg-[#090909]/95 backdrop-blur-xl"
      data-filter-area
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-10 lg:px-16">
        {/* Search row */}
        <div className="flex items-center gap-3 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/12 bg-white/4 px-4 py-2.5 transition focus-within:border-[#d5b68a]/50">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 stroke-white/40 stroke-[1.6]">
              <circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={e => onSearch(e.target.value)}
              placeholder={searchPlaceholder || "Search events, venues, organizers…"}
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
            {search && (
              <button type="button" onClick={() => onSearch("")} className="text-white/40 hover:text-white">×</button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 pb-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scrollbar-none" data-filter-area>
            {FILTER_DEFS.map(f => (
              <FilterChip
                key={f.key}
                def={f}
                value={filters[f.key]}
                isOpen={openKey === f.key}
                onToggle={() => setOpenKey(openKey === f.key ? null : f.key)}
                onSelect={val => { onUpdate(f.key, val); setOpenKey(null); }}
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
