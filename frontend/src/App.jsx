
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomeUI from "./pages/Home";
import EventsUI from "./pages/Events";
import { BookmarkProvider } from "./context/BookmarkContext";
import SavedEventsPage from "./pages/SavedEventsPage";
import EventDetails from "./pages/EventDetails";
import BookingPage from './pages/BookingPage';
import CategoryEventsPage from './pages/CategoryEventsPage';
import MyBookingsPage from "./pages/MyBookingPage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AnalyticsPage from './pages/organizer/AnalyticsPage';

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
          <Route
            path="/organizer"
            element={
              <ProtectedRoute requireOrganizer={true}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>

          {/* Legacy route redirect */}
          <Route path="/organizer-dashboard" element={<Navigate to="/organizer/overview" replace />} />

        </Routes>
      </BookmarkProvider>
    </BrowserRouter>
  );
}

export default App;
