import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookingSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div
      className="booking-success container"
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        textAlign: "center",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#f9fafb",
      }}
    >
      <h2 style={{ color: "#16a34a", marginBottom: "20px" }}>Booking Successful!</h2>
      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        Your booking with <strong>ID {id}</strong> has been confirmed.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <button
          onClick={() => navigate("/my-bookings")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          View My Bookings
        </button>
        <button
          onClick={() => navigate("/venues")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          Book Another Venue
        </button>
      </div>
    </div>
  );
}
