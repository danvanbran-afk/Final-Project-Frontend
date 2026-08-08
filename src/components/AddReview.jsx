import { useState } from "react";
import axios from "axios";

export default function AddReview({ albumId, refreshAlbum }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(undefined);

    // Grab the token from localStorage
    const storedToken = localStorage.getItem("authToken");

    const requestBody = {
      content,
      rating,
      albumId,
    };

    try {
      // POST request with the authorization header
      await axios.post(
        "http://localhost:5005/api/reviews",
        requestBody,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      // Clear the form fields on success
      setContent("");
      setRating(5);
      
      // Tell the parent component to fetch the updated album data
      refreshAlbum();
    } catch {
      setErrorMessage("Failed to post your review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f4f4f4", borderRadius: "8px" }}>
      <h3>Leave a Review</h3>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label>Rating (1-5):</label>
        <input 
          type="number" 
          min="1" 
          max="5" 
          value={rating} 
          onChange={(e) => setRating(Number(e.target.value))} 
          required 
        />

        <label>Review:</label>
        <textarea 
          rows="4" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
          style={{ resize: "vertical" }}
        />

        <button type="submit" disabled={isLoading} style={{ padding: "10px", marginTop: "10px", cursor: "pointer" }}>
          {isLoading ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}
    </div>
  );
}