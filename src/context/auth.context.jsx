import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

function AuthProviderWrapper({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const authenticateUser = useCallback(async () => {
    // 1. Grab the token from localStorage
    const storedToken = localStorage.getItem("authToken");

    // 2. If no token exists (or it's corrupted), immediately set logged-out state
    // This prevents sending unnecessary requests that trigger 401 console errors
    if (!storedToken || storedToken === "undefined" || storedToken === "null") {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      return;
    }

    try {
      // 3. Send the token to the backend verify endpoint
      const response = await axios.get("http://localhost:5005/api/auth/verify", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      // 4. If the server responds 200 OK, update state to logged in
      const user = response.data;
      setIsLoggedIn(true);
      setIsLoading(false);
      setUser(user);
    } catch {
      // 5. If the server responds 401 Unauthorized (expired/invalid token):
      // Gracefully clear the invalid token and reset state without declaring an unused variable
      localStorage.removeItem("authToken");
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  }, []);

  const logOutUser = () => {
    // Remove the token from localStorage and update state
    localStorage.removeItem("authToken");
    authenticateUser();
  };

  // Run authentication check once when the application loads
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