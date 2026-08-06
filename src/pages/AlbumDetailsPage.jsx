import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function AlbumDetailsPage() {
  const [album, setAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(undefined);

  // 1. Destructure the dynamic parameter from the URL
  const { albumId } = useParams();

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        // 2. Fetch the specific album using the ID
        const response = await axios.get(`http://localhost:5005/api/albums/${albumId}`);
        setAlbum(response.data);
      } catch {
        setErrorMessage("Failed to load album details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [albumId]); // The effect re-runs if the URL ID changes

  // 3. Conditional rendering for our loading and error states
  if (isLoading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading album details...</p>;
  if (errorMessage) return <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>{errorMessage}</p>;
  if (!album) return <p style={{ textAlign: "center", marginTop: "50px" }}>Album not found.</p>;

  // 4. Render the actual data
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h1>{album.title}</h1>
      <h2 style={{ color: "#555" }}>By {album.artist}</h2>
      
      <div style={{ margin: "20px 0", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
        <p><strong>Genre:</strong> {album.genre}</p>
        <p><strong>Release Year:</strong> {album.releaseYear}</p>
        {/* If you have a description or image field in your model, you can add it here! */}
      </div>

      <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "15px" }}>
        <Link to="/">
          <button style={{ padding: "10px 20px", cursor: "pointer" }}>Back to Albums</button>
        </Link>
      </div>
    </div>
  );
}