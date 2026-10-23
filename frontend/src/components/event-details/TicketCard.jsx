
function AvailabilityBadge({ available, total }) {
  if (available == null && total == null) return null;

  const percentage = total
    ? Math.round((available / total) * 100)
    : null;

  const nearlySoldOut = percentage !== null && percentage < 25;

  return (
    <span
      className={`text-[10px] ${
        nearlySoldOut ? "text-red-400" : "text-emerald-400"
      }`}
    >
      {nearlySoldOut
        ? `Only ${available} left!`
        : `${available ?? 0} tickets available`}
    </span>
  );
}

export default function TicketCard({
  ticket,
  selected,
  onSelect,
}) {
  const price = Number(ticket.price ?? 0);
  const soldOut = ticket.available != null && ticket.available <= 0;

  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => onSelect(ticket.id)}
      className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
        selected
          ? "border-[#d5b68a]/70 bg-[#d5b68a]/10"
          : "border-white/10 bg-[#0e0b14] hover:border-white/25"
      } ${soldOut ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-[#f5f2ec]">
            {ticket.name}
          </p>

          {ticket.description && (
            <p className="mt-1 text-xs leading-5 text-white/45">
              {ticket.description}
            </p>
          )}

          {(ticket.available != null || ticket.total != null) && (
            <div className="mt-2">
              {soldOut ? (
                <span className="text-[10px] text-red-400">
                  Sold out
                </span>
              ) : (
                <AvailabilityBadge
                  available={ticket.available}
                  total={ticket.total}
                />
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 text-right">
          <p className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#d5b68a]">
            {price === 0
              ? "Free"
              : `₹${price.toLocaleString("en-IN")}`}
          </p>
          <p className="mt-0.5 text-[10px] text-white/35">
            per ticket
          </p>
        </div>
      </div>

      {selected && (
        <div className="mt-3 border-t border-[#d5b68a]/20 pt-3 text-xs text-[#d5b68a]">
          ✓ Selected
        </div>
      )}
    </button>
  );
}
