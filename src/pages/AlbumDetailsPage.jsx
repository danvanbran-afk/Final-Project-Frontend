import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AddReview from "../components/AddReview";
import { AuthContext } from "../context/auth.context";

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
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading album details...</p>;
  }

  if (errorMessage) {
    return <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>{errorMessage}</p>;
  }

  if (!album) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Album not found.</p>;
  }

  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
      {/* --- MAIN ALBUM DETAILS CARD --- */}
      <div className="details-card">
        <h1 style={{ margin: "0 0 5px 0", color: "#0f172a", fontSize: "2rem" }}>
          {album.title}
        </h1>
        <h2 style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "1.3rem" }}>
          By {album.artist}
        </h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            backgroundColor: "#f8fafc",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Genre:</strong> {album.genre}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Release Year:</strong> {album.releaseYear}
          </p>
        </div>
      </div>

      {/* --- REVIEWS SECTION --- */}
      <div className="reviews-section">
        <h3 style={{ color: "#1e293b", marginBottom: "15px" }}>Community Reviews</h3>

        {album.reviews && album.reviews.length > 0 ? (
          album.reviews.map((review) => (
            <div key={review._id} className="review-card">
              <span className="rating-badge">★ {review.rating} / 5</span>
              <p style={{ margin: "8px 0 0 0", color: "#334155", lineHeight: "1.5" }}>
                {review.content}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: "#64748b", fontStyle: "italic" }}>
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
            padding: "15px",
            textAlign: "center",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <p style={{ margin: 0, color: "#475569" }}>
            <Link to="/login" style={{ color: "#4f46e5", fontWeight: "600" }}>
              Log in
            </Link>{" "}
            to leave a review for this album.
          </p>
        </div>
      )}

      {/* --- BACK BUTTON --- */}
      <div style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}>
        <Link to="/" style={{ textDecoration: "none", width: "100%", maxWidth: "200px" }}>
          <button
            className="btn-primary"
            style={{ backgroundColor: "#64748b" }}
          >
            ← Back to Albums
          </button>
        </Link>
      </div>
    </div>
  );
}