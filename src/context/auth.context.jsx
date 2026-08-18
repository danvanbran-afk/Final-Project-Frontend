import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

function AuthProviderWrapper({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const authenticateUser = useCallback(async () => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken || storedToken === "undefined" || storedToken === "null") {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
      const response = await axios.get(`${API_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const user = response.data;
      setIsLoggedIn(true);
      setIsLoading(false);
      setUser(user);
    } catch {
      localStorage.removeItem("authToken");
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  }, []);

  const logOutUser = () => {
    localStorage.removeItem("authToken");
    authenticateUser();
  };

  useEffect(() => {
    const verifyAuth = async () => {
      await authenticateUser();
    };

    verifyAuth();
  }, [authenticateUser]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        authenticateUser,
        logOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };