import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";

export default function IsPrivate({ children }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  // If the authentication is still loading, show a fallback
  if (isLoading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  }

  // If the user is NOT logged in, redirect them to the login page
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // If the user IS logged in, allow them to see the component
  return children;
}