import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AddReview from "../components/AddReview";
import { AuthContext } from "../context/auth.context";

// Helper function: Generates guaranteed-to-load SVG music art
function getAlbumCover(title = "") {
  const cleanTitle = title.trim().toLowerCase();
  
  let bg1 = "#6366f1", bg2 = "#a855f7", text = "ALBUM";
  
  if (cleanTitle.includes("abbey road")) { bg1 = "#1e293b"; bg2 = "#475569"; text = "ABBEY ROAD"; }
  else if (cleanTitle.includes("thriller")) { bg1 = "#7c2d12"; bg2 = "#c2410c"; text = "THRILLER"; }
  else if (cleanTitle.includes("dark side")) { bg1 = "#09090b"; bg2 = "#3f3f46"; text = "DARK SIDE"; }
  else if (cleanTitle.includes("rumours")) { bg1 = "#831843"; bg2 = "#db2777"; text = "RUMOURS"; }
  else if (cleanTitle.includes("random access")) { bg1 = "#172554"; bg2 = "#2563eb"; text = "DAFT PUNK"; }
  else if (cleanTitle.includes("nevermind")) { bg1 = "#064e3b"; bg2 = "#059669"; text = "NIRVANA"; }

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}" />
        <stop offset="100%" stop-color="${bg2}" />
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#grad)" />
    <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="25" />
    <circle cx="200" cy="200" r="30" fill="#0b0f19" />
    <text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="800" font-size="22" letter-spacing="2">${text}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export default function AlbumDetailsPage() {
  const [album, setAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const { albumId } = useParams();
  const { isLoggedIn } = useContext(AuthContext);

  const fetchAlbumDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/api/albums/${albumId}`);
      setAlbum(response.data);
    } catch {
      setErrorMessage("Failed to load album details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        const response = await axios.get(`http://localhost:5005/api/albums/${albumId}`);
        setAlbum(response.data);
      } catch {
        setErrorMessage("Failed to load album details.");
      } finally {
        setIsLoading(false);
      }
    };
    loadAlbum();
  }, [albumId]);

  if (isLoading) {
    return <p style={{ textAlign: "center", marginTop: "50px", color: "#f8fafc" }}>Loading album details...</p>;
  }

  if (errorMessage) {
    return <p style={{ color: "#f87171", textAlign: "center", marginTop: "50px" }}>{errorMessage}</p>;
  }

  if (!album) {
    return <p style={{ textAlign: "center", marginTop: "50px", color: "#f8fafc" }}>Album not found.</p>;
  }

  const coverUrl = getAlbumCover(album.title);

  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
      {/* --- MAIN ALBUM DETAILS CARD --- */}
      <div className="details-card" style={{ display: "flex", gap: "25px", flexWrap: "wrap", alignItems: "center" }}>
        {/* Album Artwork Cover */}
        <div style={{ width: "180px", height: "180px", flexShrink: 0, borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 25px rgba(0,0,0,0.5)" }}>
          <img
            src={coverUrl}
            alt={`${album.title} cover`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Album Metadata */}
        <div style={{ flexGrow: 1, minWidth: "250px" }}>
          <h1 style={{ margin: "0 0 8px 0", color: "#f8fafc", fontSize: "2.2rem", fontWeight: "800" }}>
            {album.title}
          </h1>
          <h2 style={{ margin: "0 0 18px 0", color: "#c084fc", fontSize: "1.3rem", fontWeight: "600" }}>
            By {album.artist}
          </h2>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <p style={{ margin: 0, color: "#cbd5e1" }}>
              <strong style={{ color: "#f8fafc" }}>Genre:</strong> {album.genre}
            </p>
            <p style={{ margin: 0, color: "#cbd5e1" }}>
              <strong style={{ color: "#f8fafc" }}>Release Year:</strong> {album.releaseYear}
            </p>
          </div>
        </div>
      </div>

      {/* --- REVIEWS SECTION --- */}
      <div className="reviews-section">
        <h3 style={{ color: "#f8fafc", marginBottom: "18px", fontSize: "1.4rem", fontWeight: "700" }}>
          Community Reviews
        </h3>

        {album.reviews && album.reviews.length > 0 ? (
          album.reviews.map((review) => (
            <div key={review._id} className="review-card">
              <span className="rating-badge">★ {review.rating} / 5</span>
              <p style={{ margin: "8px 0 0 0", color: "#e2e8f0", lineHeight: "1.6" }}>
                {review.content}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: "#94a3b8", fontStyle: "italic" }}>
            No reviews yet. Be the first to share your thoughts!
          </p>
        )}
      </div>

      {/* --- CONDITIONAL REVIEW FORM --- */}
      {isLoggedIn ? (
        <AddReview albumId={albumId} refreshAlbum={fetchAlbumDetails} />
      ) : (
        <div
          style={{
            marginTop: "25px",
            padding: "18px",
            textAlign: "center",
            backgroundColor: "rgba(19, 27, 46, 0.8)",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <p style={{ margin: 0, color: "#94a3b8" }}>
            <Link to="/login" style={{ color: "#c084fc", fontWeight: "700", textDecoration: "none" }}>
              Log in
            </Link>{" "}
            to leave a review for this album.
          </p>
        </div>
      )}

      {/* --- BACK BUTTON --- */}
      <div style={{ marginTop: "35px", display: "flex", justifyContent: "center" }}>
        <Link to="/" style={{ textDecoration: "none", width: "100%", maxWidth: "220px" }}>
          <button
            className="btn-primary"
            style={{ background: "#334155", boxShadow: "none" }}
          >
            ← Back to Albums
          </button>
        </Link>
      </div>
    </div>
  );
}