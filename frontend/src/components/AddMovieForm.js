import React, { useState, useEffect } from "react";
import axios from "axios";

const AddMovieForm = () => {
  const [movie, setMovie] = useState({ id: "", title: "", total_seats: "" });
  const [existingIds, setExistingIds] = useState([]);

  // Fetch existing movie IDs
  useEffect(() => {
    axios.get("http://localhost:8000/movies")
      .then(res => {
        const ids = res.data.map(m => m.id);
        setExistingIds(ids);
      })
      .catch(err => console.error("Error fetching movies:", err));
  }, []);

  // Generate unique movie ID after existing IDs are loaded
  useEffect(() => {
    if (existingIds.length >= 0) {
      generateUniqueMovieId();
    }
  }, [existingIds]);

  const generateUniqueMovieId = () => {
    let newId = "";
    do {
      newId = `M-${Math.floor(100 + Math.random() * 900)}`;
    } while (existingIds.includes(newId));

    setMovie(prev => ({ ...prev, id: newId }));
  };

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8000/movies", movie)
      .then(() => {
        alert("Movie added!");
        setMovie({ id: "", title: "", total_seats: "" });
        generateUniqueMovieId(); // Reset with a new ID
      })
      .catch(err => alert(err.response?.data?.detail || "Add movie failed"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Movie</h2>

      <div className="form-row">
        <div>
          <label htmlFor="id">Movie ID:</label>
          <input type="text" name="id" value={movie.id} readOnly />
        </div>

        <div>
          <label htmlFor="title">Title:</label>
          <input
            name="title"
            placeholder="Movie Title"
            value={movie.title}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
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


      <button type="submit">Add</button>
    </form>
  );
};

export default AddMovieForm;
