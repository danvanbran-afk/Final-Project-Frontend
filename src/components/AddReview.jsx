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

    const storedToken = localStorage.getItem("authToken");

    const requestBody = {
      content,
      rating: Number(rating),
      albumId,
    };

    try {
      await axios.post(
        "http://localhost:5005/api/reviews",
        requestBody,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      setContent("");
      setRating(5);
      refreshAlbum();
    } catch {
      setErrorMessage("Failed to post your review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ marginTop: "30px", maxWidth: "100%" }}>
      <h3 style={{ marginBottom: "15px", color: "#f8fafc", fontSize: "1.25rem" }}>
        Leave a Review
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rating (1 to 5):</label>
          <div className="rating-squares-container">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`rating-square-btn ${rating === num ? "active" : ""}`}
                onClick={() => setRating(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">Your Review:</label>
          <textarea
            id="content"
            rows="4"
            placeholder="What did you think of this album?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ resize: "vertical" }}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Submitting Review..." : "Submit Review"}
        </button>
      </form>

      {errorMessage && (
        <p style={{ color: "#f87171", textAlign: "center", marginTop: "10px", fontWeight: "500" }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}