import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Replace with real booking details
  const bookingDetails = {
    venueName: "Green Valley Tennis Court",
    date: "2025-08-15",
    time: "5:00 PM - 6:00 PM",
    price: 500,
  };

  const handleConfirm = () => {
    // TODO: Add booking logic
    alert("Booking confirmed!");
    navigate(`/booking/success/${id}`);
  };

  return (
    <div className="booking-confirmation container mt-4">
      <h2>Confirm Your Booking</h2>
      <p><strong>Venue:</strong> {bookingDetails.venueName}</p>
      <p><strong>Date:</strong> {bookingDetails.date}</p>
      <p><strong>Time:</strong> {bookingDetails.time}</p>
      <p><strong>Price:</strong> ₹{bookingDetails.price}</p>
      <button className="btn" onClick={handleConfirm}>Confirm Booking</button>
    </div>
  );
}
