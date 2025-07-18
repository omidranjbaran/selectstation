import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  // Function to handle user logout
  const handleLogout = () => {
    // Remove JWT tokens and role from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    // Redirect user to login page after logout
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout} // Trigger logout on click
      className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      خروج از حساب {/* Logout button label in Persian */}
    </button>
  );
}
