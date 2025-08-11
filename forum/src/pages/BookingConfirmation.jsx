import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/BookingConfirmation.css";

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the booking details from the API
    // For now, we'll simulate a successful booking
    setTimeout(() => {
      setBooking({
        id: id,
        venue_name: "Premium Sports Arena",
        date: new Date().toLocaleDateString(),
        time: "2:00 PM - 3:00 PM",
        sport: "Tennis",
        amount: "₹500"
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="booking-confirmation-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Confirming your booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-confirmation-container">
      <div className="confirmation-card">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        
        <h1>Booking Confirmed!</h1>
        <p className="confirmation-message">
          Your venue has been successfully booked. You will receive a confirmation email shortly.
        </p>

        <div className="booking-details">
          <h2>Booking Details</h2>
          <div className="detail-item">
            <span>Booking ID:</span>
            <span>#{booking.id}</span>
          </div>
          <div className="detail-item">
            <span>Venue:</span>
            <span>{booking.venue_name}</span>
          </div>
          <div className="detail-item">
            <span>Date:</span>
            <span>{booking.date}</span>
          </div>
          <div className="detail-item">
            <span>Time:</span>
            <span>{booking.time}</span>
          </div>
          <div className="detail-item">
            <span>Sport:</span>
            <span>{booking.sport}</span>
          </div>
          <div className="detail-item">
            <span>Amount:</span>
            <span>{booking.amount}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="btn-secondary"
            onClick={() => navigate('/MyBookings')}
          >
            <i className="fas fa-calendar"></i>
            View My Bookings
          </button>
          <button 
            className="btn-primary"
            onClick={() => navigate('/VenueListing')}
          >
            <i className="fas fa-search"></i>
            Book Another Venue
          </button>
        </div>
      </div>
    </div>
  );
}
