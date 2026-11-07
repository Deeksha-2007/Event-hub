import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PageHeader, EventStatusBadge, ConfirmDialog, formatINR, formatDate,
} from '../../components/organizer/dashboard/shared';

const MOCK_EVENTS = [
  {
    id: '1', title: 'Tech Summit 2024', status: 'PUBLISHED',
    startDate: '2024-11-15T09:00:00Z', ticketsSold: 320, revenue: 142000,
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=60',
    Venue: { name: 'NIMHANS Convention Centre', city: 'Bangalore' },
  },
  {
    id: '2', title: 'Jazz Night at Amphitheatre', status: 'PUBLISHED',
    startDate: '2024-11-22T19:00:00Z', ticketsSold: 198, revenue: 89500,
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=60',
    Venue: { name: 'Bandra Amphitheatre', city: 'Mumbai' },
  },
  {
    id: '3', title: 'Startup Expo India', status: 'DRAFT',
    startDate: '2024-12-05T10:00:00Z', ticketsSold: 0, revenue: 0,
    bannerUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&q=60',
    Venue: { name: 'Pragati Maidan', city: 'Delhi' },
  },
  {
    id: '4', title: 'Yoga & Wellness Retreat', status: 'PUBLISHED',
    startDate: '2024-12-10T06:00:00Z', ticketsSold: 85, revenue: 54200,
    bannerUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&q=60',
    Venue: { name: 'Parmarth Niketan', city: 'Rishikesh' },
  },
  {
    id: '5', title: 'Food & Culture Festival', status: 'PUBLISHED',
    startDate: '2024-12-20T11:00:00Z', ticketsSold: 412, revenue: 48000,
    bannerUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=60',
    Venue: { name: 'Palace Grounds', city: 'Bangalore' },
  },
  {
    id: '6', title: 'Photography Masterclass', status: 'COMPLETED',
    startDate: '2024-10-01T10:00:00Z', ticketsSold: 60, revenue: 72000,
    bannerUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=200&q=60',
    Venue: { name: 'Studio 91', city: 'Hyderabad' },
  },
  {
    id: '7', title: 'Comedy Nights Special', status: 'CANCELLED',
    startDate: '2024-10-15T20:00:00Z', ticketsSold: 0, revenue: 0,
    bannerUrl: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=200&q=60',
    Venue: { name: 'The Comedy Club', city: 'Pune' },
  },
  {
    id: '8', title: 'AI & Machine Learning Bootcamp', status: 'DRAFT',
    startDate: '2025-01-20T09:00:00Z', ticketsSold: 0, revenue: 0,
    bannerUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=200&q=60',
    Venue: { name: 'IIT Bombay', city: 'Mumbai' },
  },
];

const STATUS_OPTIONS = ['', 'DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED'];

export default function MyEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = events.filter((ev) => {
    const matchSearch = !search || ev.title.toLowerCase().includes(search.toLowerCase()) || ev.Venue?.city?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || ev.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = () => {
    setEvents((prev) => prev.filter((e) => e.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const handlePublishToggle = (ev) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === ev.id
          ? { ...e, status: e.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }
          : e
      )
    );
  };

  const inputCls = 'h-9 rounded-xl border border-white/10 bg-white/4 px-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d5b68a]/40';

  return (
    <div>
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete event?"
        message={`"${confirmDelete?.title}" will be permanently deleted. This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
        confirmLabel="Delete"
        danger
      />

      <PageHeader
        title="My Events"
        sub={`${filtered.length} event${filtered.length !== 1 ? 's' : ''}`}
        actions={
          <Link
            to="/organizer/events/create"
            className="flex items-center gap-2 rounded-full bg-[#d5b68a] px-5 py-2.5 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8]"
          >
            + Create Event
          </Link>
        }
      />

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events or city…"
          className={`${inputCls} min-w-48 flex-1`}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputCls}>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All statuses'}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-white/40">No events match your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/8">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-[#0d0d12]">
                {['Event', 'Status', 'Date', 'Venue', 'Tickets Sold', 'Revenue', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-medium uppercase tracking-widest text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev, i) => (
                <tr key={ev.id} className={`border-b border-white/5 transition hover:bg-white/2 ${i % 2 === 0 ? 'bg-[#09090e]' : 'bg-[#0b0b11]'}`}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {ev.bannerUrl ? (
                        <img src={ev.bannerUrl} alt="" className="h-10 w-14 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/20 text-xs">IMG</div>
                      )}
                      <span className="line-clamp-1 font-medium text-white">{ev.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><EventStatusBadge status={ev.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-white/45">{formatDate(ev.startDate)}</td>
                  <td className="max-w-32 truncate px-4 py-3.5 text-xs text-white/45">{ev.Venue?.name || ev.Venue?.city || '—'}</td>
                  <td className="px-4 py-3.5 text-[#d5b68a]">{ev.ticketsSold}</td>
                  <td className="px-4 py-3.5 text-white">{formatINR(ev.revenue)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/organizer/events/${ev.id}/edit`)}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/50 transition hover:border-white/25 hover:text-white"
                      >
                        Edit
                      </button>
                      {ev.status !== 'COMPLETED' && ev.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handlePublishToggle(ev)}
                          className={`rounded-lg border px-2.5 py-1 text-xs transition ${ev.status === 'PUBLISHED' ? 'border-amber-400/20 text-amber-400 hover:bg-amber-400/8' : 'border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/8'}`}
                        >
                          {ev.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDelete(ev)}
                        className="rounded-lg border border-red-400/15 px-2.5 py-1 text-xs text-red-400/70 transition hover:bg-red-400/8 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
