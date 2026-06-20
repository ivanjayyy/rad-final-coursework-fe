import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// 1. Removed "async"
const Start = () => {
  // 2. Destructure user AND loading synchronously from your hook
  const { user, loading } = useAuth();

  // 3. Crucial: Wait for the auth check to finish before making a decision
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  // 4. Now that loading is false, safely evaluate the user state
  if (!user) {
    return <Navigate to="/home" replace />;
  }

  if (user?.roles.includes("MODERATOR")) {
    return <Navigate to="/admin/posts" replace />;
  }

  if (user?.roles.includes("USER")) {
    return <Navigate to="/posts" replace />;
  }

  // Fallback if they have a role you haven't explicitly handled above
  return <Navigate to="/home" replace />;
};

export default Start;
