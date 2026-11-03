import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Read token and user from localStorage when the app first loads
function readStorage() {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [{ token, user }, setState] = useState(readStorage);

  // Called after a successful login or register API call
  const login = useCallback((newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setState({ token: newToken, user: newUser });
  }, []);

  // Clear everything and go back to logged-out state
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ token: null, user: null });
  }, []);

  // Update user info in context and localStorage (e.g. after profile edit)
  const updateUser = useCallback((updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(merged));
    setState((prev) => ({ ...prev, user: merged }));
  }, [user]);

  // True only when a real token exists
  const isAuthenticated = Boolean(token);

  // True if the logged-in user has ORGANIZER or ADMIN role
  const isOrganizer = Boolean(user && (user.role === 'ORGANIZER' || user.role === 'ADMIN'));

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isOrganizer, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
