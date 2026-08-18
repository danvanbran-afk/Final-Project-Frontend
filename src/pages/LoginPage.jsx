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
  const { authenticateUser } = useContext(AuthContext);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(undefined);

    const requestBody = { email, password };

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
      const response = await axios.post(`${API_URL}/api/auth/login`, requestBody);

      localStorage.setItem("authToken", response.data.authToken);
      await authenticateUser();
      navigate("/");
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "Unable to log in. Please check your credentials.";
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <div className="form-container">
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#1e293b" }}>
          Log In
        </h2>

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {errorMessage && (
          <p style={{ color: "#dc2626", textAlign: "center", marginTop: "15px", fontWeight: "500" }}>
            {errorMessage}
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: "20px", color: "#64748b" }}>
          Don't have an account yet?{" "}
          <Link to="/signup" style={{ color: "#4f46e5", fontWeight: "600" }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}