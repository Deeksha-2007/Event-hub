
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeUI from "./pages/Home";
import EventsUI from "./pages/Events";
import { BookmarkProvider } from "./context/BookmarkContext";
import SavedEventsPage from "./pages/SavedEventsPage";
import EventDetails from "./pages/EventDetails";

function App() {
  return (
    <BrowserRouter>
      <BookmarkProvider>
        <Routes>
          <Route path="/" element={<HomeUI />} />
          <Route path="/events" element={<EventsUI />} />
          <Route path="/saved" element={<SavedEventsPage />} />
          <Route path="/events/:id" element={<EventDetails />} />
        </Routes>
      </BookmarkProvider>
    </BrowserRouter>
  );
}

export default App;
