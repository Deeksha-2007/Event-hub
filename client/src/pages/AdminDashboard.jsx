import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';

const CATEGORIES = ['Technology', 'Music', 'Business', 'Sports', 'Education', 'Arts', 'Food', 'Other'];

const emptyForm = {
    title: '', description: '', date: '', location: '', category: 'Technology', totalSeats: '', image: ''
};

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('events'); // 'events' or 'bookings'

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my')
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const openCreateForm = () => {
        setForm(emptyForm);
        setEditingEvent(null);
        setFormError('');
        setShowForm(true);
    };

    const openEditForm = (event) => {
        setForm({
            title: event.title,
            description: event.description,
            date: event.date ? event.date.slice(0, 10) : '',
            location: event.location,
            category: event.category,
            totalSeats: event.totalSeats,
            image: event.image || ''
        });
        setEditingEvent(event);
        setFormError('');
        setShowForm(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        try {
            if (editingEvent) {
                await api.put(`/events/${editingEvent._id}`, form);
            } else {
                await api.post('/events', form);
            }
            setShowForm(false);
            fetchData();
        } catch (error) {
            setFormError(error.response?.data?.message || 'Error saving event');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await api.delete(`/events/${id}`);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting event');
        }
    };

    const handleCancelBooking = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        try {
            await api.delete(`/bookings/${id}`);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error cancelling booking');
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading admin dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Admin Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8 border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-20 h-20 bg-gray-900 text-white rounded-full flex items-center justify-center text-3xl font-bold uppercase shrink-0">
                    {user?.name.charAt(0)}
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-500">Welcome, {user?.name} — Manage events and registrations.</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Events', value: events.length, icon: <FaCalendarAlt /> },
                    { label: 'Total Registrations', value: bookings.length, icon: <FaUsers /> },
                    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: '✓' },
                    { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, icon: '✕' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                        <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`pb-3 px-2 font-bold text-sm uppercase tracking-wider transition ${activeTab === 'events' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                >
                    Events
                </button>
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`pb-3 px-2 font-bold text-sm uppercase tracking-wider transition ${activeTab === 'bookings' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                >
                    All Registrations
                </button>
            </div>

            {/* EVENTS TAB */}
            {activeTab === 'events' && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">All Events</h2>
                        <button
                            onClick={openCreateForm}
                            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-black transition shadow"
                        >
                            <FaPlus /> Create Event
                        </button>
                    </div>

                    {/* Event Create/Edit Form */}
                    {showForm && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
                            {formError && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{formError}</div>}
                            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Event Title *</label>
                                    <input name="title" required value={form.title} onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                                    <textarea name="description" required rows="3" value={form.description} onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
                                    <input name="date" type="date" required value={form.date} onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
                                    <input name="location" required value={form.location} onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                                    <select name="category" required value={form.category} onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700">
                                        {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Total Seats *</label>
                                    <input name="totalSeats" type="number" required min="1" value={form.totalSeats} onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL (optional)</label>
                                    <input name="image" value={form.image} onChange={handleFormChange}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700" />
                                </div>
                                <div className="md:col-span-2 flex gap-3 justify-end">
                                    <button type="button" onClick={() => setShowForm(false)}
                                        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={formLoading}
                                        className="px-5 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-black transition">
                                        {formLoading ? 'Saving...' : (editingEvent ? 'Save Changes' : 'Create Event')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Events List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {events.map(event => (
                            <div key={event._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4">
                                {event.image && (
                                    <img src={event.image} alt={event.title} className="w-20 h-20 object-cover rounded-lg shrink-0" />
                                )}
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-bold text-gray-900 truncate">{event.title}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{event.category} · {new Date(event.date).toLocaleDateString()}</p>
                                    <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                                    <p className="text-xs text-gray-500 mt-1">Seats: {event.availableSeats} / {event.totalSeats}</p>
                                </div>
                                <div className="flex flex-col gap-2 shrink-0">
                                    <button onClick={() => openEditForm(event)}
                                        className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
                                        <FaEdit /> Edit
                                    </button>
                                    <button onClick={() => handleDeleteEvent(event._id)}
                                        className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {events.length === 0 && (
                        <div className="text-center py-16 text-gray-400">No events yet. Create your first event!</div>
                    )}
                </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">All Registrations ({bookings.length})</h2>
                    {bookings.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">No registrations yet.</div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase">User</th>
                                        <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase">Event</th>
                                        <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase">Registered On</th>
                                        <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase">Status</th>
                                        <th className="px-5 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {bookings.map(booking => (
                                        <tr key={booking._id} className="hover:bg-gray-50 transition">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-gray-900">{booking.userId?.name}</p>
                                                <p className="text-gray-400 text-xs">{booking.userId?.email}</p>
                                            </td>
                                            <td className="px-5 py-4 text-gray-700">{booking.eventId?.title || 'Deleted Event'}</td>
                                            <td className="px-5 py-4 text-gray-500">{new Date(booking.bookedAt).toLocaleDateString()}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                {booking.status !== 'cancelled' && (
                                                    <button onClick={() => handleCancelBooking(booking._id)}
                                                        className="text-xs text-red-500 hover:text-red-700 font-semibold">
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
