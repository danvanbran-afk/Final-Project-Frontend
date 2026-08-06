import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  // Consume our context functions
  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(undefined);

    const requestBody = { email, password };

    try {
      const response = await axios.post("http://localhost:5005/api/auth/login", requestBody);
      
      // 1. Grab the token from the backend response
      const token = response.data.authToken;
      
      // 2. Save it to localStorage
      storeToken(token);
      
      // 3. Verify it and update the global state
      await authenticateUser();
      
      // 4. Redirect to the homepage
      navigate("/");
    } catch (error) {
      const errorDescription = error.response?.data?.message || "Invalid credentials";
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Log In</h2>

      <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <label>Email:</label>
        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" disabled={isLoading} style={{ padding: "10px", marginTop: "10px" }}>
          {isLoading ? "Authenticating..." : "Log In"}
        </button>
      </form>

      {/* Error Handling UI */}
      {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}

      <p style={{ marginTop: "20px" }}>Don't have an account yet?</p>
      <Link to="/signup">Sign up here</Link>
    </div>
  );
}