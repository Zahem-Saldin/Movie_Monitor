import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : "http://movie-api:8000";

const BookTicketForm = () => {
  const [booking, setBooking] = useState({ booking_id: "", movie_id: "", seats: "" });
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch movies and existing bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, bookingsRes] = await Promise.all([
          axios.get(`${API_BASE}/movies`),
          axios.get(`${API_BASE}/bookings`)
        ]);
        setMovies(moviesRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Generate unique booking ID once bookings are loaded
  useEffect(() => {
    if (!loading) {
      generateUniqueBookingId();
    }
  }, [bookings, loading]);

  const generateUniqueBookingId = () => {
    const existingIds = bookings.map(b => b.booking_id);
    let newId;
    do {
      newId = `B-${Math.floor(100 + Math.random() * 900)}`;
    } while (existingIds.includes(newId));
    setBooking(prev => ({ ...prev, booking_id: newId }));
  };

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert seats to number
    const payload = { ...booking, seats: Number(booking.seats) };

    axios.post(`${API_BASE}/bookings`, payload)
      .then(() => {
        alert("Booking successful!");
        generateUniqueBookingId(); // Reset to new ID after booking
        setBooking(prev => ({ ...prev, movie_id: "", seats: "" }));
      })
      .catch(err => alert(err.response?.data?.detail || "Booking failed"));
  };

  if (loading) return <p>Loading movies and bookings...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Book Tickets</h2>

      <div className="form-row" style={{ marginBottom: "10px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="booking_id">Booking ID:</label>
          <input
            type="text"
            name="booking_id"
            value={booking.booking_id}
            readOnly
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="movie_id">Movie:</label>
          <select
            name="movie_id"
            value={booking.movie_id}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          >
            <option value="" disabled>Select a movie</option>
            {movies.map(movie => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="seats">Seats to Book:</label>
        <input
          type="number"
          name="seats"
          placeholder="Seats"
          value={booking.seats}
          onChange={handleChange}
          required
          min={1}
          style={{ width: "100%" }}
        />
      </div>

      <button type="submit" style={{ padding: "8px 16px" }}>Book</button>
    </form>
  );
};

export default BookTicketForm;
