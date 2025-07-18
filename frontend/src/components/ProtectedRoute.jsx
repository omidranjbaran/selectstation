import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles, children }) {
  // Get the current user's role from localStorage
  const role = localStorage.getItem("role");

  // If no role found (user not logged in), redirect to login page
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // If user's role is not in the list of allowed roles, redirect to unauthorized page
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If role is allowed, render the child components (protected content)
  return children;
}
