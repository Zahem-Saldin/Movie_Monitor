import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Dashboard.css";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : "http://movie-api:8000";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both bookings and movies data in parallel
        const [bookingsRes, moviesRes] = await Promise.all([
          axios.get(`${API_BASE}/bookings`),
          axios.get(`${API_BASE}/movies`)
        ]);

        // Create a mapping of movie_id to movie title
        const movieMap = moviesRes.data.reduce((map, movie) => {
          map[movie.id] = movie.title;
          return map;
        }, {});

        // Merge movie titles into bookings
        const bookingsWithMovieTitles = bookingsRes.data.map(booking => ({
          ...booking,
          movie_title: movieMap[booking.movie_id] || "Unknown Movie"
        }));

        setBookings(bookingsWithMovieTitles);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  if (bookings.length === 0) {
    return <p>No bookings found.</p>;
  }

  return (
    <div>
      <h2>All Bookings</h2>
      <div className="booking-container">
        {bookings.map((booking) => (
          <div className="booking-card" key={booking.booking_id}>
            <strong className="booking-id">Booking #{booking.booking_id}</strong>
            <br />
            Movie: {booking.movie_title}<br />
            Seats: {booking.seats}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingList;
