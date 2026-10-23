import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import LoginPromptModal from "../components/common/LoginPromptModal";

const BookmarkContext = createContext(null);
const STORAGE_KEY = "eventnest_bookmarks";

function loadBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(loadBookmarks);
  // pendingAuth holds the event object the user tried to bookmark while logged out
  const [pendingAuth, setPendingAuth] = useState(null);

  // Persist to localStorage whenever bookmarks change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  const getIsLoggedIn = () => Boolean(localStorage.getItem("token"));

  const toggle = useCallback((event) => {
    if (!event) return;
    const id = event.id ?? event._id;
    if (!id) return;

    // Auth gate — must be logged in to save
    if (!getIsLoggedIn()) {
      setPendingAuth(event);
      return;
    }

    setBookmarks(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = event;
      }
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (id) => (id ? Boolean(bookmarks[String(id)]) : false),
    [bookmarks]
  );

  const allBookmarks = Object.values(bookmarks);
  const isLoggedIn   = getIsLoggedIn();

  return (
    <BookmarkContext.Provider value={{ toggle, isBookmarked, allBookmarks, isLoggedIn }}>
      {children}

      {/* Global auth-required modal — LoginPromptModal is in components/common/ */}
      {pendingAuth && (
        <LoginPromptModal
          event={pendingAuth}
          onClose={() => setPendingAuth(null)}
        />
      )}
    </BookmarkContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmarks must be used within a BookmarkProvider");
  return ctx;
}

export default BookmarkContext;
