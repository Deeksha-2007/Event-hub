
export default function ProfileDetails({ profile, saved, onEdit }) {
  const fields = [
    { label: "Full name", value: profile.name },
    { label: "Email address", value: profile.email },
    { label: "Phone number", value: profile.phone || "—" },
    { label: "City", value: profile.city || "—" },
  ];

  return (
    <>
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-[#d5b68a]">
            YOUR ACCOUNT
          </p>
          <h1 className="font-['Playfair_Display',Georgia,serif] text-3xl">
            Profile
          </h1>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/60 transition hover:border-white/30 hover:text-white"
        >
          Edit profile
        </button>
      </div>

      {saved && (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-5 py-4 text-xs text-emerald-400"
        >
          Profile saved locally.
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-[#0e0b14] p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label}>
              <p className="mb-1.5 text-[10px] uppercase tracking-[0.18em] text-white/30">
                {field.label}
              </p>
              <div className="w-full wrap-break-words rounded-2xl border border-white/10 bg-white/2 px-4 py-3.5 text-sm">
                {field.value || "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
