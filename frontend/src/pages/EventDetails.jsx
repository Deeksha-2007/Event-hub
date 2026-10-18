import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { ticketService } from '../services/ticketService';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Event Details
        const eventRes = await eventService.getById(id);
        const eventData = eventRes.data?.data?.event;
        setEvent(eventData);

        // Fetch Ticket Types for this event
        try {
          const ticketsRes = await ticketService.getByEventId(id);
          const ticketsData = ticketsRes.data?.data?.tickets || [];
          if (ticketsData.length > 0) {
            setTickets(ticketsData);
          } else if (eventData?.TicketType) {
            setTickets(eventData.TicketType);
          }
        } catch (tktErr) {
          console.warn('Could not fetch separate tickets list, falling back to embedded tickets:', tktErr);
          if (eventData?.TicketType) {
            setTickets(eventData.TicketType);
          }
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Could not load event details. The event may not exist or the server is unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="state-box">
        <h3>Loading event details...</h3>
        <p>Please wait a moment.</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="state-box error">
        <h3>Event Not Found</h3>
        <p>{error || 'The requested event could not be found.'}</p>
        <Link to="/events" className="btn btn-primary btn-sm">
          ← Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/events" className="btn btn-outline btn-sm" style={{ marginBottom: '1rem' }}>
        ← Back to Events
      </Link>

      <div className="event-details-container">
        <img
          src={event.bannerUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80'}
          alt={event.title}
          className="event-details-banner"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        <div className="event-details-content">
          <div className="event-details-header">
            <span className="badge badge-category">{event.category || 'Event'}</span>
            <h1 className="event-details-title">{event.title}</h1>
          </div>

          {/* Quick Info Grid */}
          <div className="event-info-grid">
            <div>
              <strong style={{ display: 'block', color: 'var(--text-muted)' }}>Date & Time</strong>
              <span>
                {formatDate(event.startDate)}
                {event.startDate && ` at ${formatTime(event.startDate)}`}
              </span>
            </div>

            <div>
              <strong style={{ display: 'block', color: 'var(--text-muted)' }}>Venue</strong>
              <span>{event.Venue?.name || 'TBA'}</span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {event.Venue ? `${event.Venue.address}, ${event.Venue.city}` : ''}
              </div>
            </div>

            <div>
              <strong style={{ display: 'block', color: 'var(--text-muted)' }}>Capacity</strong>
              <span>
                {event.availableCapacity ?? event.totalCapacity ?? 'Open'} available / {event.totalCapacity ?? 'N/A'} total
              </span>
            </div>
          </div>

          {/* About Event */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>About this Event</h3>
            <p className="event-description">{event.description}</p>
          </div>

          {/* Tickets Section */}
          <div className="tickets-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Available Tickets</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {tickets.length} tier{tickets.length === 1 ? '' : 's'} defined
              </span>
            </div>

            {tickets.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '0.9rem' }}>
                No tickets are listed for this event yet.
              </p>
            ) : (
              <div className="tickets-grid">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="ticket-card">
                    <div className="ticket-card-header">
                      <span className="ticket-name">{ticket.name}</span>
                      <span className="ticket-price">₹{ticket.price}</span>
                    </div>

                    <div className="ticket-quantity">
                      <span className="badge badge-capacity">
                        {ticket.availableQuantity ?? ticket.totalQuantity} of {ticket.totalQuantity} remaining
                      </span>
                    </div>

                    {ticket.description && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        {ticket.description}
                      </p>
                    )}

                    {ticket.perks && (
                      <div className="ticket-perks">
                        <strong>Includes:</strong> {ticket.perks}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Booking Message */}
            <div className="info-banner">
              <span>ℹ️</span>
              <span>Online ticket booking and checkout will be enabled in the upcoming release.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
