import React from 'react';
import Navbar from '../components/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">{children}</main>
      <footer className="footer">
        <p>© 2026 EventNest — Event & Ticket Management System</p>
      </footer>
    </div>
  );
}
