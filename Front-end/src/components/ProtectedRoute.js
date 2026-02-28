import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element /*, requiredRole */ }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (auth?.isBlocked) {
    return <Navigate to="/block" replace />;
  }

  // Demo mode for interview access:
  // role-based restriction is intentionally disabled so any authenticated
  // user can open all app sections, including the admin dashboard.
  //
  // Original role guard (kept for future re-enable):
  // if (requiredRole && auth.role !== requiredRole) {
  //   return <Navigate to="/" replace />;
  // }

  return element;
};

export default ProtectedRoute;
