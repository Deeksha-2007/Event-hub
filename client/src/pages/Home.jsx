import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaCalendarCheck } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center py-16 mb-12">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                    Discover Events Near You
                </h1>
                <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
                    Browse, register, and attend amazing events happening around you.
                </p>
                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-700 text-gray-700 text-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between mb-8 px-2 border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-extrabold text-gray-900">Upcoming Events</h2>
                <div className="text-gray-500 font-medium">{events.length} events found</div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-xl font-semibold text-gray-600">Loading events...</div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-xl text-gray-500">No events found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col">
                            <div className="h-48 bg-gray-200 overflow-hidden relative">
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-2xl">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{event.category}</div>
                                <h2 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h2>
                                <div className="flex flex-col gap-2 mb-4 text-gray-600 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-400" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                        <div className="bg-gray-700 h-2 rounded-full" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-4">{event.availableSeats} of {event.totalSeats} seats remaining</p>
                                    <Link to={`/events/${event._id}`} className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 rounded-lg transition">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer */}
            <footer className="mt-auto pt-16 pb-8 border-t border-gray-200 text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <FaCalendarCheck className="text-gray-800 text-2xl" />
                    <span className="text-xl font-bold text-gray-900">EventHub</span>
                </div>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                    The simplest way to discover and manage events.
                </p>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    &copy; {new Date().getFullYear()} EventHub. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
