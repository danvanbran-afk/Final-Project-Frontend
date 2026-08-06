import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(undefined);

  // This hook runs once when the page first loads
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        // Hit the public GET route on your Express server
        const response = await axios.get("http://localhost:5005/api/albums");
        
        // Save the array of albums to our state
        setAlbums(response.data);
      } catch (err) {
        // include error message for easier debugging while still showing a user-friendly message
        console.error("Error fetching albums:", err);
        setErrorMessage("Failed to load albums from the server.");
      } finally {
        setIsLoading(false); // Stop the loader whether it succeeded or failed
      }
    };

    fetchAlbums();
  }, []); // The empty array ensures this only runs once

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Discover Albums</h1>

      {/* Required Feature: Loader */}
      {isLoading && <p style={{ textAlign: "center", fontSize: "1.2rem" }}>Loading albums...</p>}
      
      {/* Required Feature: Error Handling */}
      {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
        gap: "20px" 
      }}>
        {albums.map((album) => (
          <div key={album._id} style={{ 
            border: "1px solid #ddd", 
            borderRadius: "8px", 
            padding: "20px", 
            backgroundColor: "#f9f9f9",
            textAlign: "center"
          }}>
            <h3 style={{ margin: "0 0 10px 0" }}>{album.title}</h3>
            <p style={{ margin: "0 0 15px 0", color: "#555" }}>By {album.artist}</p>
            
            {/* This link will point to a details page we build next */}
            <Link to={`/albums/${album._id}`}>
              <button style={{ 
                padding: "8px 16px", 
                backgroundColor: "#282c34", 
                color: "white", 
                border: "none", 
                borderRadius: "4px",
                cursor: "pointer"
              }}>
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}