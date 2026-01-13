import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Dashboard.css";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : "http://movie-api:8000";


const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_BASE}/movies`);
        setMovies(res.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p>Loading movies...</p>;
  if (movies.length === 0) return <p>No movies found.</p>;

  return (
    <div>
      <h2>All Movies</h2>
      <div className="movie-list-container">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <h3>{movie.title}</h3>
            <p id="seats">Total Seats: {movie.total_seats}</p>
            <p id="booked">Booked: {movie.booked_seats}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
