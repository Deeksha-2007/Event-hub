import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';

import HeroSection from "../components/home/hero_section";
import Navbar from '../components/common/navbar';
import FeaturedEvents from "../components/home/FeaturedEvents";
import EventCategories from "../components/home/EventCategory";
import UpcomingEvents from "../components/home/UpcomingEvents";
import Footer from "../components/common/footer";

// Temporary local data for the original Home function
const sampleEvents = [
  {
    id: 1,
    title: "The After Hours",
    category: "MUSIC",
    location: "New Delhi",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 2,
    title: "Future Forward",
    category: "TECHNOLOGY",
    location: "Gurugram",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 3,
    title: "Ideas in Motion",
    category: "CREATIVE",
    location: "Noida",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=85",
  },
];

// Original Home function
export function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use local data instead of making a backend request
    setFeaturedEvents(sampleEvents);
    setLoading(false);
  }, []);

  return (
    <div>
      <section className="hero">
        <h1 className="hero-title">
          Welcome to <span>EventNest</span>
        </h1>

        <p className="hero-tagline">
          Discover college, tech, and cultural events happening around you.
          Explore schedules, venues, and ticket options all in one place.
        </p>

        <Link to="/events" className="btn btn-primary">
          Explore All Events →
        </Link>
      </section>

      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              Featured Events
            </h2>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
              }}
            >
              Handpicked upcoming highlights
            </p>
          </div>

          <Link to="/events" className="btn btn-outline btn-sm">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="state-box">
            <h3>Loading events...</h3>
          </div>
        ) : featuredEvents.length === 0 ? (
          <div className="state-box">
            <h3>No events found</h3>
            <p>Check back later for new events.</p>
          </div>
        ) : (
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

// New EventNest homepage design
export function HomeUI() {
  return (
    <main className="event-home">
      <div className="hero-shell">
        <Navbar />
        <HeroSection />
      </div>

      <div id="featured-events">
        <FeaturedEvents />
        <EventCategories />
        <UpcomingEvents />
      </div>

      <Footer />
    </main>
  );
}

export default HomeUI;
