import React, { useState } from 'react';
import {
  PageHeader, BookingStatusBadge, formatINR, formatDate,
} from '../../components/organizer/dashboard/shared';

const MOCK_EVENTS_LIST = [
  { id: '1', title: 'Tech Summit 2024' },
  { id: '2', title: 'Jazz Night at Amphitheatre' },
  { id: '3', title: 'Startup Expo India' },
  { id: '4', title: 'Yoga & Wellness Retreat' },
  { id: '5', title: 'Food & Culture Festival' },
];

const MOCK_BOOKINGS = [
  { id: 'b01', bookingReference: 'BK-KX91A2', User: { name: 'Priya Sharma', email: 'priya@example.com' }, Event: { id: '1', title: 'Tech Summit 2024' }, TicketType: { name: 'VIP Pass' }, quantity: 2, totalAmount: 5000, status: 'CONFIRMED', createdAt: '2024-10-20T10:30:00Z' },
  { id: 'b02', bookingReference: 'BK-LM7832', User: { name: 'Rahul Mehta', email: 'rahul@example.com' }, Event: { id: '2', title: 'Jazz Night at Amphitheatre' }, TicketType: { name: 'General Admission' }, quantity: 3, totalAmount: 3600, status: 'CONFIRMED', createdAt: '2024-10-19T15:00:00Z' },
  { id: 'b03', bookingReference: 'BK-NN2241', User: { name: 'Ananya Iyer', email: 'ananya@example.com' }, Event: { id: '3', title: 'Startup Expo India' }, TicketType: { name: 'General Admission' }, quantity: 1, totalAmount: 800, status: 'PENDING', createdAt: '2024-10-18T09:00:00Z' },
  { id: 'b04', bookingReference: 'BK-PQ5567', User: { name: 'Karan Patel', email: 'karan@example.com' }, Event: { id: '4', title: 'Yoga & Wellness Retreat' }, TicketType: { name: 'Weekend Package' }, quantity: 1, totalAmount: 3500, status: 'CONFIRMED', createdAt: '2024-10-17T12:00:00Z' },
  { id: 'b05', bookingReference: 'BK-RS8812', User: { name: 'Sneha Gupta', email: 'sneha@example.com' }, Event: { id: '5', title: 'Food & Culture Festival' }, TicketType: { name: 'Day Pass' }, quantity: 4, totalAmount: 2000, status: 'CANCELLED', createdAt: '2024-10-16T08:00:00Z' },
  { id: 'b06', bookingReference: 'BK-TU3301', User: { name: 'Amit Verma', email: 'amit@example.com' }, Event: { id: '1', title: 'Tech Summit 2024' }, TicketType: { name: 'General Pass' }, quantity: 1, totalAmount: 2500, status: 'CONFIRMED', createdAt: '2024-10-15T11:00:00Z' },
  { id: 'b07', bookingReference: 'BK-VW9923', User: { name: 'Meera Nair', email: 'meera@example.com' }, Event: { id: '2', title: 'Jazz Night at Amphitheatre' }, TicketType: { name: 'VIP Table' }, quantity: 2, totalAmount: 7200, status: 'CONFIRMED', createdAt: '2024-10-14T14:00:00Z' },
  { id: 'b08', bookingReference: 'BK-XY1145', User: { name: 'Ravi Kumar', email: 'ravi@example.com' }, Event: { id: '4', title: 'Yoga & Wellness Retreat' }, TicketType: { name: 'Weekend Package' }, quantity: 2, totalAmount: 7000, status: 'CONFIRMED', createdAt: '2024-10-13T09:30:00Z' },
  { id: 'b09', bookingReference: 'BK-ZA4478', User: { name: 'Divya Singh', email: 'divya@example.com' }, Event: { id: '5', title: 'Food & Culture Festival' }, TicketType: { name: 'Day Pass' }, quantity: 2, totalAmount: 1000, status: 'PENDING', createdAt: '2024-10-12T16:00:00Z' },
  { id: 'b10', bookingReference: 'BK-BC6634', User: { name: 'Siddharth Rao', email: 'sid@example.com' }, Event: { id: '1', title: 'Tech Summit 2024' }, TicketType: { name: 'General Pass' }, quantity: 5, totalAmount: 12500, status: 'CONFIRMED', createdAt: '2024-10-11T10:00:00Z' },
];

const MOCK_ATTENDEES = {
  '1': [
    { id: 'a1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9876543210', TicketType: { name: 'VIP Pass' }, Booking: { bookingReference: 'BK-KX91A2' } },
    { id: 'a2', name: 'Rahul Sharma', email: 'rahuls@example.com', phone: '+91 9123456789', TicketType: { name: 'VIP Pass' }, Booking: { bookingReference: 'BK-KX91A2' } },
    { id: 'a3', name: 'Amit Verma', email: 'amit@example.com', phone: '+91 9988776655', TicketType: { name: 'General Pass' }, Booking: { bookingReference: 'BK-TU3301' } },
    { id: 'a4', name: 'Siddharth Rao', email: 'sid@example.com', phone: '+91 9011223344', TicketType: { name: 'General Pass' }, Booking: { bookingReference: 'BK-BC6634' } },
  ],
  '2': [
    { id: 'a5', name: 'Meera Nair', email: 'meera@example.com', phone: '+91 9765432109', TicketType: { name: 'VIP Table' }, Booking: { bookingReference: 'BK-VW9923' } },
    { id: 'a6', name: 'Raj Nair', email: 'raj@example.com', phone: '+91 9654321098', TicketType: { name: 'VIP Table' }, Booking: { bookingReference: 'BK-VW9923' } },
  ],
};

