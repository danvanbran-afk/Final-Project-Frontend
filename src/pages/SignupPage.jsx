import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false); // Implementing the loader requirement

  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault(); // Prevents the default HTML page refresh
    setIsLoading(true);
    setErrorMessage(undefined);

    const requestBody = { email, password, username };

    try {
      // Hit your Express backend
      await axios.post("http://localhost:5005/api/auth/signup", requestBody);
      // If successful, redirect to the login page
      navigate("/login");
    } catch (error) {
      // If the server rejects the request (e.g., email already exists)
      const errorDescription = error.response?.data?.message || "Something went wrong";
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Sign Up</h2>

      <form onSubmit={handleSignupSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <label>Username:</label>
        <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Email:</label>
        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" disabled={isLoading} style={{ padding: "10px", marginTop: "10px" }}>
          {isLoading ? "Processing..." : "Sign Up"}
        </button>
      </form>

      {/* Error Handling UI */}
      {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}

      <p style={{ marginTop: "20px" }}>Already have an account?</p>
      <Link to="/login">Login here</Link>
    </div>
  );
}