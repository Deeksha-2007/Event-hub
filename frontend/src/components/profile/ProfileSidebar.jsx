
import { Link } from "react-router-dom";

export default function ProfileSidebar({ profile, initials, onLogout }) {
  const links = [
    { to: "/my-bookings", label: "My Bookings", icon: "▤" },
    { to: "/events", label: "Explore Events", icon: "↗" },
    { to: "/organizer", label: "Organizer Dashboard", icon: "◈" },
  ];

  return (
    <aside>
      <div className="rounded-3xl border border-white/10 bg-[#0e0b14] p-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#d5b68a]/40 bg-[#d5b68a]/10">
          <span className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#d5b68a]">
            {initials}
          </span>
        </div>

        <p className="font-semibold">{profile.name || "—"}</p>
        <p className="mt-1 break-all text-xs text-white/40">
          {profile.email}
        </p>

        {profile.city && (
          <p className="mt-1 text-xs text-white/35">
            {profile.city}
          </p>
        )}
      </div>

      <div className="mt-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center gap-3 rounded-2xl border border-white/8 px-4 py-3 text-sm text-white/50 transition hover:border-white/20 hover:text-white"
          >
            <span className="text-[#d5b68a]">{link.icon}</span>
            {link.label}
          </Link>
        ))}

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl border border-red-400/15 px-4 py-3 text-sm text-red-400/60 transition hover:border-red-400/30 hover:text-red-400"
        >
          <span>✕</span> Log out
        </button>
      </div>
    </aside>
  );
}
