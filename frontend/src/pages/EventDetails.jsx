
import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/common/navbar";
import Footer from "../components/common/footer";

import { useBookmarks } from "../context/BookmarkContext";
import { useAuth } from "../context/AuthContext";
import { eventService, reviewService } from "../services/api";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Normalize a backend event object to the shape expected by all existing
 * EventDetails child components.
 */
function normalizeEvent(e) {
  if (!e) return null;

  const venue = e.Venue
    ? `${e.Venue.name}${e.Venue.city ? ", " + e.Venue.city : ""}`
    : "";

  const lowestPrice =
    e.TicketType && e.TicketType.length > 0
      ? Math.min(...e.TicketType.map((t) => t.price))
      : 0;

  return {
    ...e,

    // Image
    image: e.bannerUrl || "",
    imageUrl: e.bannerUrl || "",

    // Dates
    eventDate: e.startDate || "",
    date: e.startDate ? e.startDate.split("T")[0] : "",

    // Venue / location strings
    venue,
    location: e.Venue?.city || "",

    // Organizer name
    organizer: e.User?.name || "",

    // Capacity
    capacity: e.totalCapacity,

    // Lowest price
    price: lowestPrice,
    ticketPrice: lowestPrice,

    // Ticket types
    ticketTypes: (e.TicketType || []).map((t) => ({
      ...t,
      available: t.availableQuantity,
      total: t.totalQuantity,
    })),
  };
}

// ─── Star Rating Component ────────────────────────────────────────────────────

