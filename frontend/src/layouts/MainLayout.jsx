import React from 'react';

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <header style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <nav>
          <strong>EventNest</strong>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
