
import React from "react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const getPages = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  };

  const buttonBase =
    "flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <nav
      aria-label="Event pagination"
      className="flex flex-wrap items-center justify-center gap-2 py-10"
    >
      <button
        type="button"
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className={`${buttonBase} border-white/15 text-white/70 hover:border-[#d5b68a] hover:text-[#d5b68a]`}
      >
        <span aria-hidden="true">←</span>
        <span className="ml-2 hidden sm:inline">Previous</span>
      </button>

      {getPages().map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange?.(page)}
          aria-label={`Go to page ${page}`}
          aria-current={currentPage === page ? "page" : undefined}
          className={`${buttonBase} ${
            currentPage === page
              ? "border-[#d5b68a] bg-[#d5b68a] font-semibold text-[#090909]"
              : "border-white/15 text-white/70 hover:border-[#d5b68a] hover:text-[#d5b68a]"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className={`${buttonBase} border-white/15 text-white/70 hover:border-[#d5b68a] hover:text-[#d5b68a]`}
      >
        <span className="mr-2 hidden sm:inline">Next</span>
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}
