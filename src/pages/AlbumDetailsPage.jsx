import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AddReview from "../components/AddReview";
import { AuthContext } from "../context/auth.context";

export default function AlbumDetailsPage() {
  const [album, setAlbum] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const params = useParams();
  const actualId = params.albumId || params.id; 

  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAlbumData = async () => {
      if (!actualId) {
        setErrorMessage("Error: Album ID is missing from the URL.");
        setIsLoading(false);
        return;
      }

      try {
        const [albumResponse, reviewsResponse] = await Promise.all([
          axios.get(`http://localhost:5005/api/albums/${actualId}`),
          axios.get(`http://localhost:5005/api/reviews/${actualId}`)
        ]);

        setAlbum(albumResponse.data);
        setReviews(reviewsResponse.data);
      } catch (err) {
        console.error("API Error details:", err);
        setErrorMessage(err.response?.data?.message || "Failed to load album details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumData();
  }, [actualId]);

  const refreshAlbumDetails = async () => {
    try {
      const reviewsResponse = await axios.get(`http://localhost:5005/api/reviews/${actualId}`);
      setReviews(reviewsResponse.data);
    } catch (err) {
      console.error("Failed to refresh album reviews.", err);
    }
  };

  const handleDeleteAlbum = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      await axios.delete(`http://localhost:5005/api/albums/${actualId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      navigate("/");
    } catch {
      alert("Failed to delete the album. You can only delete albums you created.");
    }
  };

  if (isLoading) {
    return <p style={{ textAlign: "center", marginTop: "50px", color: "#f8fafc" }}>Loading album details...</p>;
  }

  if (errorMessage) {
    return <p style={{ color: "#f87171", textAlign: "center", marginTop: "50px" }}>{errorMessage}</p>;
  }

  if (!album) {
    return <p style={{ textAlign: "center", marginTop: "50px", color: "#f8fafc" }}>Album not found.</p>;
  }

  const isOwner = isLoggedIn && user && album.owner && (album.owner._id === user._id || album.owner === user._id);

  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
      <div className="details-card" style={{ display: "flex", gap: "25px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ width: "180px", height: "180px", flexShrink: 0, borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 25px rgba(0,0,0,0.5)" }}>
          <img
            src={album.coverImageUrl}
            alt={`${album.title} cover`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

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
              marginBottom: "15px"
            }}
          >
            <p style={{ margin: 0, color: "#cbd5e1" }}>
              <strong style={{ color: "#f8fafc" }}>Genre:</strong> {album.genre}
            </p>
            <p style={{ margin: 0, color: "#cbd5e1" }}>
              <strong style={{ color: "#f8fafc" }}>Release Year:</strong> {album.releaseYear}
            </p>
          </div>

          {isOwner && (
            <button
              onClick={handleDeleteAlbum}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(239, 68, 68, 0.4)",
              }}
            >
              🗑️ Delete Album
            </button>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h3 style={{ color: "#f8fafc", marginBottom: "18px", fontSize: "1.4rem", fontWeight: "700" }}>
          Community Reviews
        </h3>

        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="rating-badge">★ {review.rating} / 5</span>
                {review.author && (
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                    By {review.author.username}
                  </span>
                )}
              </div>
              <p style={{ margin: "12px 0 0 0", color: "#e2e8f0", lineHeight: "1.6" }}>
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: "#94a3b8", fontStyle: "italic" }}>
            No reviews yet. Be the first to share your thoughts!
          </p>
        )}
      </div>

      {isLoggedIn ? (
        <AddReview albumId={actualId} refreshAlbum={refreshAlbumDetails} />
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