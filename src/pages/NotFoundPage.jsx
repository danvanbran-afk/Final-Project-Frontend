import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: "center", padding: "50px", marginTop: "50px" }}>
      <h1 style={{ fontSize: "4rem", marginBottom: "10px" }}>404</h1>
      <h2>Page Not Found</h2>
      <p>Looks like this track is skipping. The page you are looking for doesn't exist.</p>
      
      <Link to="/">
        <button style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer" }}>
          Back to Home
        </button>
      </Link>
    </div>
  );
}