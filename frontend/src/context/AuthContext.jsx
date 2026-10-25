import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// ── Mock organizer user — dashboard works without login ──
const MOCK_USER = {
  id: 'mock-organizer-001',
  name: 'Demo Organizer',
  email: 'organizer@eventnest.com',
  role: 'ORGANIZER',
  phone: '+91 98765 43210',
  avatar: '',
  createdAt: '2024-01-15T00:00:00.000Z',
};

function readStorage() {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    // If nothing stored, return the mock organizer so dashboard is always accessible
    return { token: token || 'mock-token', user: user || MOCK_USER };
  } catch {
    return { token: 'mock-token', user: MOCK_USER };
  }
}

export function AuthProvider({ children }) {
  const [{ token, user }, setState] = useState(readStorage);

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setState({ token: newToken, user: newUser });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Reset back to mock user instead of null
    setState({ token: 'mock-token', user: MOCK_USER });
  }, []);

  const updateUser = useCallback((updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(merged));
    setState((prev) => ({ ...prev, user: merged }));
  }, [user]);

  // Always authenticated and always organizer in mock mode
  const isAuthenticated = true;
  const isOrganizer = true;

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
