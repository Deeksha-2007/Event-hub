// Shared dashboard utility components

export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white/20">
        {icon || (
          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 stroke-current stroke-[1.4]">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
          </svg>
        )}
      </div>
      <h3 className="mb-1.5 text-base font-medium text-white/70">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-white/35">{message}</p>
      {action}
    </div>
  );
}

export function LoadingSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-9 flex-1 rounded-lg bg-white/5" style={{ flex: c === 0 ? 2 : 1 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatCard({ label, value, sub, accent = 'text-white', icon }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5 transition hover:border-white/14">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-white/30">{label}</p>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/30">
            {icon}
          </div>
        )}
      </div>
      <p className={`text-2xl font-semibold ${accent}`}>{value ?? '—'}</p>
      {sub && <p className="mt-1 text-xs text-white/30">{sub}</p>}
    </div>
  );
}

export function EventStatusBadge({ status }) {
  const map = {
    PUBLISHED: 'border-emerald-400/30 bg-emerald-400/8 text-emerald-400',
    DRAFT: 'border-amber-400/30 bg-amber-400/8 text-amber-400',
    COMPLETED: 'border-blue-400/30 bg-blue-400/8 text-blue-400',
    CANCELLED: 'border-red-400/30 bg-red-400/8 text-red-400',
  };
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[9px] uppercase tracking-widest ${map[status] || 'border-white/10 text-white/40'}`}>
      {status || 'UNKNOWN'}
    </span>
  );
}

export function BookingStatusBadge({ status }) {
  const map = {
    CONFIRMED: 'border-emerald-400/30 bg-emerald-400/8 text-emerald-400',
    PENDING: 'border-amber-400/30 bg-amber-400/8 text-amber-400',
    CANCELLED: 'border-red-400/30 bg-red-400/8 text-red-400',
  };
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[9px] uppercase tracking-widest ${map[status] || 'border-white/10 text-white/40'}`}>
      {status || 'UNKNOWN'}
    </span>
  );
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#12111a] p-6 shadow-2xl">
        <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
        <p className="mb-6 text-sm text-white/50">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/60 transition hover:bg-white/5">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${danger ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-[#d5b68a] hover:bg-[#e8cfa8] text-[#17120c]'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, sub, actions }) {
  return (
    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        {sub && <p className="mt-0.5 text-sm text-white/40">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export function formatINR(amount) {
  return '₹' + (amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
