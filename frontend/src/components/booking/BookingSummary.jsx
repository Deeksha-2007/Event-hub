
import { formatDate } from "../../utils/formatters";

export default function BookingSummary({
  event,
  selectedTicket,
  quantity,
  subtotal,
  convenienceFee,
  total,
}) {
  const image = event.image || event.imageUrl;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-3xl border border-white/12 bg-[#0e0b14]">
        <div className="relative h-40 overflow-hidden">
          <img
            src={image}
            alt={event.title}
            className="h-full w-full object-cover brightness-50"
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#0e0b14] via-transparent" />
        </div>

        <div className="p-5">
          <span className="text-[9px] uppercase tracking-[0.18em] text-[#d5b68a]">
            {event.category}
          </span>

          <h3 className="mt-1 font-['Playfair_Display',Georgia,serif] text-xl text-[#f5f2ec]">
            {event.title}
          </h3>

          <div className="mt-3 space-y-1.5 text-xs text-white/45">
            {event.date && (
              <p>
                {formatDate(event.eventDate || event.date)}
                {event.time ? ` · ${event.time}` : ""}
              </p>
            )}

            {event.venue && <p>{event.venue}</p>}

            {event.location && <p>{event.location}</p>}
          </div>

          <div className="mt-6 space-y-2.5 border-t border-white/8 pt-5 text-xs">
            <div className="flex items-center justify-between text-white/50">
              <span>
                {selectedTicket?.name || "Ticket"} × {quantity}
              </span>

              <span>
                {subtotal === 0
                  ? "Free"
                  : `₹${subtotal.toLocaleString("en-IN")}`}
              </span>
            </div>

            {convenienceFee > 0 && (
              <div className="flex items-center justify-between text-white/35">
                <span>Convenience fee (3%)</span>

                <span>
                  ₹{convenienceFee.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-white/8 pt-3 text-sm font-semibold text-[#f5f2ec]">
              <span>Total</span>

              <span className="text-[#d5b68a]">
                {total === 0
                  ? "Free"
                  : `₹${total.toLocaleString("en-IN")}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
