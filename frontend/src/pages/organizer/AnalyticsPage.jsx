import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { PageHeader, StatCard, formatINR } from '../../components/organizer/dashboard/shared';

const GOLD = '#d5b68a';
const COLORS = ['#5cb88a', '#d5b68a', '#e07070'];

const REVENUE_OVER_TIME = [
  { date: 'Oct 1', revenue: 12000, tickets: 8 },
  { date: 'Oct 3', revenue: 18500, tickets: 14 },
  { date: 'Oct 5', revenue: 9800, tickets: 7 },
  { date: 'Oct 7', revenue: 24000, tickets: 18 },
  { date: 'Oct 9', revenue: 31000, tickets: 22 },
  { date: 'Oct 11', revenue: 19500, tickets: 15 },
  { date: 'Oct 13', revenue: 42000, tickets: 31 },
  { date: 'Oct 15', revenue: 38000, tickets: 28 },
  { date: 'Oct 17', revenue: 27500, tickets: 21 },
  { date: 'Oct 19', revenue: 51000, tickets: 38 },
  { date: 'Oct 21', revenue: 44000, tickets: 33 },
  { date: 'Oct 23', revenue: 62000, tickets: 47 },
];

const SALES_BY_EVENT = [
  { title: 'Tech Summit 2024', revenue: 142000, tickets: 320, bookings: 148 },
  { title: 'Jazz Night', revenue: 89500, tickets: 198, bookings: 87 },
  { title: 'Startup Expo', revenue: 76000, tickets: 156, bookings: 72 },
  { title: 'Yoga Retreat', revenue: 54200, tickets: 85, bookings: 43 },
  { title: 'Food Festival', revenue: 48000, tickets: 412, bookings: 110 },
];

const STATUS_BREAKDOWN = [
  { status: 'CONFIRMED', count: 298 },
  { status: 'PENDING', count: 27 },
  { status: 'CANCELLED', count: 17 },
];

function CustomTooltip({ active, payload, label, prefix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#12111a] px-3 py-2.5 text-xs shadow-xl">
      <p className="mb-1.5 text-white/50">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}
        </p>
      ))}
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5">
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/30">{title}</p>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  const topEvent = SALES_BY_EVENT[0];

  return (
    <div>
      <PageHeader title="Analytics" sub="Real-time insights from your events and bookings" />

      {/* Summary stat cards */}
      <div className="mb-8 grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatINR(487600)} sub="All-time earnings" accent="text-[#d5b68a]" />
        <StatCard label="Tickets Sold" value="1,248" sub="Confirmed bookings" accent="text-white" />
        <StatCard label="Total Bookings" value="342" accent="text-white" />
        <StatCard label="Best Event" value={formatINR(topEvent.revenue)} sub={topEvent.title} accent="text-emerald-400" />
      </div>

      <div className="space-y-5">
        {/* Revenue over time */}
        <SectionCard title="Revenue over last 30 days">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_OVER_TIME} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GOLD} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip prefix="₹" />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={GOLD} strokeWidth={2} fill="url(#revGradA)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Tickets sold */}
          <SectionCard title="Tickets sold (last 30 days)">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={REVENUE_OVER_TIME} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tickets" name="Tickets" fill="#6b7fcc" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          {/* Booking status breakdown */}
          <SectionCard title="Booking status breakdown">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={STATUS_BREAKDOWN} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {STATUS_BREAKDOWN.map((entry, i) => (
                    <Cell key={entry.status} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconSize={8} formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{v}</span>} />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        {/* Performance by event */}
        <SectionCard title="Performance by event">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {['Rank', 'Event', 'Revenue', 'Tickets', 'Bookings'].map((h) => (
                    <th key={h} className="pb-3 text-left text-[9px] font-medium uppercase tracking-widest text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SALES_BY_EVENT.map((ev, i) => (
                  <tr key={ev.title} className="border-b border-white/5 hover:bg-white/2">
                    <td className="py-3 pr-4 text-xs text-white/30">#{i + 1}</td>
                    <td className="py-3 pr-4 font-medium text-white max-w-48 truncate">{ev.title}</td>
                    <td className="py-3 pr-4 font-semibold text-[#d5b68a]">{formatINR(ev.revenue)}</td>
                    <td className="py-3 pr-4 text-white/70">{ev.tickets}</td>
                    <td className="py-3 text-white/50">{ev.bookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
