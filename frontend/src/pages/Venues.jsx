import React, { useState, useEffect } from 'react';
import { venueService } from '../services/venueService';

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await venueService.getAll();
      const data = res.data?.data?.venues || [];
      setVenues(data);
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError('Could not load venues from the server. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Event Venues
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Explore auditorium, stadium, and open-air spaces hosting EventNest events.
        </p>
      </div>

      {loading && (
        <div className="state-box">
          <h3>Loading venues...</h3>
          <p>Please wait while we load partner venue details.</p>
        </div>
      )}

      {error && (
        <div className="state-box error">
          <h3>Failed to load venues</h3>
          <p>{error}</p>
          <button type="button" className="btn btn-outline btn-sm" onClick={fetchVenues}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && venues.length === 0 && (
        <div className="state-box">
          <h3>No venues found</h3>
          <p>No venues have been registered in the system yet.</p>
        </div>
      )}

      {!loading && !error && venues.length > 0 && (
        <div className="venues-grid">
          {venues.map((venue) => (
            <div key={venue.id} className="venue-card">
              <img
                src={venue.imageUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'}
                alt={venue.name}
                className="venue-card-img"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="venue-card-body">
                <span className="badge badge-capacity" style={{ marginBottom: '0.4rem' }}>
                  {venue.city}
                </span>
                <h3 className="venue-card-title">{venue.name}</h3>
                <p className="venue-card-address">📍 {venue.address}</p>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <strong>Capacity:</strong> {venue.capacity ? `${venue.capacity.toLocaleString()} seats` : 'Flexible'}
                </div>

                {venue.amenities && (
                  <div className="venue-card-amenities">
                    <strong>Amenities:</strong> {venue.amenities}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
