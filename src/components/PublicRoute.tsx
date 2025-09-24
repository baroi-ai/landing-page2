import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // 👈 Import useAuth

const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth(); // 👈 Use the context state

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;
