import React from "react";

export default function DeleteButton({ onClick, disabled = false }) {
  return (
    <button
      onClick={onClick} // Handler for click event
      disabled={disabled} // Disable button if true
      className="
        flex items-center gap-2
        cursor-pointer
        bg-red-600
        text-white
        px-4 py-2
        rounded-md
        hover:bg-red-700
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        font-semibold
        select-none
      "
      aria-label="حذف" // Accessibility label for screen readers
      title="حذف" // Tooltip text on hover
    >
      {/* Trash bin SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true" // Hide icon from screen readers
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 7L5 7M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
        />
      </svg>
      حذف {/* Button text */}
    </button>
  );
}
