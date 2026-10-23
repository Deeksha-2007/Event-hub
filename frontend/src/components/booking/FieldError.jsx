import React from "react";

/** Inline field-level validation error message */
export default function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-400">{msg}</p>;
}
