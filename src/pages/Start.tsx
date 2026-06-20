import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Start = async () => {
  const user = await useAuth().user;

  if (!user) {
    return <Navigate to="/home" replace />;
  } else if (user?.roles.includes("MODERATOR")) {
    return <Navigate to="/admin/posts" replace />;
  } else if (user?.roles.includes("USER")) {
    return <Navigate to="/posts" replace />;
  }

  // if (user?.roles.includes("ADMIN")) return <Navigate to="/admin/dashboard" replace />;
};

export default Start;
