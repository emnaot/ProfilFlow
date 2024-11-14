
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "AuthContext";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return allowedRoles.includes(user.role) ? children : <Navigate to="/not-found" replace />;
};

export default RoleProtectedRoute;
