import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const [albums, setAlbums] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/albums");
        setAlbums(response.data);
      } catch {
        setErrorMessage("Failed to load albums. Make sure the backend is running!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const filteredAlbums = albums.filter((album) => {
    const query = searchQuery.toLowerCase();
    return (
      album.title.toLowerCase().includes(query) ||
      album.artist.toLowerCase().includes(query) ||
      album.genre.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return <p style={{ textAlign: "center", marginTop: "50px", color: "#f8fafc" }}>Loading albums...</p>;
  }

  if (errorMessage) {
    return <p style={{ color: "#f87171", textAlign: "center", marginTop: "50px" }}>{errorMessage}</p>;
  }

  return (
    <div className="page-container">
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2.4rem", color: "#f8fafc", marginBottom: "8px", fontWeight: "800" }}>
          Discover Albums
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.05rem", marginBottom: "20px" }}>
          Explore iconic records, leave community reviews, and share your favorite music.
        </p>

        <div style={{ maxWidth: "450px", margin: "0 auto" }}>
          <input
            type="text"
            placeholder="Search by title, artist, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 18px",
              backgroundColor: "rgba(19, 27, 46, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "10px",
              color: "#f8fafc",
              fontSize: "1rem",
              outline: "none",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {filteredAlbums.length === 0 ? (
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "40px" }}>
          No albums match your search criteria.
        </p>
      ) : (
        <div className="album-grid">
          {filteredAlbums.map((album) => (
            <div key={album._id} className="album-card">
              <div className="album-cover-wrapper">
                <img
                  src={album.coverImageUrl}
                  alt={`${album.title} cover`}
                  className="album-cover-img"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div className="album-card-content">
                <div>
                  <h3>{album.title}</h3>
                  <p className="artist-name">{album.artist}</p>

                  <div className="meta-info">
                    <p style={{ margin: "4px 0", color: "#cbd5e1" }}>
                      <strong style={{ color: "#f8fafc" }}>Genre:</strong> {album.genre}
                    </p>
                    <p style={{ margin: "4px 0", color: "#cbd5e1" }}>
                      <strong style={{ color: "#f8fafc" }}>Released:</strong> {album.releaseYear}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/albums/${album._id}`)}
                  className="btn-primary"
                  style={{ marginTop: "12px", width: "100%", cursor: "pointer" }}
                >
                  View Details & Reviews
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}