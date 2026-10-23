
import { useMemo, useState } from "react";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/footer";

import OrganizerHeader from "../components/organizer/OrganizerHeader";
import CreateEventForm from "../components/organizer/CreateEventForm";
import OrganizerStats from "../components/organizer/OrganizerStats";
import OrganizerEventsTable from "../components/organizer/OrganizerEventsTable";

const INITIAL_EVENTS = [
  { id: "org-1", title: "Future of AI", category: "Technology", date: "2026-11-12", venue: "India Habitat Centre", status: "Active", bookings: 142, revenue: 70858 },
  { id: "org-2", title: "Indie Music Night", category: "Music", date: "2026-11-15", venue: "Cyber Hub", status: "Active", bookings: 88, revenue: 70312 },
  { id: "org-3", title: "Startup Founders Meetup", category: "Business", date: "2026-11-18", venue: "WeWork", status: "Active", bookings: 67, revenue: 20033 },
  { id: "org-4", title: "Creative Design Workshop", category: "Workshops", date: "2026-11-20", venue: "91springboard", status: "Active", bookings: 38, revenue: 15162 },
  { id: "org-5", title: "Jazz Under the Stars", category: "Music", date: "2026-09-14", venue: "IGNCA", status: "Past", bookings: 200, revenue: 129800 },
];

const EMPTY_FORM = {
  title: "",
  category: "Technology",
  date: "",
  venue: "",
  format: "In-person",
  price: "",
  description: "",
};

export default function OrganizerDashboard() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const stats = useMemo(() => ({
    total: events.length,
    active: events.filter((e) => e.status === "Active").length,
    bookings: events.reduce((sum, e) => sum + e.bookings, 0),
    revenue: events.reduce((sum, e) => sum + e.revenue, 0),
  }), [events]);

  const handleSave = (e) => {
    e.preventDefault();

    const errors = {};
    if (!form.title.trim()) errors.title = "Event title is required.";
    if (!form.date) errors.date = "Event date is required.";
    else if (form.date < new Date().toLocaleDateString("en-CA"))
      errors.date = "Event date cannot be in the past.";
    if (!form.venue.trim()) errors.venue = "Venue is required.";
    if (form.price === "" || Number(form.price) < 0 || !Number.isFinite(Number(form.price)))
      errors.price = "Enter a valid ticket price.";

    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    setEvents((prev) => [{
      id: `org-${Date.now()}`,
      ...form,
      title: form.title.trim(),
      venue: form.venue.trim(),
      price: Number(form.price),
      status: "Active",
      bookings: 0,
      revenue: 0,
    }, ...prev]);

    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowForm(false);
    setSaved(true);
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowForm(false);
    setSaved(false);
  };

  const handleToggleForm = () => {
    if (showForm) handleCancel();
    else {
      setShowForm(true);
      setSaved(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Navbar />

      <main className="mx-auto max-w-360 px-4 py-10 sm:px-6 lg:px-10">
        <OrganizerHeader
          showForm={showForm}
          onToggleForm={handleToggleForm}
        />

        {saved && (
          <p role="status" className="mb-6 text-sm text-emerald-400">
            Event created for this session. It has not been saved to a backend.
          </p>
        )}

        {showForm && (
          <CreateEventForm
            form={form}
            setForm={setForm}
            formErrors={formErrors}
            onSubmit={handleSave}
            onCancel={handleCancel}
          />
        )}

        <OrganizerStats events={events} stats={stats} />
        <OrganizerEventsTable events={events} />
      </main>

      <Footer />
    </div>
  );
}
