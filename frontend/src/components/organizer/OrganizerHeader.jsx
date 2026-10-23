
export default function OrganizerHeader({
  showForm,
  onToggleForm,
}) {
  return (
    <>
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#d5b68a]">
            ORGANIZER DASHBOARD
          </p>

          <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4vw,3.2rem)] font-normal tracking-[-0.03em] text-[#f5f2ec]">
            Your Events
          </h1>
        </div>

        <button
          type="button"
          onClick={onToggleForm}
          className="inline-flex items-center gap-2 rounded-full bg-[#d5b68a] px-6 py-3 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8]"
        >
          {showForm ? "Cancel" : "+ Create Event"}
        </button>
      </div>

      <div className="mb-8 rounded-2xl border border-[#d5b68a]/20 bg-[#d5b68a]/5 px-5 py-4 text-xs text-[#d5b68a]/70">
        <strong>Sample / Demo Data</strong> — All metrics, bookings
        and revenue figures shown are illustrative. No real
        transactions have occurred.
      </div>
    </>
  );
}
