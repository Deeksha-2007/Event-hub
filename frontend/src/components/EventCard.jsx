import React from 'react';
import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  if (!event) return null;

  // Format date cleanly
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Find lowest ticket price if available
  const tickets = event.TicketType || event.ticketTypes || [];
  const lowestPrice = tickets.length > 0
    ? Math.min(...tickets.map((t) => t.price))
    : null;

  const venueInfo = event.Venue
    ? `${event.Venue.name}, ${event.Venue.city}`
    : 'Venue to be announced';

  return (
    <div className="event-card">
      <img
        src={event.bannerUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'}
        alt={event.title}
        className="event-card-img"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80';
        }}
      />
      <div className="event-card-body">
        <div>
          <span className="badge badge-category">{event.category || 'Event'}</span>
          <h3 className="event-card-title">{event.title}</h3>
        </div>

        <div className="event-card-meta">
          <div className="event-card-meta-item">
            <span>📅</span>
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="event-card-meta-item">
            <span>📍</span>
            <span>{venueInfo}</span>
          </div>
        </div>

        <div className="event-card-footer">
          <div className="event-price-preview">
            {lowestPrice !== null ? (
              <>From <strong>₹{lowestPrice}</strong></>
            ) : (
              <span>Tickets available</span>
            )}
          </div>
          <Link to={`/events/${event.id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
