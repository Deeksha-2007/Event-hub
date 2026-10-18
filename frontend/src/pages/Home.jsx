import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await eventService.getAll();
        const events = res.data?.data?.events || [];
        // Take top 3 events for featured section
        setFeaturedEvents(events.slice(0, 3));
      } catch (err) {
        console.error('Error fetching featured events:', err);
        setError('Unable to load featured events right now. Please check if the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          Welcome to <span>EventNest</span>
        </h1>
        <p className="hero-tagline">
          Discover college, tech, and cultural events happening around you. Explore schedules, venues, and ticket options all in one place.
        </p>
        <Link to="/events" className="btn btn-primary">
          Explore All Events →
        </Link>
      </section>

      {/* Featured Events Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Featured Events</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Handpicked upcoming highlights</p>
          </div>
          <Link to="/events" className="btn btn-outline btn-sm">
            View All ({featuredEvents.length > 0 ? '6' : '0'})
          </Link>
        </div>

        {loading && (
          <div className="state-box">
            <h3>Loading events...</h3>
            <p>Fetching the latest events from the server.</p>
          </div>
        )}

        {error && (
          <div className="state-box error">
            <h3>Failed to load events</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && featuredEvents.length === 0 && (
          <div className="state-box">
            <h3>No events found</h3>
            <p>Check back later for new events.</p>
          </div>
        )}

        {!loading && !error && featuredEvents.length > 0 && (
          <div className="events-grid">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
