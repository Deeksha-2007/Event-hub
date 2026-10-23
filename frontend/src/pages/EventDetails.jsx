
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/common/navbar";
import Footer from "../components/common/footer";

import { getEventById } from "../data/mockdata";
import { useBookmarks } from "../context/BookmarkContext";
import { eventService } from "../services/api";

import EventHero from "../components/events/EventHero";
import EventInfoGrid from "../components/event-details/EventInfoGrid";
import EventDescription from "../components/event-details/EventDescription";
import EventTags from "../components/event-details/EventTags";
import TicketSelection from "../components/event-details/TicketSelection";
import BookingSidebar from "../components/event-details/BookingSidebar";
import MobileBookingBar from "../components/event-details/MobileBookingBar";
import EventLoading from "../components/event-details/EventLoading";
import EventNotFound from "../components/event-details/EventNotFound";
import RelatedEvents from "../components/event-details/RelatedEvents";

function formatDate(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventDetails() {
  const { id } = useParams();
  const { toggle, isBookmarked } = useBookmarks();

  const localEvent = useMemo(() => getEventById(id), [id]);

  const [event, setEvent] = useState(localEvent);
  const [loading, setLoading] = useState(!localEvent);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Load event from the API when it isn't available in mock data.
  useEffect(() => {
    let cancelled = false;

    setEvent(localEvent);

    if (localEvent) {
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);

    eventService
      .getById(id)
      .then((res) => {
        if (!cancelled) {
          setEvent(res.data ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEvent(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, localEvent]);

  // Select the first ticket when event data is loaded.
  useEffect(() => {
    setSelectedTicketId(event?.ticketTypes?.[0]?.id ?? null);
  }, [event]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
        <Navbar />
        <EventLoading />
        <Footer />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
        <Navbar />
        <EventNotFound />
        <Footer />
      </main>
    );
  }

  const eventId = event.id ?? event._id ?? id;
  const tickets = event.ticketTypes ?? [];

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedTicketId) ??
    tickets[0];

  const price =
    selectedTicket?.price ??
    event.price ??
    event.ticketPrice ??
    0;

  const dateStr = formatDate(event.eventDate || event.startDate);
  const bookmarked = isBookmarked(eventId);

  return (
    <main className="min-h-screen bg-[#090909] text-[#f5f2ec]">
      <Navbar />

      {/* Event cover and title */}
      <EventHero event={event} />

      <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Main event content */}
          <div>
            <EventInfoGrid event={event} dateStr={dateStr} />

            <EventDescription description={event.description} />

            <EventTags tags={event.tags ?? []} />

            {/* Ticket selection on mobile */}
            <div className="mb-10 lg:hidden">
              <TicketSelection
                tickets={tickets}
                selectedTicketId={selectedTicketId}
                onSelect={setSelectedTicketId}
              />

              <p className="mt-5 text-center text-[10px] text-white/30">
                Simulated booking — no real payment required
              </p>
            </div>
          </div>

          {/* Desktop booking panel */}
          <BookingSidebar
            event={event}
            eventId={eventId}
            tickets={tickets}
            selectedTicketId={selectedTicketId}
            onSelectTicket={setSelectedTicketId}
            price={price}
            dateStr={dateStr}
            bookmarked={bookmarked}
            onToggleBookmark={toggle}
          />
        </div>
      </div>

      {/* Fixed mobile booking controls */}
      <MobileBookingBar
        event={event}
        eventId={eventId}
        price={price}
        bookmarked={bookmarked}
        onToggleBookmark={toggle}
      />

      {/* Related events */}
      <RelatedEvents
        currentId={eventId}
        category={event.category}
      />

      <div className="pb-20 lg:pb-0">
        <Footer />
      </div>
    </main>
  );
}