const STATUS_OPTIONS = ['', 'CONFIRMED', 'PENDING', 'CANCELLED'];

function exportCSV(bookings) {
  const rows = [
    ['Reference', 'Attendee', 'Email', 'Event', 'Ticket', 'Qty', 'Amount', 'Status', 'Date'],
    ...bookings.map((b) => [
      b.bookingReference, b.User?.name || '', b.User?.email || '',
      b.Event?.title || '', b.TicketType?.name || '', b.quantity,
      b.totalAmount, b.status, formatDate(b.createdAt),
    ]),
  ];
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function AttendeesDrawer({ eventId, eventTitle, onClose }) {
  const attendees = MOCK_ATTENDEES[eventId] || [];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#12111a] p-6 shadow-2xl max-h-[80vh] flex flex-col">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Attendees</h3>
            <p className="text-xs text-white/40 mt-0.5 truncate max-w-xs">{eventTitle}</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/8 hover:text-white">✕</button>
        </div>
        {attendees.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/35">No attendees registered yet for this event in the demo</p>
        ) : (
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#12111a]">
                <tr className="border-b border-white/8">
                  {['Name', 'Email', 'Phone', 'Ticket', 'Booking Ref'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-[9px] font-medium uppercase tracking-widest text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendees.map((a) => (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/2">
                    <td className="px-3 py-2.5 text-white">{a.name}</td>
                    <td className="px-3 py-2.5 text-white/50 text-xs">{a.email}</td>
                    <td className="px-3 py-2.5 text-white/40 text-xs">{a.phone}</td>
                    <td className="px-3 py-2.5 text-white/50 text-xs">{a.TicketType?.name}</td>
                    <td className="px-3 py-2.5 text-[10px] font-mono text-white/40">{a.Booking?.bookingReference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [attendeesFor, setAttendeesFor] = useState(null);
  const LIMIT = 6;

  const filtered = MOCK_BOOKINGS.filter((bk) => {
    const q = search.toLowerCase();
    const matchSearch = !search || bk.User?.name.toLowerCase().includes(q) || bk.User?.email.toLowerCase().includes(q) || bk.bookingReference.toLowerCase().includes(q);
    const matchEvent = !eventFilter || bk.Event?.id === eventFilter;
    const matchStatus = !statusFilter || bk.status === statusFilter;
    return matchSearch && matchEvent && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / LIMIT);
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const inputCls = 'h-9 rounded-xl border border-white/10 bg-white/4 px-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d5b68a]/40';

  return (
    <div>
      {attendeesFor && (
        <AttendeesDrawer eventId={attendeesFor.id} eventTitle={attendeesFor.title} onClose={() => setAttendeesFor(null)} />
      )}

      <PageHeader
        title="Bookings & Attendees"
        sub={`${filtered.length} booking${filtered.length !== 1 ? 's' : ''} found`}
        actions={
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 transition hover:border-white/25 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 stroke-current stroke-2"><path d="M12 15V3M6 9l6 6 6-6M3 21h18" /></svg>
            Export CSV
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, email, or reference…"
          className={`${inputCls} min-w-52 flex-1`}
        />
        <select value={eventFilter} onChange={(e) => { setEventFilter(e.target.value); setPage(1); }} className={inputCls}>
          <option value="">All events</option>
          {MOCK_EVENTS_LIST.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className={inputCls}>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All statuses'}</option>)}
        </select>
      </div>

      {paginated.length === 0 ? (
        <div className="py-20 text-center"><p className="text-white/40">No bookings match your filters.</p></div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-white/8">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-[#0d0d12]">
                  {['Reference', 'Attendee', 'Event', 'Ticket', 'Qty', 'Amount', 'Status', 'Date', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[9px] font-medium uppercase tracking-widest text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((bk, i) => (
                  <tr key={bk.id} className={`border-b border-white/5 transition hover:bg-white/2 ${i % 2 === 0 ? 'bg-[#09090e]' : 'bg-[#0b0b11]'}`}>
                    <td className="px-4 py-3 font-mono text-[11px] text-white/40">{bk.bookingReference}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{bk.User?.name}</p>
                      <p className="text-[11px] text-white/35">{bk.User?.email}</p>
                    </td>
                    <td className="max-w-40 truncate px-4 py-3 text-white/70">{bk.Event?.title}</td>
                    <td className="px-4 py-3 text-xs text-white/45">{bk.TicketType?.name}</td>
                    <td className="px-4 py-3 text-white/70">{bk.quantity}</td>
                    <td className="px-4 py-3 font-medium text-[#d5b68a]">{formatINR(bk.totalAmount)}</td>
                    <td className="px-4 py-3"><BookingStatusBadge status={bk.status} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-white/35">{formatDate(bk.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setAttendeesFor({ id: bk.Event?.id, title: bk.Event?.title })}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/40 transition hover:border-white/25 hover:text-white"
                      >
                        Attendees
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs text-white/35">Page {page} of {totalPages} · {filtered.length} total</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-white/10 px-4 py-1.5 text-xs text-white/50 hover:bg-white/5 disabled:opacity-30">← Prev</button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border border-white/10 px-4 py-1.5 text-xs text-white/50 hover:bg-white/5 disabled:opacity-30">Next →</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
