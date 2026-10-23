
import FieldError from "./FieldError";

export default function AttendeeForm({
  attendee,
  onChange,
  errors,
}) {
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-[#17151b] px-4 py-3 text-sm text-[#f5f2ec] outline-none transition placeholder:text-white/25 focus:border-[#d5b68a]/60 focus:ring-1 focus:ring-[#d5b68a]/20";

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-sm font-medium text-white/70">
        Contact details
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="attendee-name"
            className="mb-1.5 block text-xs text-white/45"
          >
            Full name
          </label>

          <input
            id="attendee-name"
            type="text"
            value={attendee.name}
            onChange={(e) =>
              onChange({ ...attendee, name: e.target.value })
            }
            placeholder="Your name"
            className={inputCls}
            autoComplete="name"
          />

          <FieldError msg={errors.name} />
        </div>

        <div>
          <label
            htmlFor="attendee-email"
            className="mb-1.5 block text-xs text-white/45"
          >
            Email address
          </label>

          <input
            id="attendee-email"
            type="email"
            value={attendee.email}
            onChange={(e) =>
              onChange({ ...attendee, email: e.target.value })
            }
            placeholder="you@example.com"
            className={inputCls}
            autoComplete="email"
          />

          <FieldError msg={errors.email} />
        </div>

        <div>
          <label
            htmlFor="attendee-phone"
            className="mb-1.5 block text-xs text-white/45"
          >
            Phone number
          </label>

          <input
            id="attendee-phone"
            type="tel"
            value={attendee.phone}
            onChange={(e) =>
              onChange({ ...attendee, phone: e.target.value })
            }
            placeholder="+91 98765 43210"
            className={inputCls}
            autoComplete="tel"
          />

          <FieldError msg={errors.phone} />
        </div>
      </div>
    </section>
  );
}
