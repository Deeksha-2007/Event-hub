import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ticketService } from '../../services/api';
import { PageHeader } from '../../components/organizer/dashboard/shared';

const CATEGORIES = ['Technology', 'Music', 'Business', 'Workshops', 'Food & Drinks', 'Entertainment', 'Wellness', 'Sports', 'Arts', 'Other'];
const STATUSES = ['DRAFT', 'PUBLISHED'];

const EMPTY_FORM = {
  title: '', description: '', category: 'Technology', bannerUrl: '',
  startDate: '', endDate: '', venueName: '', venueAddress: '', venueCity: '', venueCountry: 'India',
  totalCapacity: '', status: 'DRAFT',
  ticketName: 'General Admission', ticketPrice: '', ticketQuantity: '',
};

// Mock data for edit mode — pre-fills the form
const MOCK_EVENT_DATA = {
  '1': { title: 'Tech Summit 2024', description: 'Annual tech conference bringing together innovators and leaders.', category: 'Technology', bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', startDate: '2024-11-15T09:00', endDate: '2024-11-15T18:00', venueName: 'NIMHANS Convention Centre', venueAddress: 'Hosur Road', venueCity: 'Bangalore', venueCountry: 'India', totalCapacity: '500', status: 'PUBLISHED', ticketName: '', ticketPrice: '', ticketQuantity: '' },
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

const inputCls = 'w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d5b68a]/50 focus:bg-white/[0.06]';

export default function CreateEditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(() =>
    isEdit && MOCK_EVENT_DATA[id] ? { ...EMPTY_FORM, ...MOCK_EVENT_DATA[id] } : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.endDate) e.endDate = 'End date is required';
    if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate))
      e.endDate = 'End date must be after start date';
    if (!form.totalCapacity || isNaN(Number(form.totalCapacity)) || Number(form.totalCapacity) <= 0)
      e.totalCapacity = 'Capacity must be a positive number';
    if (!isEdit) {
      if (!form.ticketName.trim()) e.ticketName = 'Ticket name is required';
      if (form.ticketPrice === '' || isNaN(Number(form.ticketPrice)) || Number(form.ticketPrice) < 0)
        e.ticketPrice = 'Enter a valid price (0 for free)';
      if (!form.ticketQuantity || isNaN(Number(form.ticketQuantity)) || Number(form.ticketQuantity) <= 0)
        e.ticketQuantity = 'Quantity must be a positive number';
    }
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // Show saved state then navigate
    setSaved(true);
    setTimeout(() => navigate('/organizer/events'), 1200);
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Event' : 'Create Event'}
        sub={isEdit ? 'Update event details' : 'Fill in the details to create your event'}
      />

      {saved && (
        <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/8 px-4 py-3 text-sm text-emerald-400">
          ✓ Event {isEdit ? 'updated' : 'created'} successfully! Redirecting…
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5 sm:p-6">
          <h2 className="mb-5 text-sm font-semibold text-white/80">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Event Title *" error={errors.title}>
                <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Give your event a great title" className={inputCls} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Description *" error={errors.description}>
                <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe what attendees can expect…" className={inputCls} />
              </Field>
            </div>
            <Field label="Category" error={errors.category}>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status" error={errors.status}>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Banner Image URL" error={errors.bannerUrl}>
                <input value={form.bannerUrl} onChange={(e) => set('bannerUrl', e.target.value)} placeholder="https://example.com/image.jpg" className={inputCls} />
              </Field>
              {form.bannerUrl && (
                <img src={form.bannerUrl} alt="banner preview" className="mt-2 h-40 w-full rounded-xl object-cover opacity-80" onError={(e) => (e.target.style.display = 'none')} />
              )}
            </div>
          </div>
        </section>

        {/* Date & Time */}
        <section className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5 sm:p-6">
          <h2 className="mb-5 text-sm font-semibold text-white/80">Date & Time</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start Date & Time *" error={errors.startDate}>
              <input type="datetime-local" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} className={inputCls} />
            </Field>
            <Field label="End Date & Time *" error={errors.endDate}>
              <input type="datetime-local" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} className={inputCls} />
            </Field>
          </div>
        </section>

        {/* Venue */}
        <section className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5 sm:p-6">
          <h2 className="mb-5 text-sm font-semibold text-white/80">Venue</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Venue Name" error={errors.venueName}>
              <input value={form.venueName} onChange={(e) => set('venueName', e.target.value)} placeholder="India Habitat Centre" className={inputCls} />
            </Field>
            <Field label="City" error={errors.venueCity}>
              <input value={form.venueCity} onChange={(e) => set('venueCity', e.target.value)} placeholder="New Delhi" className={inputCls} />
            </Field>
            <Field label="Address" error={errors.venueAddress}>
              <input value={form.venueAddress} onChange={(e) => set('venueAddress', e.target.value)} placeholder="Street address" className={inputCls} />
            </Field>
            <Field label="Country" error={errors.venueCountry}>
              <input value={form.venueCountry} onChange={(e) => set('venueCountry', e.target.value)} placeholder="India" className={inputCls} />
            </Field>
          </div>
        </section>

        {/* Capacity */}
        <section className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5 sm:p-6">
          <h2 className="mb-5 text-sm font-semibold text-white/80">Capacity</h2>
          <Field label="Total Capacity *" error={errors.totalCapacity}>
            <input type="number" min="1" value={form.totalCapacity} onChange={(e) => set('totalCapacity', e.target.value)} placeholder="500" className={`${inputCls} max-w-48`} />
          </Field>
        </section>

        {/* Ticket type (create only) */}
        {!isEdit && (
          <section className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5 sm:p-6">
            <h2 className="mb-1 text-sm font-semibold text-white/80">Ticket Type</h2>
            <p className="mb-5 text-xs text-white/35">You can add more ticket types after creating the event</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Ticket Name *" error={errors.ticketName}>
                <input value={form.ticketName} onChange={(e) => set('ticketName', e.target.value)} placeholder="General Admission" className={inputCls} />
              </Field>
              <Field label="Price (₹) *" error={errors.ticketPrice}>
                <input type="number" min="0" value={form.ticketPrice} onChange={(e) => set('ticketPrice', e.target.value)} placeholder="0" className={inputCls} />
              </Field>
              <Field label="Quantity *" error={errors.ticketQuantity}>
                <input type="number" min="1" value={form.ticketQuantity} onChange={(e) => set('ticketQuantity', e.target.value)} placeholder="100" className={inputCls} />
              </Field>
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saved}
            className="flex items-center gap-2 rounded-full bg-[#d5b68a] px-6 py-3 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8] disabled:opacity-60"
          >
            {isEdit ? 'Save Changes' : 'Create Event'}
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
