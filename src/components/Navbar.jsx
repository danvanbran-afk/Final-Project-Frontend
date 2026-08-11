import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

export default function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🎵 MusicPlatform
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {isLoggedIn ? (
          <>
            <Link to="/albums/create">Add Album</Link>
            <span style={{ color: "#475569" }}>|</span>
            <span style={{ fontWeight: "600", color: "#f8fafc" }}>
              Hi, {user && user.username}!
            </span>
            <button onClick={logOutUser} className="nav-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" className="nav-btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "none" }}>
              Sign Up
            </Link>
            <Link to="/login" className="nav-btn">
              Log In
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}