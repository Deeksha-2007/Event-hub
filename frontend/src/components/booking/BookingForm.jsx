
import TicketTypeSelector from "./TicketTypeSelector";
import TicketQuantity from "./TicketQuantity";
import AttendeeForm from "./AttendeeForm";

export default function BookingForm({
  tickets,
  selectedTicketId,
  onTicketSelect,
  quantity,
  onQuantityChange,
  maxQuantity,
  attendee,
  onAttendeeChange,
  errors,
  confirming,
  total,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-[#d5b68a]">
        CHECKOUT
      </p>

      <h1 className="mb-8 font-['Playfair_Display',Georgia,serif] text-3xl text-[#f5f2ec]">
        Book your tickets
      </h1>

      <TicketTypeSelector
        tickets={tickets}
        selectedTicketId={selectedTicketId}
        onSelect={onTicketSelect}
        error={errors.ticket}
      />

      <TicketQuantity
        quantity={quantity}
        maxQuantity={maxQuantity}
        onChange={onQuantityChange}
      />

      <AttendeeForm
        attendee={attendee}
        onChange={onAttendeeChange}
        errors={errors}
      />

      <button
        type="submit"
        disabled={confirming || maxQuantity < 1}
        className="flex min-h-13 w-full items-center justify-center gap-3 rounded-full bg-[#d5b68a] text-sm font-semibold text-[#17120c] transition hover:-translate-y-0.5 hover:bg-[#e8cfa8] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {confirming ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#17120c]/30 border-t-[#17120c]" />
            Confirming…
          </>
        ) : (
          <>
            Confirm Booking ·{" "}
            {total === 0
              ? "Free"
              : `₹${total.toLocaleString("en-IN")}`}
            <span aria-hidden="true">↗</span>
          </>
        )}
      </button>

      <p className="mt-4 text-center text-[10px] leading-5 text-white/25">
        Demo only — no real payment or reservation is made.
      </p>
    </form>
  );
}
