import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : "http://movie-api:8000";

const AddMovieForm = () => {
  const [movie, setMovie] = useState({ id: "", title: "", total_seats: "" });
  const [existingIds, setExistingIds] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/movies`)
      .then(res => {
        const ids = res.data.map(m => m.id);
        setExistingIds(ids);
        generateUniqueMovieId(ids);
      })
      .catch(err => console.error("Error fetching movies:", err));
  }, []);

  const generateUniqueMovieId = (ids = existingIds) => {
    let newId;
    do {
      newId = `M-${Math.floor(100 + Math.random() * 900)}`;
    } while (ids.includes(newId));
    setMovie(prev => ({ ...prev, id: newId }));
  };

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...movie, total_seats: Number(movie.total_seats) };

    axios.post(`${API_BASE}/movies`, payload)
      .then(() => {
        alert("Movie added!");
        setMovie({ id: "", title: "", total_seats: "" });
        generateUniqueMovieId();
      })
      .catch(err => {
        alert(err.response?.data?.detail || "Add movie failed");
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Add Movie</h2>

      <div className="form-row" style={{ marginBottom: "10px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="id">Movie ID:</label>
          <input
            type="text"
            name="id"
            value={movie.id}
            readOnly
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="title">Title:</label>
          <input
            name="title"
            placeholder="Movie Title"
            value={movie.title}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="total_seats">Total Seats:</label>
        <input
          type="number"
          name="total_seats"
          placeholder="Total Seats"
          value={movie.total_seats}
          onChange={handleChange}
          required
          style={{ width: "100%" }}
        />
      </div>

      <button type="submit" style={{ padding: "8px 16px" }}>Add Movie</button>
    </form>
  );
};

export default AddMovieForm;
