import React, { useState, useEffect } from "react";
import axios from "axios";

const CancelBooking = () => {
  const [bookingId, setBookingId] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, moviesRes] = await Promise.all([
          axios.get("http://localhost:8000/bookings"),
          axios.get("http://localhost:8000/movies")
        ]);

        const moviesMap = {};
        moviesRes.data.forEach(movie => {
          moviesMap[movie.id] = movie.title; // Adjust key based on actual response
        });

        const bookingsWithNames = bookingsRes.data.map(booking => ({
          ...booking,
          movie_name: moviesMap[booking.movie_id] || "Unknown Movie"
        }));

        setBookings(bookingsWithNames);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const cancelBooking = () => {
    if (!bookingId) {
      alert("Please select a booking to cancel.");
      return;
    }

    axios.delete(`http://localhost:8000/bookings/${bookingId}`)
      .then(() => {
        alert("Booking cancelled");
        // Remove the cancelled booking from the list
        setBookings(prev => prev.filter(b => b.booking_id !== bookingId));
        setBookingId(""); // Reset selection
      })
      .catch(err => {
        const msg = err.response?.data?.detail || "Error cancelling booking";
        alert(msg);
      });
  };

  return (
    <div>
      <h2>Cancel Booking</h2>
      <select id="booking_canc"
        value={bookingId}
        onChange={e => setBookingId(e.target.value)}
      >
        <option value="">-- Select a booking --</option>
        {bookings.map(booking => (
          <option key={booking.booking_id} value={booking.booking_id}>
            {booking.movie_name} – Booking #{booking.booking_id} ({booking.seats} seats)
          </option>
        ))}
      </select>
      <button id="cancel" onClick={cancelBooking} disabled={!bookingId}>
        Cancel
      </button>
    </div>
  );
};

export default CancelBooking;
