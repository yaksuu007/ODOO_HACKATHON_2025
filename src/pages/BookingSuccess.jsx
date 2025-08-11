import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookingSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="booking-success container mt-4 text-center">
      <h2>Booking Successful!</h2>
      <p>Your booking with ID {id} has been confirmed.</p>
      <button className="btn" onClick={() => navigate("/my-bookings")}>View My Bookings</button>
      <button className="btn mt-2" onClick={() => navigate("/venues")}>Book Another Venue</button>
    </div>
  );
}
