import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddAlbumPage() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState(2026);
  
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(undefined);

    // 1. Grab the stored JWT token for protected route authorization
    const storedToken = localStorage.getItem("authToken");

    // 2. Prepare the request body matching our Mongoose model
    const requestBody = {
      title,
      artist,
      genre,
      releaseYear: Number(releaseYear),
    };

    try {
      // 3. Send POST request with Authorization header
      const response = await axios.post(
        "http://localhost:5005/api/albums",
        requestBody,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      // 4. Redirect to the newly created album's detail page (or home page)
      navigate(`/albums/${response.data._id}`);
    } catch (error) {
      const errorDescription =
        error.response?.data?.message || "Failed to create album. Please try again.";
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <div className="form-container">
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#1e293b" }}>
          Add a New Album
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Album Title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Abbey Road"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="artist">Artist</label>
            <input
              id="artist"
              type="text"
              placeholder="e.g., The Beatles"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input
              id="genre"
              type="text"
              placeholder="e.g., Rock, Hip Hop, Pop"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="releaseYear">Release Year</label>
            <input
              id="releaseYear"
              type="number"
              min="1900"
              max="2030"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Saving Album..." : "Create Album"}
          </button>
        </form>

        {errorMessage && (
          <p style={{ color: "#dc2626", textAlign: "center", marginTop: "15px", fontWeight: "500" }}>
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}