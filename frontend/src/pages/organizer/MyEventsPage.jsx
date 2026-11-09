import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PageHeader, EventStatusBadge, ConfirmDialog, formatINR, formatDate,
} from '../../components/organizer/dashboard/shared';
import { eventService } from '../../services/api';

const STATUS_OPTIONS = ['', 'DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED'];

export default function MyEventsPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // id of event being actioned

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit: 100 };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;

      const res = await eventService.getMyEvents(params);
      const { events: list = [] } = res.data?.data || {};
      setEvents(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirmDelete) return;
    setActionLoading(confirmDelete.id);
    try {
      await eventService.delete(confirmDelete.id);
      setConfirmDelete(null);
      await fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event.');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Publish toggle ─────────────────────────────────────────────────────────
  const handlePublishToggle = async (ev) => {
    const newStatus = ev.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    setActionLoading(ev.id);
    try {
      await eventService.patch(ev.id, { status: newStatus });
      await fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update event status.');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Client-side filter (search and status are also sent to backend,
  //    but keep local filter as a fast UX fallback)
  const filtered = events.filter((ev) => {
    const matchSearch =
      !search ||
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.Venue?.city?.toLowerCase().includes(search.toLowerCase()) ||
      ev.Venue?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || ev.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const inputCls =
    'h-9 rounded-xl border border-white/10 bg-white/4 px-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d5b68a]/40';

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
        sub={loading ? 'Loading…' : `${filtered.length} event${filtered.length !== 1 ? 's' : ''}`}
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={inputCls}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s || 'All statuses'}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
          <button onClick={fetchEvents} className="ml-3 underline">Retry</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="py-16 text-center text-sm text-white/40">Loading your events…</div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-white/40">
            {events.length === 0
              ? "You haven't created any events yet."
              : 'No events match your filters.'}
          </p>
          {events.length === 0 && (
            <Link
              to="/organizer/events/create"
              className="mt-4 inline-block text-sm text-[#d5b68a] underline underline-offset-2"
            >
              Create your first event
            </Link>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/8">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-[#0d0d12]">
                {['Event', 'Status', 'Date', 'Venue', 'Tickets Sold', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[9px] font-medium uppercase tracking-widest text-white/30"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev, i) => (
                <tr
                  key={ev.id}
                  className={`border-b border-white/5 transition hover:bg-white/2 ${
                    i % 2 === 0 ? 'bg-[#09090e]' : 'bg-[#0b0b11]'
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {ev.bannerUrl ? (
                        <img
                          src={ev.bannerUrl}
                          alt=""
                          className="h-10 w-14 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[10px] text-white/20">
                          IMG
                        </div>
                      )}
                      <span className="line-clamp-1 font-medium text-white">{ev.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <EventStatusBadge status={ev.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-white/45">
                    {formatDate(ev.startDate)}
                  </td>
                  <td className="max-w-32 truncate px-4 py-3.5 text-xs text-white/45">
                    {ev.Venue?.name || ev.Venue?.city || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-[#d5b68a]">
                    {ev.ticketsSold ?? (ev.totalCapacity - ev.availableCapacity)}
                  </td>
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
                          disabled={actionLoading === ev.id}
                          onClick={() => handlePublishToggle(ev)}
                          className={`rounded-lg border px-2.5 py-1 text-xs transition disabled:opacity-50 ${
                            ev.status === 'PUBLISHED'
                              ? 'border-amber-400/20 text-amber-400 hover:bg-amber-400/8'
                              : 'border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/8'
                          }`}
                        >
                          {ev.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                        </button>
                      )}
                      <button
                        disabled={actionLoading === ev.id}
                        onClick={() => setConfirmDelete(ev)}
                        className="rounded-lg border border-red-400/15 px-2.5 py-1 text-xs text-red-400/70 transition hover:bg-red-400/8 hover:text-red-400 disabled:opacity-50"
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
