// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // Check if user is logged in by verifying if an access token exists.
  // You can modify this to check your auth context or redux state if needed.
  const isAuthenticated = localStorage.getItem("access");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
