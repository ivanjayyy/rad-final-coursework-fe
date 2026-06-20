import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

type RequireAuthTypes = {
  children: ReactNode;
  roles?: string[];
};

// 1. Removed "async"
export const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  // 2. Removed "await" -> Hooks run synchronously
  const { user, loading } = useAuth();

  // While checking if the user is logged in, show the spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  // If loading is done and there is no user, redirect
  if (!user) {
    return <Navigate to="/home" replace />;
  }

  // If roles are specified and the user doesn't match, redirect
  if (roles && !roles.some((role) => user?.roles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
