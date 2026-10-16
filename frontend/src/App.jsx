import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/organizer/Dashboard';
import CreateEvent from './pages/organizer/CreateEvent';
import ManageEvents from './pages/organizer/ManageEvents';
import Attendees from './pages/organizer/Attendees';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public & User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Organizer Routes */}
        <Route path="/organizer/dashboard" element={<Dashboard />} />
        <Route path="/organizer/events/new" element={<CreateEvent />} />
        <Route path="/organizer/events" element={<ManageEvents />} />
        <Route path="/organizer/events/:id/attendees" element={<Attendees />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
