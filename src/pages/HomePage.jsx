import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Helper function: Generates guaranteed-to-load SVG music art
function getAlbumCover(title = "") {
  const cleanTitle = title.trim().toLowerCase();
  
  // Custom colored SVGs encoded as data URIs
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

export default function HomePage() {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(undefined);

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

  if (isLoading) {
    return <p style={{ textAlign: "center", marginTop: "50px", color: "#f8fafc" }}>Loading albums...</p>;
  }

  if (errorMessage) {
    return <p style={{ color: "#f87171", textAlign: "center", marginTop: "50px" }}>{errorMessage}</p>;
  }

  return (
    <div className="page-container">
      <div style={{ textAlign: "center", marginBottom: "35px" }}>
        <h1 style={{ fontSize: "2.4rem", color: "#f8fafc", marginBottom: "8px", fontWeight: "800" }}>
          Discover Albums
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.05rem" }}>
          Explore iconic records, leave community reviews, and share your favorite music.
        </p>
      </div>

      {albums.length === 0 ? (
        <p style={{ textAlign: "center", color: "#94a3b8" }}>
          No albums found. Be the first to add one!
        </p>
      ) : (
        <div className="album-grid">
          {albums.map((album) => {
            const coverUrl = getAlbumCover(album.title);

            return (
              <div key={album._id} className="album-card">
                {/* --- ALBUM COVER ARTWORK --- */}
                <div className="album-cover-wrapper">
                  <img
                    src={coverUrl}
                    alt={`${album.title} cover`}
                    className="album-cover-img"
                  />
                </div>

                {/* --- ALBUM METADATA & BUTTON --- */}
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

                  <Link to={`/albums/${album._id}`} style={{ textDecoration: "none" }}>
                    <button
                      className="btn-primary"
                      style={{ marginTop: "12px", width: "100%" }}
                    >
                      View Details & Reviews
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}