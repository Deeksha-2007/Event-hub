import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span>🎟️</span> EventNest
        </Link>
        <nav>
          <ul className="navbar-links">
            <li>
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/events" className={({ isActive }) => (isActive ? 'active' : '')}>
                Events
              </NavLink>
            </li>
            <li>
              <NavLink to="/venues" className={({ isActive }) => (isActive ? 'active' : '')}>
                Venues
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