function StarRating({ value, max = 5, interactive = false, onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? hovered || value : value;

  return (
    <div
      className="flex gap-0.5"
      role={interactive ? "radiogroup" : undefined}
    >
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        const filled = star <= display;

        return (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? star === value : undefined}
            aria-label={
              interactive
                ? `${star} star${star !== 1 ? "s" : ""}`
                : undefined
            }
            disabled={!interactive}
            onClick={interactive ? () => onChange(star) : undefined}
            onMouseEnter={interactive ? () => setHovered(star) : undefined}
            onMouseLeave={interactive ? () => setHovered(0) : undefined}
            className={`text-xl transition-transform ${
              interactive
                ? "cursor-pointer hover:scale-110"
                : "cursor-default"
            } ${filled ? "text-[#d5b68a]" : "text-white/20"}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

// ─── Individual Review Card ───────────────────────────────────────────────────

function ReviewCard({
  review,
  currentUserId,
  isAdmin,
  onEdit,
  onDelete,
}) {
  const isOwner = review.userId === currentUserId;
  const canModify = isOwner || isAdmin;

  const dateStr = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="rounded-2xl border border-white/8 bg-[#0d0d12] p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/8 text-sm font-semibold text-white/60">
            {review.User?.name?.[0]?.toUpperCase() || "?"}
          </div>

          <div>
            <p className="text-sm font-medium text-[#f5f2ec]">
              {review.User?.name || "Anonymous"}
            </p>

            <p className="text-[10px] text-white/35">
              {dateStr}
            </p>
          </div>
        </div>

        <StarRating value={review.rating} />
      </div>

      <p className="text-sm leading-6 text-white/70">
        {review.comment}
      </p>

      {canModify && (
        <div className="mt-3 flex gap-3">
          {isOwner && (
            <button
              onClick={() => onEdit(review)}
              className="text-xs text-[#d5b68a] underline underline-offset-2 hover:text-[#e8cfa8]"
            >
              Edit
            </button>
          )}

          <button
            onClick={() => onDelete(review.id)}
            className="text-xs text-red-400/70 underline underline-offset-2 hover:text-red-400"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────

function ReviewsSection({ eventId }) {
  const { user, isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewError, setReviewError] = useState(null);

  // Form state
  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [formError, setFormError] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Edit state
  const [editingReview, setEditingReview] = useState(null);

  const commentRef = useRef(null);

  // Fetch reviews
  const fetchReviews = async () => {
    setLoadingReviews(true);
    setReviewError(null);

    try {
      const res = await reviewService.getByEvent(eventId);

      const {
        reviews: list = [],
        avgRating: avg,
        totalReviews: count,
      } = res.data?.data || {};

      setReviews(list);
      setAvgRating(avg);
      setTotalReviews(count);
    } catch {
      setReviewError("Failed to load reviews.");
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchReviews();
  }, [eventId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Has the current user already reviewed?
  const userReview = useMemo(
    () => (user ? reviews.find((r) => r.userId === user.id) : null),
    [reviews, user]
  );

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (formRating < 1 || formRating > 5) {
      setFormError("Please select a rating between 1 and 5.");
      return;
    }

    if (!formComment.trim()) {
      setFormError("Please write a comment.");
      return;
    }

    setFormSubmitting(true);

    try {
      if (editingReview) {
        await reviewService.update(editingReview.id, {
          rating: formRating,
          comment: formComment,
        });
      } else {
        await reviewService.create(eventId, {
          rating: formRating,
          comment: formComment,
        });
      }

      setFormRating(0);
      setFormComment("");
      setEditingReview(null);

      await fetchReviews();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to submit review. Please try again.";

      setFormError(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Edit handler
  const handleEdit = (review) => {
    setEditingReview(review);
    setFormRating(review.rating);
    setFormComment(review.comment);
    setFormError(null);

    setTimeout(() => commentRef.current?.focus(), 100);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setFormRating(0);
    setFormComment("");
    setFormError(null);
  };

  // Delete handler
  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await reviewService.delete(reviewId);
      await fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review.");
    }
  };

  // Render
  return (
    <section className="mt-12 border-t border-white/8 pt-10">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-[#d5b68a]">
            COMMUNITY
          </p>

          <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#f5f2ec]">
            Reviews & Ratings
          </h2>
        </div>

        {/* Average */}
        {totalReviews > 0 && (
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2">
            <StarRating value={Math.round(avgRating || 0)} />

            <span className="text-sm font-semibold text-[#d5b68a]">
              {avgRating?.toFixed(1)}
            </span>

            <span className="text-xs text-white/40">
              ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {/* Review Form */}
      {isAuthenticated && !userReview && !editingReview && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-white/8 bg-[#0d0d12] p-5"
        >
          <p className="mb-4 text-sm font-medium text-white/80">
            Share your experience
          </p>

          <div className="mb-3">
            <p className="mb-1.5 text-xs text-white/40">
              Your Rating *
            </p>

            <StarRating
              value={formRating}
              interactive
              onChange={setFormRating}
            />
          </div>

          <div className="mb-3">
            <label className="mb-1.5 block text-xs text-white/40">
              Your Review *
            </label>

            <textarea
              ref={commentRef}
              rows={3}
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              maxLength={1000}
              placeholder="Tell others what you thought of this event…"
              className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d5b68a]/50 focus:bg-white/[0.06]"
            />

            <p className="mt-1 text-right text-[10px] text-white/25">
              {formComment.length}/1000
            </p>
          </div>

          {formError && (
            <p className="mb-3 text-sm text-red-400">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={formSubmitting}
            className="rounded-full bg-[#d5b68a] px-6 py-2.5 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8] disabled:opacity-60"
          >
            {formSubmitting ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}

      {/* Edit Form */}
      {editingReview && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-[#d5b68a]/20 bg-[#0d0d12] p-5"
        >
          <p className="mb-4 text-sm font-medium text-white/80">
            Edit your review
          </p>

          <div className="mb-3">
            <p className="mb-1.5 text-xs text-white/40">
              Rating *
            </p>

            <StarRating
              value={formRating}
              interactive
              onChange={setFormRating}
            />
          </div>

          <div className="mb-3">
            <label className="mb-1.5 block text-xs text-white/40">
              Review *
            </label>

            <textarea
              ref={commentRef}
              rows={3}
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              maxLength={1000}
              className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d5b68a]/50 focus:bg-white/[0.06]"
            />

            <p className="mt-1 text-right text-[10px] text-white/25">
              {formComment.length}/1000
            </p>
          </div>

          {formError && (
            <p className="mb-3 text-sm text-red-400">
              {formError}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={formSubmitting}
              className="rounded-full bg-[#d5b68a] px-6 py-2.5 text-sm font-semibold text-[#17120c] transition hover:bg-[#e8cfa8] disabled:opacity-60"
            >
              {formSubmitting ? "Saving…" : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-full border border-white/10 px-6 py-2.5 text-sm text-white/50 transition hover:border-white/25 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Already reviewed */}
      {isAuthenticated && userReview && !editingReview && (
        <div className="mb-6 rounded-xl border border-[#d5b68a]/20 bg-[#d5b68a]/5 px-4 py-3 text-sm text-[#d5b68a]">
          You have already reviewed this event. You can edit or delete your review below.
        </div>
      )}

      {/* Not logged in */}
      {!isAuthenticated && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white/50">
          <a
            href="/login"
            className="text-[#d5b68a] underline underline-offset-2"
          >
            Log in
          </a>{" "}
          to share your review.
        </div>
      )}

      {/* Review list */}
      {loadingReviews ? (
        <div className="py-8 text-center text-sm text-white/40">
          Loading reviews…
        </div>
      ) : reviewError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {reviewError}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-[#0d0d12] px-6 py-10 text-center">
          <p className="text-2xl">⭐</p>

          <p className="mt-3 font-['Playfair_Display',Georgia,serif] text-lg text-[#f5f2ec]">
            No reviews yet
          </p>

          <p className="mt-1 text-sm text-white/40">
            Be the first to share your experience.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={user?.id}
              isAdmin={user?.role === "ADMIN"}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EventDetails() {
  const { id } = useParams();
  const { toggle, isBookmarked } = useBookmarks();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Always fetch from the backend
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setEvent(null);

    eventService
      .getById(id)
      .then((res) => {
        if (!cancelled) {
          const raw = res.data?.data?.event || null;
          setEvent(raw ? normalizeEvent(raw) : null);
        }
      })
      .catch(() => {
        if (!cancelled) setEvent(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Auto-select first ticket when event loads
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
    tickets.find((ticket) => ticket.id === selectedTicketId) ?? tickets[0];

  const price =
    selectedTicket?.price ?? event.price ?? event.ticketPrice ?? 0;

  const dateStr = formatDate(event.eventDate || event.startDate);
  const bookmarked = isBookmarked(eventId);

  // ─── Booking availability ────────────────────────────────────────────────

  const eventEndDate = event.endDate
    ? new Date(event.endDate)
    : null;

  const hasEnded =
    eventEndDate &&
    !Number.isNaN(eventEndDate.getTime()) &&
    eventEndDate.getTime() < Date.now();

  const canBookTicket =
    event.status === "PUBLISHED" && !hasEnded;

  const unavailableMessage =
    event.status === "CANCELLED"
      ? "This event has been cancelled."
      : "This event has ended. Ticket booking is closed.";

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
            {canBookTicket ? (
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
            ) : (
              <div className="mb-10 rounded-2xl border border-white/10 bg-[#0d0d12] px-5 py-6 text-center lg:hidden">
                <p className="font-['Playfair_Display',Georgia,serif] text-xl text-[#f5f2ec]">
                  {event.status === "CANCELLED"
                    ? "Event Cancelled"
                    : "Event Completed"}
                </p>

                <p className="mt-2 text-sm text-white/45">
                  {unavailableMessage}
                </p>
              </div>
            )}

            {/* Reviews & Ratings */}
            <ReviewsSection eventId={eventId} />
          </div>

          {/* Desktop booking panel */}
          {canBookTicket ? (
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
          ) : (
            <div className="hidden rounded-2xl border border-white/10 bg-[#0d0d12] px-6 py-10 text-center lg:block">
              <p className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#f5f2ec]">
                {event.status === "CANCELLED"
                  ? "Event Cancelled"
                  : "Event Completed"}
              </p>

              <p className="mt-3 text-sm leading-6 text-white/45">
                {unavailableMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed mobile booking controls */}
      {canBookTicket && (
        <MobileBookingBar
          event={event}
          eventId={eventId}
          price={price}
          bookmarked={bookmarked}
          onToggleBookmark={toggle}
        />
      )}

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
