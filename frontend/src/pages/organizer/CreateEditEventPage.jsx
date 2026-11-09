import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService, venueService } from '../../services/api';
import { PageHeader } from '../../components/organizer/dashboard/shared';

const CATEGORIES = [
  'Technology', 'Music', 'Business', 'Workshops',
  'Food & Drinks', 'Entertainment', 'Wellness', 'Sports', 'Arts', 'Other',
];
const STATUSES = ['DRAFT', 'PUBLISHED'];

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'Technology',
  bannerUrl: '',
  startDate: '',
  endDate: '',
  venueId: '',
  totalCapacity: '',
  status: 'DRAFT',
  // Ticket type (create only)
  ticketName: 'General Admission',
  ticketPrice: '',
  ticketQuantity: '',
};

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-white/40">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d5b68a]/50 focus:bg-white/[0.06]';

export default function CreateEditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [venues, setVenues] = useState([]);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  // ── Load venues ────────────────────────────────────────────────────────────
  useEffect(() => {
    venueService
      .getAll()
      .then((res) => {
        const list = res.data?.data?.venues || res.data?.data || [];
        setVenues(Array.isArray(list) ? list : []);
      })
      .catch(() => setVenues([]))
      .finally(() => setVenuesLoading(false));
  }, []);

  // ── Load event data for edit ───────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit) return;

    eventService
      .getById(id)
      .then((res) => {
        const ev = res.data?.data?.event || null;
        if (!ev) return;

        // Format dates for datetime-local inputs (YYYY-MM-DDTHH:mm)
        const toLocalInput = (dateStr) => {
          if (!dateStr) return '';
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return '';
          // Pad to YYYY-MM-DDTHH:mm
          const pad = (n) => String(n).padStart(2, '0');
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };

        setForm((prev) => ({
          ...prev,
          title: ev.title || '',
          description: ev.description || '',
          category: ev.category || 'Technology',
          bannerUrl: ev.bannerUrl || '',
          startDate: toLocalInput(ev.startDate),
          endDate: toLocalInput(ev.endDate),
          venueId: ev.venueId || '',
          totalCapacity: ev.totalCapacity ? String(ev.totalCapacity) : '',
          status: ev.status || 'DRAFT',
        }));
      })
      .catch(() => {
        setSubmitError('Failed to load event data for editing.');
      });
  }, [id, isEdit]);

  // ── Validation ─────────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.endDate) e.endDate = 'End date is required';
    if (
      form.startDate &&
      form.endDate &&
      new Date(form.startDate) >= new Date(form.endDate)
    )
      e.endDate = 'End date must be after start date';
    if (!form.venueId) e.venueId = 'Please select a venue';
    if (
      !form.totalCapacity ||
      isNaN(Number(form.totalCapacity)) ||
      Number(form.totalCapacity) <= 0
    )
      e.totalCapacity = 'Capacity must be a positive number';

    if (!isEdit) {
      if (!form.ticketName.trim()) e.ticketName = 'Ticket name is required';
      if (
        form.ticketPrice === '' ||
        isNaN(Number(form.ticketPrice)) ||
        Number(form.ticketPrice) < 0
      )
        e.ticketPrice = 'Enter a valid price (0 for free)';
      if (
        !form.ticketQuantity ||
        isNaN(Number(form.ticketQuantity)) ||
        Number(form.ticketQuantity) <= 0
      )
        e.ticketQuantity = 'Quantity must be a positive number';
    }
    return e;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      bannerUrl: form.bannerUrl.trim() || null,
      startDate: form.startDate,
      endDate: form.endDate,
      venueId: form.venueId,
      totalCapacity: parseInt(form.totalCapacity, 10),
      status: form.status,
    };

    if (!isEdit && form.ticketName.trim()) {
      payload.ticketTypes = [
        {
          name: form.ticketName.trim(),
          price: parseFloat(form.ticketPrice) || 0,
          totalQuantity: parseInt(form.ticketQuantity, 10),
        },
      ];
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await eventService.update(id, payload);
      } else {
        await eventService.create(payload);
      }
      navigate('/organizer/events');
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || 'Failed to save event. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Event' : 'Create Event'}
        sub={isEdit ? 'Update event details' : 'Fill in the details to create your event'}
      />

      {submitError && (
        <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-400">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5 sm:p-6">
          <h2 className="mb-5 text-sm font-semibold text-white/80">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Event Title *" error={errors.title}>
                <input
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="Give your event a great title"
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Description *" error={errors.description}>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe what attendees can expect…"
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="Category" error={errors.category}>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Status" error={errors.status}>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className={inputCls}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Banner Image URL" error={errors.bannerUrl}>
                <input
                  value={form.bannerUrl}
                  onChange={(e) => set('bannerUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={inputCls}
                />
              </Field>
              {form.bannerUrl && (
                <img
                  src={form.bannerUrl}
                  alt="banner preview"
                  className="mt-2 h-40 w-full rounded-xl object-cover opacity-80"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
            </div>
          </div>
        </section>

        {/* Date & Time */}
        <section className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5 sm:p-6">
          <h2 className="mb-5 text-sm font-semibold text-white/80">Date & Time</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start Date & Time *" error={errors.startDate}>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="End Date & Time *" error={errors.endDate}>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        {/* Venue */}
        <section className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5 sm:p-6">
          <h2 className="mb-5 text-sm font-semibold text-white/80">Venue</h2>
          <Field label="Select Venue *" error={errors.venueId}>
            {venuesLoading ? (
              <div className={`${inputCls} text-white/30`}>Loading venues…</div>
            ) : venues.length === 0 ? (
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs text-amber-400">
                No venues are available. Please ask an administrator to add venues first.
              </div>
            ) : (
              <select
                value={form.venueId}
                onChange={(e) => set('venueId', e.target.value)}
                className={inputCls}
              >
                <option value="">Select a venue…</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} — {v.city}{v.state ? ', ' + v.state : ''} (capacity: {v.capacity.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            )}
          </Field>
        </section>

        {/* Capacity */}
        <section className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5 sm:p-6">
          <h2 className="mb-5 text-sm font-semibold text-white/80">Capacity</h2>
          <Field label="Total Capacity *" error={errors.totalCapacity}>
            <input
              type="number"
              min="1"
              value={form.totalCapacity}
              onChange={(e) => set('totalCapacity', e.target.value)}
              placeholder="500"
              className={`${inputCls} max-w-48`}
            />
          </Field>
        </section>

        {/* Ticket type (create only) */}
        {!isEdit && (
          <section className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5 sm:p-6">
            <h2 className="mb-1 text-sm font-semibold text-white/80">Ticket Type</h2>
            <p className="mb-5 text-xs text-white/35">
              You can add more ticket types after creating the event
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Ticket Name *" error={errors.ticketName}>
                <input
                  value={form.ticketName}
                  onChange={(e) => set('ticketName', e.target.value)}
                  placeholder="General Admission"
                  className={inputCls}
                />
              </Field>
              <Field label="Price (₹) *" error={errors.ticketPrice}>
                <input
                  type="number"
                  min="0"
                  value={form.ticketPrice}
                  onChange={(e) => set('ticketPrice', e.target.value)}
                  placeholder="0"
                  className={inputCls}
                />
              </Field>
              <Field label="Quantity *" error={errors.ticketQuantity}>
                <input
                  type="number"
                  min="1"
                  value={form.ticketQuantity}
                  onChange={(e) => set('ticketQuantity', e.target.value)}
                  placeholder="100"
                  className={inputCls}
                />
              </Field>
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting || venuesLoading}
            className="flex items-center gap-2 rounded-full bg-[#d5b68a] px-6 py-3 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8] disabled:opacity-60"
          >
            {submitting
              ? isEdit
                ? 'Saving…'
                : 'Creating…'
              : isEdit
              ? 'Save Changes'
              : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/organizer/events')}
            className="rounded-full border border-white/10 px-6 py-3 text-sm text-white/50 transition hover:border-white/25 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
