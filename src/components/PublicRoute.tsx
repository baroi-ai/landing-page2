// src/components/PublicRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  // Check if a token exists (modify this check as needed)
  const isAuthenticated = !!localStorage.getItem("access");

  // If authenticated, redirect to dashboard (or another protected route)
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;
