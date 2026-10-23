export default function TicketQuantity({
  quantity,
  maxQuantity,
  onChange,
}) {
  const limit = Math.min(10, Math.max(0, maxQuantity));

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-sm font-medium text-white/70">
        Quantity
      </h2>

      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={quantity <= 1}
          onClick={() => onChange(Math.max(1, quantity - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xl text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-30"
          aria-label="Decrease ticket quantity"
        >
          −
        </button>

        <span className="w-10 text-center text-lg font-semibold">
          {quantity}
        </span>

        <button
          type="button"
          disabled={quantity >= limit}
          onClick={() => onChange(Math.min(limit, quantity + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xl text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-30"
          aria-label="Increase ticket quantity"
        >
          +
        </button>

        <span className="text-xs text-white/35">
          Max 10 per booking
        </span>
      </div>

      {limit === 0 && (
        <p className="mt-2 text-xs text-red-400">
          No tickets are currently available.
        </p>
      )}
    </section>
  );
}
