import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Dashboard.css";

const MovieList = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/movies")
      .then(res => setMovies(res.data))
      .catch(err => console.error(err));
  }, []);

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
