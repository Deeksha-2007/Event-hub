import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Wraps a route that requires authentication.
 * If requireOrganizer=true, also checks for ORGANIZER or ADMIN role.
 */
export default function ProtectedRoute({ children, requireOrganizer = false }) {
  const { isAuthenticated, isOrganizer } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    localStorage.setItem('eventnest_redirect', location.pathname);
    return <Navigate to="/login" replace />;
  }

  if (requireOrganizer && !isOrganizer) {
    return <Navigate to="/" replace />;
  }

  return children;
}
