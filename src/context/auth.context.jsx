import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 1. Save the token to the browser's local storage
  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  // 2. Check if there's a token, and verify it with the backend
  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      // We must hit our Express API to ensure the token isn't expired or fake
      try {
        const response = await axios.get("http://localhost:5005/api/auth/verify", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        // Token is valid!
        const user = response.data;
        setIsLoggedIn(true);
        setIsLoading(false);
        setUser(user);
      } catch {
        // Token is invalid or expired
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
      }
    } else {
      // No token found
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  // 3. Remove the token for logging out
  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const logOutUser = () => {
    removeToken();
    authenticateUser(); // Resets the state
  };

  // 4. Run the check once when the app first loads
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      authenticateUser();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProviderWrapper };