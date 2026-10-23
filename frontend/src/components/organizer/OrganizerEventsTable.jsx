
import { Link } from "react-router-dom";

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] ${
        status === "Active"
          ? "border-emerald-400/30 bg-emerald-400/8 text-emerald-400"
          : "border-white/10 text-white/35"
      }`}
    >
      {status}
    </span>
  );
}

export default function OrganizerEventsTable({ events }) {
  const headers = [
    "Event",
    "Category",
    "Date",
    "Venue",
    "Bookings",
    "Revenue",
    "Status",
    "Action",
  ];

  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10">
      <table className="w-full min-w-175 text-sm">
        <thead>
          <tr className="border-b border-white/8 bg-[#0e0b14]">
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-4 text-left text-[9px] font-medium uppercase tracking-[0.18em] text-white/30"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {events.map((event, index) => (
            <tr
              key={event.id}
              className={`border-b border-white/6 transition hover:bg-white/2 ${
                index % 2 === 0
                  ? "bg-[#090909]"
                  : "bg-[#0a0a0d]"
              }`}
            >
              <td className="px-4 py-4">
                <span className="line-clamp-1 font-medium text-[#f5f2ec]">
                  {event.title}
                </span>
              </td>

              <td className="px-4 py-4 text-xs text-white/45">
                {event.category}
              </td>

              <td className="whitespace-nowrap px-4 py-4 text-xs text-white/45">
                {event.date}
              </td>

              <td className="max-w-35 truncate px-4 py-4 text-xs text-white/45">
                {event.venue}
              </td>

              <td className="px-4 py-4 text-[#d5b68a]">
                {event.bookings}
              </td>

              <td className="px-4 py-4 text-[#f5f2ec]">
                ₹{event.revenue.toLocaleString("en-IN")}
              </td>

              <td className="px-4 py-4">
                <StatusBadge status={event.status} />
              </td>

              <td className="px-4 py-4">
                <Link
                  to={`/events/${event.id}`}
                  className="text-xs text-white/35 underline underline-offset-4 transition hover:text-white"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}

          {events.length === 0 && (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-10 text-center text-sm text-white/40"
              >
                No events found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
