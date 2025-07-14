import React, { useState, useEffect } from "react";
import axios from "axios";

const BookTicketForm = () => {
  const [booking, setBooking] = useState({ booking_id: "", movie_id: "", seats: "" });
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Fetch movies and existing bookings
  useEffect(() => {
    axios.get("http://localhost:8000/movies")
      .then(res => setMovies(res.data))
      .catch(err => console.error("Error fetching movies:", err));

    axios.get("http://localhost:8000/bookings")
      .then(res => setBookings(res.data))
      .catch(err => console.error("Error fetching bookings:", err));
  }, []);

  // Generate unique booking ID once bookings are loaded
  useEffect(() => {
    if (bookings.length > 0) {
      generateUniqueBookingId();
    }
  }, [bookings]);

  const generateUniqueBookingId = () => {
    const existingIds = bookings.map(b => b.booking_id);
    let newId = "";

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
    axios.post("http://localhost:8000/bookings", booking)
      .then(() => {
        alert("Booking successful!");
        generateUniqueBookingId(); // Reset to new ID after booking
        setBooking(prev => ({ ...prev, movie_id: "", seats: "" }));
      })
      .catch(err => alert(err.response?.data?.detail || "Booking failed"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Book Tickets</h2>

      <div className="form-row">
        <div>
          <label htmlFor="booking_id">Booking ID:</label>
          <input
            type="text"
            name="booking_id"
            value={booking.booking_id}
            readOnly
          />
        </div>

        <div>
          <label htmlFor="movie_id">Movie:</label>
          <select
            name="movie_id"
            value={booking.movie_id}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select</option>
            {movies.map(movie => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="seats">Seats to Book:</label>
        <input
          type="number"
          name="seats"
          placeholder="Seats"
          value={booking.seats}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Book</button>
    </form>

  );
};

export default BookTicketForm;
