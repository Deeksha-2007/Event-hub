
const CITIES = [
  "New Delhi", "Gurugram", "Noida", "Mumbai", "Bengaluru",
  "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Other",
];

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#17151b] px-4 py-3.5 text-sm text-[#f5f2ec] outline-none transition placeholder:text-white/25 focus:border-[#d5b68a]/50";

function FieldError({ message }) {
  return message ? (
    <p className="mt-1 text-xs text-red-400">{message}</p>
  ) : null;
}

export default function ProfileForm({
  draft,
  setDraft,
  errors,
  onSubmit,
  onCancel,
}) {
  const updateField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0e0b14] p-6 sm:p-8">
      <form onSubmit={onSubmit} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="prof-name" className="mb-1.5 block text-xs text-white/40">
              Full name *
            </label>
            <input
              id="prof-name"
              value={draft.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              className={inputClass}
              placeholder="Your name"
            />
            <FieldError message={errors.name} />
          </div>

          <div>
            <label htmlFor="prof-email" className="mb-1.5 block text-xs text-white/40">
              Email address *
            </label>
            <input
              id="prof-email"
              type="email"
              value={draft.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
            <FieldError message={errors.email} />
          </div>

          <div>
            <label htmlFor="prof-phone" className="mb-1.5 block text-xs text-white/40">
              Phone number
            </label>
            <input
              id="prof-phone"
              type="tel"
              value={draft.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass}
              placeholder="+91 98765 43210"
            />
            <FieldError message={errors.phone} />
          </div>

          <div>
            <label htmlFor="prof-city" className="mb-1.5 block text-xs text-white/40">
              City
            </label>
            <select
              id="prof-city"
              value={draft.city || ""}
              onChange={(e) => updateField("city", e.target.value)}
              className={inputClass}
            >
              <option value="">Select city</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-[#d5b68a] px-7 py-3 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8]"
          >
            Save changes
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/15 px-7 py-3 text-sm text-white/60 transition hover:border-white/30"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
