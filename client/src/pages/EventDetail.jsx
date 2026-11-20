import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaTag } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            await api.post('/bookings', { eventId: event._id });
            setSuccessMsg('Successfully registered for this event!');
            // Update seat count locally
            setEvent(prev => ({ ...prev, availableSeats: prev.availableSeats - 1 }));
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading...</div>;
    if (error && !event) return <div className="text-center py-20 text-xl text-red-500">{error}</div>;

    const isSoldOut = event.availableSeats <= 0;
    const alreadyRegistered = !!successMsg;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
            {event.image ? (
                <img src={event.image} alt={event.title} className="w-full h-80 object-cover" />
            ) : (
                <div className="w-full h-64 bg-gray-900 flex items-center justify-center text-white/50 text-6xl font-black uppercase tracking-widest">
                    {event.category}
                </div>
            )}

            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                    {/* Event Info */}
                    <div>
                        <div className="inline-block bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                            {event.category}
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{event.title}</h1>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">{event.description}</p>
                        {event.createdBy && (
                            <p className="text-sm text-gray-400">Organized by: <span className="font-semibold text-gray-700">{event.createdBy.name}</span></p>
                        )}
                    </div>

                    {/* Registration Box */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 min-w-[280px] w-full md:w-auto shrink-0 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Event Details</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                    <FaCalendarAlt />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase">Date</p>
                                    <p className="font-bold text-gray-800">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase">Location</p>
                                    <p className="font-bold text-gray-800">{event.location}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                    <FaChair />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase">Available Seats</p>
                                    <p className={`font-bold text-lg ${isSoldOut ? 'text-red-500' : 'text-green-600'}`}>
                                        {isSoldOut ? 'Sold Out' : `${event.availableSeats} / ${event.totalSeats}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                    <FaTag />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase">Category</p>
                                    <p className="font-bold text-gray-800">{event.category}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleRegister}
                            disabled={isSoldOut || bookingLoading || alreadyRegistered}
                            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition shadow-lg ${isSoldOut || alreadyRegistered
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-900 hover:bg-black text-white hover:shadow-xl hover:-translate-y-1'
                                }`}
                        >
                            {bookingLoading ? 'Processing...' : (isSoldOut ? 'Sold Out' : (alreadyRegistered ? '✓ Registered' : 'Register for Event'))}
                        </button>

                        {error && <p className="text-red-500 mt-4 text-center font-medium bg-red-50 p-2 rounded">{error}</p>}
                        {successMsg && <p className="text-green-600 mt-4 text-center font-medium bg-green-50 p-2 rounded">{successMsg}</p>}

                        {!user && (
                            <p className="text-center text-sm text-gray-500 mt-4">
                                <span className="font-semibold text-gray-900 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login</span> to register for this event
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
