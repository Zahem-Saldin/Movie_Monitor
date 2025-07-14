import React from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import AddMovieForm from "./components/AddMovieForm";
import MovieList from "./components/MovieList";
import AvailabilityCheck from "./components/AvailabilityCheck";
import BookTicketForm from "./components/BookTicketForm";
import BookingList from "./components/BookingList";
import CancelBooking from "./components/CancelBooking";
import './Dashboard.css';

const App = () => {
  return (
    <Router>
      <div style={{ padding: 20 }}>
        <h1 class="title">
          <span class="movie">🎬 Movie</span>
          <span class="base">Base</span>
        </h1>
        <nav style={{ marginBottom: 60 }}>
          <NavLink to="/" end className="nav-link">Home</NavLink> |{" "}
          <NavLink to="/add" className="nav-link">Add Movie</NavLink> |{" "}
          <NavLink to="/availability" className="nav-link">Check Availability</NavLink> |{" "}
          <NavLink to="/book" className="nav-link">Book Tickets</NavLink> |{" "}
          <NavLink to="/bookings" className="nav-link">All Bookings</NavLink> |{" "}
          <NavLink to="/cancel" className="nav-link">Cancel Booking</NavLink>

        </nav>

        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/add" element={<AddMovieForm />} />
          <Route path="/availability" element={<AvailabilityCheck />} />
          <Route path="/book" element={<BookTicketForm />} />
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/cancel" element={<CancelBooking />} />
        </Routes>
      </div>
    </Router>
  );
};


export default App;
