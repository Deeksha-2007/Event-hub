import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaTimesCircle, FaMapMarkerAlt } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this registration?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8 border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                <div className="w-20 h-20 bg-gray-200 text-gray-900 rounded-full flex items-center justify-center text-3xl font-bold uppercase shrink-0">
                    {user?.name.charAt(0)}
                </div>
                <div className="flex flex-col items-center sm:items-start">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
                    <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> User Dashboard
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                    <FaCalendarAlt className="text-gray-700" /> My Registered Events
                </h2>
                <Link to="/" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black transition">
                    Browse Events
                </Link>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCalendarAlt className="text-gray-300 text-3xl" />
                    </div>
                    <p className="text-xl text-gray-500 mb-6 mt-4 font-medium">You haven't registered for any events yet.</p>
                    <Link to="/" className="inline-block bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition shadow-md">
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col">
                            <div className="p-6 flex-grow">
                                {booking.eventId ? (
                                    <>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{booking.eventId.title}</h3>
                                            <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ml-2 shrink-0 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-gray-400 shrink-0" />
                                                <span>{new Date(booking.eventId.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-gray-400 shrink-0" />
                                                <span>{booking.eventId.location}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400">Registered on: {new Date(booking.bookedAt).toLocaleDateString()}</p>
                                    </>
                                ) : (
                                    <p className="text-gray-400 italic">Event no longer available</p>
                                )}
                            </div>
                            {booking.status !== 'cancelled' && (
                                <div className="px-6 pb-6">
                                    <button
                                        onClick={() => cancelBooking(booking._id)}
                                        className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded-lg text-sm font-semibold transition"
                                    >
                                        <FaTimesCircle /> Cancel Registration
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
