import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/apiService";
import "./styles/BookingConfirmation.css";

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await api.getBooking(id);
        // Normalize fields for display
        const venueName = data.venue_name || data.venue?.court_name || "Venue";
        const dateStr = data.st_date || data.booking_date || new Date().toISOString().split('T')[0];
        const timeStr = data.start_time && data.end_time ? `${data.start_time} - ${data.end_time}` : data.time;
        const amountStr = data.total_amount ? `₹${data.total_amount}` : data.amount;
        setBooking({
          id: data.Bno || data.id || id,
          venue_name: venueName,
          date: dateStr,
          time: timeStr,
          sport: data.sport || data.sport_type || '',
          amount: amountStr
        });
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const submitReview = async () => {
    if (!rating) return;
    setSubmitting(true);
    try {
      await api.submitBookingReview(id, { rating, comment });
      alert('Thanks for your rating!');
      setSubmitting(false);
    } catch (e) {
      alert('Failed to submit rating');
      setSubmitting(false);
    }
  };

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

        {/* Rating Section */}
        <div className="booking-details" style={{ marginTop: '1rem' }}>
          <h2>Rate Your Experience</h2>
          <div className="detail-item">
            <span>Rating:</span>
            <span>
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  style={{
                    color: n <= rating ? '#f59e0b' : '#94a3b8',
                    fontSize: '1.25rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  aria-label={`Rate ${n} star${n>1?'s':''}`}
                >★</button>
              ))}
            </span>
          </div>
          <div className="detail-item">
            <span>Comment:</span>
            <span style={{ flex: 1 }}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your feedback (optional)"
                style={{ width: '100%', minHeight: '80px' }}
              />
            </span>
          </div>
          <div className="action-buttons">
            <button className="btn-primary" disabled={!rating || submitting} onClick={submitReview}>
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
