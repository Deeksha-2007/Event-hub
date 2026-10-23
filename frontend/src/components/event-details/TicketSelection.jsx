
import TicketCard from "./TicketCard";

export default function TicketSelection({
  tickets = [],
  selectedTicketId,
  onSelect,
  title = "Choose Your Tickets",
}) {
  if (tickets.length === 0) return null;

  return (
    <section>
      {title && (
        <h2 className="mb-4 font-['Playfair_Display',Georgia,serif] text-2xl text-[#f5f2ec]">
          {title}
        </h2>
      )}

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            selected={selectedTicketId === ticket.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
