import React, { useState } from "react";
import axios from "axios";
import "../Dashboard.css";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : "http://movie-api:8000";

const AvailabilityCheck = () => {
  const [movieId, setMovieId] = useState("");
  const [availability, setAvailability] = useState([]);

  const checkAvailability = () => {
    // Use API_BASE instead of hardcoded localhost
    const url = movieId
      ? `${API_BASE}/availability?movie_id=${movieId}`
      : `${API_BASE}/availability`;

    axios.get(url)
      .then(res => setAvailability(res.data))
      .catch(err => console.error("Error fetching availability:", err));
  };

  return (
    <div className="availability-container">
      <h2 className="avail-heading">Check Availability</h2>

      <div className="input-wrapper">
        <input
          id="avail"
          placeholder="Movie ID (optional)"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
        />
        <div>
          <button id="check" onClick={checkAvailability}>Check</button>
        </div>
      </div>

      <div className="availability-results">
        {availability.length === 0 && <p>No results found.</p>}
        {availability.map(item => (
          <div key={item.movie_id} className="availability-card">
            <h3 id="available_title">{item.title}</h3>
            <p id="available_seats">Available Seats: {item.available_seats}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityCheck;
