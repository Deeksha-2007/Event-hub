/** Shared date / price formatting utilities for EventNest */

export function formatDate(dateStr, opts) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-IN", opts || {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(dateStr) {
  return formatDate(dateStr, { day: "numeric", month: "short", year: "numeric" });
}

export function formatPrice(price) {
  const n = Number(price ?? 0);
  return n <= 0 ? "Free" : `₹${n.toLocaleString("en-IN")}`;
}