import { createContext, useEffect, useState } from "react";
import { getMyDetails } from "../service/auth";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setLoading(true);
      getMyDetails()
        .then((res) => {
          if (res.data) setUser(res.data);
          else setUser(null);
        })
        .catch((err) => {
          console.error(err);
          setUser(null);
        })
        .finally(() => {
          // This safely turns off loading ONLY after the API responds
          setLoading(false);
        });
    } else {
      setUser(null);
      // Safely turns off loading if there is no token to begin with
      setLoading(false);
    }

    // ❌ REMOVED the duplicate setLoading(false) from here!
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
