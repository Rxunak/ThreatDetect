import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiredRole }) => {
  const auth = JSON.parse(localStorage.getItem("auth")); // Retrieve auth from localStorage

  if (!auth?.isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (auth?.isBlocked){
    return <Navigate to="/block" replace/>;
  }

  if (requiredRole && auth.role !== requiredRole) {
    // Redirect to main page if role does not match requiredRole
    return <Navigate to="/" replace />;
  }



  return element;
};

export default ProtectedRoute;
