import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Start = () => {
  const user = useAuth().user;

  if (!user) {
    return <Navigate to="/home" replace />;
  } else if (user?.roles.includes("MODERATOR")) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user?.roles.includes("USER")) {
    return <Navigate to="/posts" replace />;
  }

  // if (user?.roles.includes("ADMIN")) return <Navigate to="/admin/dashboard" replace />;
};

export default Start;
