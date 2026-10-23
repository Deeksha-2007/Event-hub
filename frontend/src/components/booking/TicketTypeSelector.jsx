import FieldError from "./FieldError";

export default function TicketTypeSelector({
  tickets = [],
  selectedTicketId,
  onSelect,
  error,
}) {
  if (tickets.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="mb-4 text-sm font-medium text-white/70">
          Ticket information
        </h2>
        <p className="text-sm text-white/40">
          No ticket types are available for this event.
        </p>
      </section>
    );
  }

  const activeTicketId = selectedTicketId ?? tickets[0]?.id;

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-sm font-medium text-white/70">
        Select ticket type
      </h2>

      <div className="space-y-3">
        {tickets.map((ticket) => {
          const isSelected = activeTicketId === ticket.id;
          const soldOut = ticket.available === 0;

          return (
            <button
              key={ticket.id}
              type="button"
              disabled={soldOut}
              onClick={() => onSelect(ticket.id)}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all duration-200 ${
                soldOut
                  ? "cursor-not-allowed border-white/5 opacity-40"
                  : isSelected
                    ? "border-[#d5b68a]/60 bg-[#d5b68a]/10"
                    : "border-white/10 hover:border-white/25"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-[#f5f2ec]">
                  {ticket.name}
                </p>

                {soldOut ? (
                  <p className="mt-0.5 text-[10px] text-red-400">
                    Sold out
                  </p>
                ) : ticket.available !== undefined ? (
                  <p className="mt-0.5 text-[10px] text-white/35">
                    {ticket.available} remaining
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <span className="font-['Playfair_Display',Georgia,serif] text-lg text-[#d5b68a]">
                  {ticket.price === 0
                    ? "Free"
                    : `₹${ticket.price.toLocaleString("en-IN")}`}
                </span>

                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? "border-[#d5b68a] bg-[#d5b68a]"
                      : "border-white/20"
                  }`}
                >
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-[#17120c]" />
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <FieldError msg={error} />
    </section>
  );
}
