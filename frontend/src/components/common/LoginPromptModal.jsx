import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Modal shown when a logged-out user tries to bookmark an event.
 * Rendered globally from BookmarkContext.
 * Props: { event, onClose }
 */

export default function LoginPromptModal({ event, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleLogin() {
    localStorage.setItem("eventnest_redirect", window.location.pathname);
    onClose();
    navigate("/login");
  }

  function handleSignup() {
    localStorage.setItem("eventnest_redirect", window.location.pathname);
    onClose();
    navigate("/register");
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#12101a] shadow-2xl">
        <div className="h-1 w-full bg-linear-to-r from-[#d5b68a]/0 via-[#d5b68a] to-[#d5b68a]/0" />

        <div className="px-7 pb-7 pt-6">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#d5b68a]/25 bg-[#d5b68a]/10">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 stroke-[#d5b68a] stroke-[1.6]">
              <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />
            </svg>
          </div>

          <h2
            id="login-prompt-title"
            className="text-center font-['Playfair_Display',Georgia,serif] text-2xl font-normal text-[#f5f2ec]"
          >
            Save this event
          </h2>

          <p className="mt-2 text-center text-sm leading-6 text-white/50">
            {event?.title ? (
              <>Log in to save <span className="text-white/70">{event.title}</span> and access it any time.</>
            ) : (
              "Log in to save events and access them any time."
            )}
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleLogin}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d5b68a] py-3.5 text-sm font-semibold text-[#17120c] transition hover:-translate-y-0.5 hover:bg-[#e8cfa8]"
            >
              Log In to Save
            </button>
            <button
              type="button"
              onClick={handleSignup}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 py-3.5 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Create an Account
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-4 block w-full text-center text-xs text-white/25 transition hover:text-white/50"
          >
            Maybe later
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-white/30 transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
