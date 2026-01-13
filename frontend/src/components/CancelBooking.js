import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : "http://movie-api:8000";

const CancelBooking = () => {
  const [bookingId, setBookingId] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bookings and movies in parallel
        const [bookingsRes, moviesRes] = await Promise.all([
          axios.get(`${API_BASE}/bookings`),
          axios.get(`${API_BASE}/movies`)
        ]);

        // Map movie IDs to titles
        const moviesMap = {};
        moviesRes.data.forEach(movie => {
          moviesMap[movie.id] = movie.title;
        });

        // Merge movie names into bookings
        const bookingsWithNames = bookingsRes.data.map(booking => ({
          ...booking,
          movie_name: moviesMap[booking.movie_id] || "Unknown Movie"
        }));

        setBookings(bookingsWithNames);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cancelBooking = () => {
    if (!bookingId) {
      alert("Please select a booking to cancel.");
      return;
    }

    axios.delete(`${API_BASE}/bookings/${bookingId}`)
      .then(() => {
        alert("Booking cancelled successfully");
        // Remove cancelled booking from local state
        setBookings(prev => prev.filter(b => b.booking_id !== bookingId));
        setBookingId(""); // Reset selection
      })
      .catch(err => {
        const msg = err.response?.data?.detail || "Error cancelling booking";
        alert(msg);
      });
  };

  if (loading) return <p>Loading bookings...</p>;
  if (bookings.length === 0) return <p>No bookings to cancel.</p>;

  return (
    <div>
      <h2>Cancel Booking</h2>
      <select
        id="booking_canc"
        value={bookingId}
        onChange={e => setBookingId(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <option value="">-- Select a booking --</option>
        {bookings.map(booking => (
          <option key={booking.booking_id} value={booking.booking_id}>
            {booking.movie_name} – Booking #{booking.booking_id} ({booking.seats} seats)
          </option>
        ))}
      </select>
      <button
        id="cancel"
        onClick={cancelBooking}
        disabled={!bookingId}
        style={{ padding: "8px 16px" }}
      >
        Cancel
      </button>
    </div>
  );
};

export default CancelBooking;
