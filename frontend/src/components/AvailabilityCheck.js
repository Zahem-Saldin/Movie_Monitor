import React, { useState } from "react";
import axios from "axios";
import "../Dashboard.css";

const AvailabilityCheck = () => {
  const [movieId, setMovieId] = useState("");
  const [availability, setAvailability] = useState([]);

  const checkAvailability = () => {
    const url = movieId
      ? `http://localhost:8000/availability?movie_id=${movieId}`
      : `http://localhost:8000/availability`;
    axios.get(url)
      .then(res => setAvailability(res.data))
      .catch(err => console.error(err));
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
        <button id="check" onClick={checkAvailability}>Check</button></div>
      </div>

      {availability.map(item => (
        <div key={item.movie_id} className="availability-card">
          <h3 id="available_title">{item.title}</h3>
          <p id="available_seats">Available Seats: {item.available_seats}</p>
        </div>
      ))}
    </div>
  );
};

export default AvailabilityCheck;
