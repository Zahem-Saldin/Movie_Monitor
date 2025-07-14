import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Dashboard.css";


const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both bookings and movies data
        const [bookingsRes, moviesRes] = await Promise.all([
          axios.get("http://localhost:8000/bookings"),
          axios.get("http://localhost:8000/movies")
        ]);

        // Create a mapping of movie_id to movie title
        const movieMap = moviesRes.data.reduce((map, movie) => {
          map[movie.id] = movie.title;
          return map;
        }, {});

        // Add movie titles to bookings based on movie_id
        const bookingsWithMovieTitles = bookingsRes.data.map(booking => ({
          ...booking,
          movie_title: movieMap[booking.movie_id] || "Unknown Movie"  // Handle case where movie_id doesn't exist
        }));

        setBookings(bookingsWithMovieTitles);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>All Bookings</h2>
      <div className="booking-container">
        {bookings.map((booking) => (
          <div className="booking-card" key={booking.booking_id}>
            <strong className="booking-id">Booking #{booking.booking_id}</strong>
            Movie: {booking.movie_title}<br />
            Seats: {booking.seats}
          </div>
        ))}
      </div>
    </div>
  );

};

export default BookingList;
