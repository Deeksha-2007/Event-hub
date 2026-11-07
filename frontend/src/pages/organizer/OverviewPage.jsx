import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  StatCard, EventStatusBadge, BookingStatusBadge,
  PageHeader, formatINR, formatDate,
} from '../../components/organizer/dashboard/shared';

// ── Mock data ──────────────────────────────────────────────
const STATS = {
  eventsCreated: 8,
  publishedEvents: 5,
  ticketsSold: 1248,
  totalBookings: 342,
  totalRevenue: 487600,
};

const REVENUE_OVER_TIME = [
  { date: 'Oct 1', revenue: 12000 }, { date: 'Oct 3', revenue: 18500 },
  { date: 'Oct 5', revenue: 9800 },  { date: 'Oct 7', revenue: 24000 },
  { date: 'Oct 9', revenue: 31000 }, { date: 'Oct 11', revenue: 19500 },
  { date: 'Oct 13', revenue: 42000 },{ date: 'Oct 15', revenue: 38000 },
  { date: 'Oct 17', revenue: 27500 },{ date: 'Oct 19', revenue: 51000 },
  { date: 'Oct 21', revenue: 44000 },{ date: 'Oct 23', revenue: 62000 },
];

const SALES_BY_EVENT = [
  { title: 'Tech Summit 2024', revenue: 142000 },
  { title: 'Jazz Night', revenue: 89500 },
  { title: 'Startup Expo', revenue: 76000 },
  { title: 'Yoga Retreat', revenue: 54200 },
  { title: 'Food Festival', revenue: 48000 },
];

const STATUS_BREAKDOWN = [
  { status: 'CONFIRMED', count: 298 },
  { status: 'PENDING', count: 27 },
  { status: 'CANCELLED', count: 17 },
];

const UPCOMING_EVENTS = [
  { id: '1', title: 'Tech Summit 2024', startDate: '2024-11-15', status: 'PUBLISHED', Venue: { city: 'Bangalore' } },
  { id: '2', title: 'Jazz Night at Amphitheatre', startDate: '2024-11-22', status: 'PUBLISHED', Venue: { city: 'Mumbai' } },
  { id: '3', title: 'Startup Expo India', startDate: '2024-12-05', status: 'DRAFT', Venue: { city: 'Delhi' } },
  { id: '4', title: 'Yoga & Wellness Retreat', startDate: '2024-12-10', status: 'PUBLISHED', Venue: { city: 'Rishikesh' } },
];

const RECENT_BOOKINGS = [
  { id: 'b1', User: { name: 'Priya Sharma' }, Event: { title: 'Tech Summit 2024' }, totalAmount: 2500, status: 'CONFIRMED' },
  { id: 'b2', User: { name: 'Rahul Mehta' }, Event: { title: 'Jazz Night' }, totalAmount: 1200, status: 'CONFIRMED' },
  { id: 'b3', User: { name: 'Ananya Iyer' }, Event: { title: 'Startup Expo India' }, totalAmount: 800, status: 'PENDING' },
  { id: 'b4', User: { name: 'Karan Patel' }, Event: { title: 'Yoga Retreat' }, totalAmount: 3500, status: 'CONFIRMED' },
  { id: 'b5', User: { name: 'Sneha Gupta' }, Event: { title: 'Food Festival' }, totalAmount: 500, status: 'CANCELLED' },
];

const GOLD = '#d5b68a';
const COLORS = ['#5cb88a', '#d5b68a', '#e07070'];

function CustomTooltip({ active, payload, label, prefix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#12111a] px-3 py-2.5 text-xs shadow-xl">
      <p className="mb-1 text-white/50">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {prefix}{typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}
        </p>
      ))}
    </div>
  );
}

export default function OverviewPage() {
  const statCards = [
    { label: 'Total Events', value: STATS.eventsCreated, sub: `${STATS.publishedEvents} published`, accent: 'text-white' },
    { label: 'Published', value: STATS.publishedEvents, accent: 'text-emerald-400' },
    { label: 'Tickets Sold', value: STATS.ticketsSold.toLocaleString('en-IN'), accent: 'text-[#d5b68a]' },
    { label: 'Total Bookings', value: STATS.totalBookings.toLocaleString('en-IN'), accent: 'text-white' },
    { label: 'Revenue', value: formatINR(STATS.totalRevenue), sub: 'Total earnings', accent: 'text-[#d5b68a]' },
  ];

  return (
    <div>
      <PageHeader
        title="Overview"
        sub={new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        actions={
          <Link
            to="/organizer/events/create"
            className="flex items-center gap-2 rounded-full bg-[#d5b68a] px-5 py-2.5 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8]"
          >
            + Create Event
          </Link>
        }
      />

      {/* Stat cards */}
      <div className="mb-8 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts row */}
      <div className="mb-6 grid gap-5 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/8 bg-[#0d0d12] p-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/30">Revenue (last 30 days)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_OVER_TIME} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GOLD} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip prefix="₹" />} />
              <Area type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Booking status pie */}
        <div className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/30">Booking Status</p>
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
        </div>
      </div>

      {/* Revenue by event bar */}
      <div className="mb-6 rounded-2xl border border-white/8 bg-[#0d0d12] p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/30">Revenue by Event</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={SALES_BY_EVENT} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="title" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip prefix="₹" />} />
            <Bar dataKey="revenue" fill={GOLD} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom two-column */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Upcoming events */}
        <div className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-white/30">Upcoming Events</p>
            <Link to="/organizer/events" className="text-xs text-[#d5b68a] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {UPCOMING_EVENTS.map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 rounded-xl bg-white/3 px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-white">{ev.title}</p>
                  <p className="text-xs text-white/40">{formatDate(ev.startDate)} · {ev.Venue?.city}</p>
                </div>
                <EventStatusBadge status={ev.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-white/30">Recent Bookings</p>
            <Link to="/organizer/bookings" className="text-xs text-[#d5b68a] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {RECENT_BOOKINGS.map((bk) => (
              <div key={bk.id} className="flex items-center gap-3 rounded-xl bg-white/3 px-3 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-semibold text-white/60">
                  {bk.User?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-white">{bk.User?.name}</p>
                  <p className="truncate text-xs text-white/40">{bk.Event?.title}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-[#d5b68a]">{formatINR(bk.totalAmount)}</p>
                  <BookingStatusBadge status={bk.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
