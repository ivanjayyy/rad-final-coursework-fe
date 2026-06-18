import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

type RequireAuthTypes = {
  children: ReactNode;
  roles?: string[];
};

export const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  if (roles && !roles.some((role) => user?.roles.includes(role))) {
    return (
      <div>
        <Navigate to="/" replace />
      </div>
    );
  }

  return <>{children}</>;
};
