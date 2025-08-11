import React from "react";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const navigate = useNavigate();

  // Dummy bookings data
  const bookings = [
    {
      id: 1,
      venue: "Green Valley Tennis Court",
      date: "2025-08-15",
      time: "5:00 PM - 6:00 PM",
      status: "Confirmed",
    },
    {
      id: 2,
      venue: "Skyline Badminton Arena",
      date: "2025-08-20",
      time: "7:00 AM - 8:00 AM",
      status: "Pending",
    },
  ];

  return (
    <div className="my-bookings container mt-4">
      <h2>My Bookings</h2>
      <div className="booking-list">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="booking-card"
            onClick={() => navigate(`/booking/confirm/${b.id}`)}
            style={{ cursor: "pointer" }}
          >
            <h3>{b.venue}</h3>
            <p>{b.date} | {b.time}</p>
            <p>Status: {b.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
