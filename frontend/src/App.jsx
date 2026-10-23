
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeUI from "./pages/Home";
import EventsUI from "./pages/Events";
import { BookmarkProvider } from "./context/BookmarkContext";
import SavedEventsPage from "./pages/SavedEventsPage";
import EventDetails from "./pages/EventDetails";
import BookingPage from './pages/BookingPage';
import CategoryEventsPage from './pages/CategoryEventsPage';
import MyBookingsPage from "./pages/MyBookingPage";
import OrganizerDashboard from './pages/OrganizerDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <BookmarkProvider>
        <Routes>
          <Route path="/" element={<HomeUI />} />
          <Route path="/events" element={<EventsUI />} />
          <Route path="/saved" element={<SavedEventsPage />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events/:id/book" element={<BookingPage />} />
          <Route path="/events/category/:slug" element={<CategoryEventsPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

        </Routes>
      </BookmarkProvider>
    </BrowserRouter>
  );
}

export default App;
