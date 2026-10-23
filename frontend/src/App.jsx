
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeUI from "./pages/Home";
import EventsUI from "./pages/Events";
import { BookmarkProvider } from "./context/BookmarkContext";
import SavedEventsPage from "./pages/SavedEventsPage";

function App() {
  return (
    <BrowserRouter>
      <BookmarkProvider>
        <Routes>
          <Route path="/" element={<HomeUI />} />
          <Route path="/events" element={<EventsUI />} />
          <Route path="/saved" element={<SavedEventsPage />} />
        </Routes>
      </BookmarkProvider>
    </BrowserRouter>
  );
}

export default App;
