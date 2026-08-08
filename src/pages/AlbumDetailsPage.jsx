import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AddReview from "../components/AddReview"; // <-- Import the new component
import { AuthContext } from "../context/auth.context"; // <-- Import your context

export default function AlbumDetailsPage() {
  const [album, setAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const { albumId } = useParams();
  const { isLoggedIn } = useContext(AuthContext); // <-- Grab the login status

  // We extract the fetch logic into a standalone function so we can reuse it
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

  if (isLoading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading album details...</p>;
  if (errorMessage) return <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>{errorMessage}</p>;
  if (!album) return <p style={{ textAlign: "center", marginTop: "50px" }}>Album not found.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ textAlign: "center" }}>
        <h1>{album.title}</h1>
        <h2 style={{ color: "#555" }}>By {album.artist}</h2>
        
        <div style={{ margin: "20px 0", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
          <p><strong>Genre:</strong> {album.genre}</p>
          <p><strong>Release Year:</strong> {album.releaseYear}</p>
        </div>
      </div>

      {/* --- REVIEWS SECTION --- */}
      <div style={{ marginTop: "40px" }}>
        <h3>Reviews</h3>
        
        {album.reviews && album.reviews.length > 0 ? (
          album.reviews.map((review) => (
            <div key={review._id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
              <p><strong>Rating:</strong> {review.rating}/5</p>
              <p>{review.content}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first!</p>
        )}
      </div>

      {/* Conditionally render the AddReview form only if logged in */}
      {isLoggedIn ? (
        <AddReview albumId={albumId} refreshAlbum={fetchAlbumDetails} />
      ) : (
        <p style={{ marginTop: "20px", fontStyle: "italic" }}>
          <Link to="/login">Log in</Link> to leave a review.
        </p>
      )}

      <div style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}>
        <Link to="/">
          <button style={{ padding: "10px 20px", cursor: "pointer" }}>Back to Albums</button>
        </Link>
      </div>
    </div>
  );
}