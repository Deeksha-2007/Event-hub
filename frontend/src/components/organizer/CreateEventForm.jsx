
const CATEGORIES = [
  "Technology",
  "Music",
  "Business",
  "Workshops",
  "Food & Drinks",
  "Entertainment",
  "Wellness",
];

const FORMATS = ["In-person", "Online", "Hybrid"];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#17151b] px-4 py-3 text-sm text-white outline-none focus:border-[#d5b68a]/50";

function FieldError({ message }) {
  return message ? (
    <p className="mt-1 text-xs text-red-400">{message}</p>
  ) : null;
}

export default function CreateEventForm({
  form,
  setForm,
  formErrors,
  onSubmit,
  onCancel,
}) {
  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 rounded-3xl border border-white/10 bg-[#0e0b14] p-6 sm:p-8"
    >
      <h2 className="mb-6 text-xl font-semibold">Create an Event</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-white/60">
            Event title *
          </label>
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className={inputClass}
            placeholder="Enter event title"
          />
          <FieldError message={formErrors.title} />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Event date *
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className={inputClass}
          />
          <FieldError message={formErrors.date} />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Venue *
          </label>
          <input
            value={form.venue}
            onChange={(e) => update("venue", e.target.value)}
            className={inputClass}
            placeholder="Enter venue"
          />
          <FieldError message={formErrors.venue} />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Event format
          </label>
          <select
            value={form.format}
            onChange={(e) => update("format", e.target.value)}
            className={inputClass}
          >
            {FORMATS.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Ticket price (₹) *
          </label>
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className={inputClass}
            placeholder="0"
          />
          <FieldError message={formErrors.price} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm text-white/60">
            Description
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className={inputClass}
            placeholder="Describe your event..."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-full bg-[#d5b68a] px-6 py-3 text-sm font-semibold text-[#17120c] hover:bg-[#e8cfa8]"
        >
          Create Event
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/15 px-6 py-3 text-sm text-white/60 hover:border-white/30"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
