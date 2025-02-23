import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiredRole }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (auth?.isBlocked) {
    return <Navigate to="/block" replace />;
  }

  if (requiredRole && auth.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
