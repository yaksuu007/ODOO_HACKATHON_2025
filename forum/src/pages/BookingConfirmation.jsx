import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy venue data list (replace with API call or context)
  const venues = [
    { id: "1", name: "Green Valley Tennis Court", price: 500 },
    { id: "2", name: "Sunshine Basketball Arena", price: 600 },
    // add other venues here...
  ];

  // Find venue details by id from URL param
  const venue = venues.find((v) => v.id === id);

  // Fallback if venue not found
  if (!venue) {
    return <p>Venue not found.</p>;
  }

  // Hardcoded booking date/time for demo — replace with inputs or state if needed
  const bookingDetails = {
    venueName: venue.name,
    date: "2025-08-15",
    time: "5:00 PM - 6:00 PM",
    price: venue.price,
  };

  const handleConfirm = () => {
    // TODO: Add actual booking logic here (API call etc.)
    alert(`Booking confirmed for ${venue.name} on ${bookingDetails.date} at ${bookingDetails.time}`);
    navigate('/');
  };

  return (
    <div className="booking-confirmation container mt-4">
      <h2>Confirm Your Booking</h2>
      <p><strong>Venue:</strong> {bookingDetails.venueName}</p>
      <p><strong>Date:</strong> {bookingDetails.date}</p>
      <p><strong>Time:</strong> {bookingDetails.time}</p>
      <p><strong>Price:</strong> ₹{bookingDetails.price}</p>
      <button
        className="btn"
        onClick={handleConfirm}
        style={{
          padding: "10px 20px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Confirm Booking
      </button>
    </div>
  );
}
