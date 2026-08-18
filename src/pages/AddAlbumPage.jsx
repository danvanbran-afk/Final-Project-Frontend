import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddAlbumPage() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("authToken");

    const requestBody = {
      title,
      artist,
      genre,
      releaseYear: Number(releaseYear),
      coverImageUrl: coverImageUrl || undefined 
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
      await axios.post(`${API_URL}/api/albums`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      navigate("/");
    } catch (error) {
      const errorDescription = error.response?.data?.message || "Failed to create album. Please check your inputs.";
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div className="page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "rgba(19, 27, 46, 0.95)",
          padding: "40px",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#f8fafc", fontSize: "1.8rem", marginBottom: "25px", fontWeight: "800" }}>
          Add a New Album
        </h1>

        {errorMessage && (
          <p style={{ color: "#ef4444", textAlign: "center", marginBottom: "20px", fontSize: "0.95rem" }}>
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px", letterSpacing: "1px" }}>
              ALBUM TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                backgroundColor: "#0b0f19",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                color: "#f8fafc",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px", letterSpacing: "1px" }}>
              ARTIST
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                backgroundColor: "#0b0f19",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                color: "#f8fafc",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px", letterSpacing: "1px" }}>
              GENRE
            </label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                backgroundColor: "#0b0f19",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                color: "#f8fafc",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px", letterSpacing: "1px" }}>
              RELEASE YEAR
            </label>
            <input
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                backgroundColor: "#0b0f19",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                color: "#f8fafc",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px", letterSpacing: "1px" }}>
              COVER IMAGE URL (Optional)
            </label>
            <input
              type="text"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
              style={{
                width: "100%",
                padding: "14px 16px",
                backgroundColor: "#0b0f19",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                color: "#f8fafc",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: "10px", padding: "14px", width: "100%", fontSize: "1rem", fontWeight: "700", cursor: "pointer" }}
          >
            Create Album
          </button>
        </form>
      </div>
    </div>
  );
}