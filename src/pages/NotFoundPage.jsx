import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page-container" style={{ textAlign: "center", marginTop: "60px" }}>
      <h1 style={{ fontSize: "4rem", margin: "0", color: "#4f46e5" }}>404</h1>
      <h2 style={{ fontSize: "1.75rem", color: "#1e293b", margin: "10px 0 15px 0" }}>
        Page Not Found
      </h2>
      <p style={{ color: "#64748b", maxWidth: "450px", margin: "0 auto 25px auto" }}>
        Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or didn't exist in the first place.
      </p>

      <Link to="/" style={{ textDecoration: "none" }}>
        <button
          className="btn-primary"
          style={{ maxWidth: "200px", margin: "0 auto" }}
        >
          ← Return Home
        </button>
      </Link>
    </div>
  );
}