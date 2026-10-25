import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  {
    to: '/organizer/overview',
    label: 'Overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 stroke-current stroke-[1.6]">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    to: '/organizer/events',
    label: 'My Events',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 stroke-current stroke-[1.6]">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    to: '/organizer/events/create',
    label: 'Create Event',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 stroke-current stroke-[1.6]">
        <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    to: '/organizer/bookings',
    label: 'Bookings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 stroke-current stroke-[1.6]">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    to: '/organizer/analytics',
    label: 'Analytics',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 stroke-current stroke-[1.6]">
        <path d="M3 20h18M7 20V14M12 20V9M17 20V4" />
      </svg>
    ),
  },
  {
    to: '/organizer/settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 stroke-current stroke-[1.6]">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

function Sidebar({ collapsed, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 ${
      isActive
        ? 'bg-[#d5b68a]/12 text-[#d5b68a] font-medium'
        : 'text-white/50 hover:bg-white/5 hover:text-white/80'
    }`;

  return (
    <aside
      className={`flex h-full flex-col border-r border-white/8 bg-[#0a0a0f] transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/8 px-4">
        <span className="grid grid-cols-2 gap-1 shrink-0" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-[1px] bg-[#f6f4f0]" />
          ))}
        </span>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight text-white">
            EventNest <span className="text-[#d5b68a]">Pro</span>
          </span>
        )}
      </div>

      {/* Organizer profile */}
      {!collapsed && (
        <div className="border-b border-white/8 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d5b68a]/15 text-sm font-semibold text-[#d5b68a]">
              {user?.name?.[0]?.toUpperCase() || 'O'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user?.name || 'Organizer'}</p>
              <p className="truncate text-[10px] text-white/35">{user?.role || 'ORGANIZER'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={linkCls}
            onClick={onClose}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="border-t border-white/8 px-2 py-3 space-y-0.5">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 transition hover:bg-white/5 hover:text-white/70"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 stroke-current stroke-[1.6]">
            <path d="M3 12L12 3l9 9M5 10v9a1 1 0 0 0 1 1h5v-5h2v5h5a1 1 0 0 0 1-1v-9" />
          </svg>
          {!collapsed && <span>Back to Website</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400/70 transition hover:bg-red-400/8 hover:text-red-400"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 stroke-current stroke-[1.6]">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#07070b] text-white">

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar collapsed={false} onClose={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar collapsed={sidebarCollapsed} onClose={() => {}} />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 bg-[#09090e] px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/8 hover:text-white lg:hidden"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 stroke-current stroke-2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/8 hover:text-white lg:flex"
              aria-label="Toggle sidebar"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 stroke-current stroke-2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>

            <div className="hidden h-5 w-px bg-white/10 sm:block" />
            <h2 className="hidden text-sm font-medium text-white/60 sm:block">Organizer Dashboard</h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/organizer/events/create"
              className="flex items-center gap-2 rounded-full bg-[#d5b68a] px-4 py-2 text-xs font-semibold text-[#17120c] transition hover:bg-[#e8cfa8]"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 stroke-current stroke-2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="hidden sm:inline">Create Event</span>
            </Link>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
