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
    <div className="my-bookings container mt-4" style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>My Bookings</h2>
      <div className="booking-list" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {bookings.map((b) => (
          <div
            key={b.id}
            className="booking-card"
          
            style={{
              cursor: "pointer",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "white",
              transition: "box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
          >
            <h3 style={{ margin: "0 0 8px" }}>{b.venue}</h3>
            <div style={{ display: "flex", gap: "20px", marginBottom: "8px" }}>
              <div>
                <strong>Date:</strong>
                <p style={{ margin: "4px 0 0" }}>{b.date}</p>
              </div>
              <div>
                <strong>Time:</strong>
                <p style={{ margin: "4px 0 0" }}>{b.time}</p>
              </div>
            </div>
            <p><strong>Status:</strong> {b.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
