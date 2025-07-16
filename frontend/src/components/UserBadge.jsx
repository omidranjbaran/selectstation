import React from "react";
import { FaUserCircle } from "react-icons/fa";

export default function UserBadge({ username }) {
  return (
    <div
      className="
        flex items-center gap-3
        bg-gradient-to-r from-[#7F00FF] via-[#E100FF] to-[#FF0080]
        text-white
        font-semibold
        rounded-3xl
        px-5 py-2.5
        shadow-lg
        hover:scale-105 hover:shadow-[0_4px_15px_rgba(255,0,128,0.6)]
        transition-transform duration-300 ease-in-out
        select-none
        max-w-max
        whitespace-nowrap
        cursor-default
      "
      title={`کاربر: ${username}`}
    >
      <FaUserCircle size={30} className="opacity-95 drop-shadow-lg" />
      <span className="text-lg sm:text-xl truncate">{username}</span>
    </div>
  );
}
