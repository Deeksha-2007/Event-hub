
import StatCard from "./StatCard";

export default function OrganizerStats({ events, stats }) {
  const summaries = [
    {
      label: "Upcoming events",
      value: events.filter((event) => event.status === "Active").length,
    },
    {
      label: "Avg bookings / event",
      value: stats.total
        ? Math.round(stats.bookings / stats.total)
        : 0,
    },
    {
      label: "Avg revenue / event",
      value: stats.total
        ? `₹${Math.round(
            stats.revenue / stats.total
          ).toLocaleString("en-IN")}`
        : "—",
    },
  ];

  return (
    <>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Events"
          value={stats.total}
          sub={`${stats.active} active`}
        />

        <StatCard
          label="Total Bookings"
          value={stats.bookings.toLocaleString("en-IN")}
          sub="Sample metric"
          accent="text-[#d5b68a]"
        />

        <StatCard
          label="Attendees"
          value={(stats.bookings * 1.2).toFixed(0)}
          sub="Sample metric"
        />

        <StatCard
          label="Revenue (Demo)"
          value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          sub="Illustrative figure"
          accent="text-[#d5b68a]"
        />
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {summaries.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/8 bg-[#0a0a0d] p-5 text-center"
          >
            <p className="text-xs text-white/35">
              {item.label}
            </p>

            <p className="mt-2 font-['Playfair_Display',Georgia,serif] text-2xl text-[#f5f2ec]">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
