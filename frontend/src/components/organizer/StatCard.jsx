import React from "react";

/** StatCard used on OrganizerDashboard */
export default function StatCard({ label, value, sub, accent }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e0b14] p-5">
      <p className="text-[9px] uppercase tracking-[0.22em] text-white/35">{label}</p>
      <p className={`mt-2 font-['Playfair_Display',Georgia,serif] text-3xl ${accent || "text-[#f5f2ec]"}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-white/35">{sub}</p>}
    </div>
  );
}
