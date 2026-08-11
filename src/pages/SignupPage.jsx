import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(undefined);

    const requestBody = { username, email, password };

    try {
      await axios.post("http://localhost:5005/api/auth/signup", requestBody);
      navigate("/login");
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "Failed to create account. Please try again.";
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <div className="form-container">
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#1e293b" }}>
          Create an Account
        </h2>

        <form onSubmit={handleSignupSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="e.g., musiclover99"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {errorMessage && (
          <p style={{ color: "#dc2626", textAlign: "center", marginTop: "15px", fontWeight: "500" }}>
            {errorMessage}
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: "20px", color: "#64748b" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#4f46e5", fontWeight: "600" }}>
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}