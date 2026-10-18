import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';

const CATEGORIES = ['All', 'Technology', 'Music', 'Business', 'Entertainment', 'Food & Drinks'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async (category) => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (category && category !== 'All') {
        params.category = category;
      }
      const res = await eventService.getAll(params);
      const data = res.data?.data?.events || [];
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Could not connect to the event service. Please verify that the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(selectedCategory);
  }, [selectedCategory]);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Browse Events
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Discover concerts, conferences, meetups, and exhibitions.
        </p>
      </div>

      {/* Category Filter */}
      <div className="filter-bar">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* State Handlers */}
      {loading && (
        <div className="state-box">
          <h3>Loading events...</h3>
          <p>Please wait while we retrieve the schedule.</p>
        </div>
      )}

      {error && (
        <div className="state-box error">
          <h3>Failed to load events</h3>
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => fetchEvents(selectedCategory)}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="state-box">
          <h3>No events found</h3>
          <p>There are currently no events matching the "{selectedCategory}" category.</p>
          {selectedCategory !== 'All' && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setSelectedCategory('All')}
            >
              Show All Events
            </button>
          )}
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
