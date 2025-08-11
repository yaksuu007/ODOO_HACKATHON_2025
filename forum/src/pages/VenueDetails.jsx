import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/VenueDetails.css";

export default function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    sportType: "",
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Fetch venue details
    fetchVenueDetails();
  }, [id]);

  const fetchVenueDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/venues/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch venue details');
      }
      const data = await response.json();
      setVenue(data);
      setBookingData(prev => ({
        ...prev,
        sportType: data.sports?.split(',')[0]?.trim() || ''
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching venue details:', error);
      setError('Failed to load venue details');
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to book a venue');
      navigate('/auth');
      return;
    }

    if (!bookingData.date || !bookingData.startTime || !bookingData.endTime) {
      alert('Please fill in all booking details');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venue_id: id,
          user_id: user.id,
          booking_date: bookingData.date,
          start_time: bookingData.startTime,
          end_time: bookingData.endTime,
          sport_type: bookingData.sportType,
          total_amount: venue.per_hr_charge,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const data = await response.json();
      navigate(`/BookingConfirmation/${data.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="venue-details-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="venue-details-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Error</h3>
          <p>{error || 'Venue not found'}</p>
          <button className="btn" onClick={() => navigate('/VenueListing')}>
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="venue-details-container">
      <div className="venue-details-header">
        <button className="back-btn" onClick={() => navigate('/VenueListing')}>
          <i className="fas fa-arrow-left"></i>
          Back to Venues
        </button>
        <h1 className="venue-title">{venue.court_name}</h1>
        <p className="venue-subtitle">{venue.sports}</p>
      </div>

      <div className="venue-details-content">
        <div className="venue-info-section">
          <div className="venue-image">
            <img 
              src={venue.image || "https://via.placeholder.com/600x400?text=Venue+Image"} 
              alt={venue.court_name}
            />
          </div>

          <div className="venue-details-grid">
            <div className="detail-card">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Location</h3>
                <p>{venue.location || "Location not specified"}</p>
              </div>
            </div>

            <div className="detail-card">
              <i className="fas fa-rupee-sign"></i>
              <div>
                <h3>Price</h3>
                <p>₹{venue.per_hr_charge} per hour</p>
              </div>
            </div>

            <div className="detail-card">
              <i className="fas fa-star"></i>
              <div>
                <h3>Rating</h3>
                <p>{venue.rating || "N/A"}</p>
              </div>
            </div>

            <div className="detail-card">
              <i className="fas fa-clock"></i>
              <div>
                <h3>Operating Hours</h3>
                <p>{venue.operating_hours || "6:00 AM - 10:00 PM"}</p>
              </div>
            </div>
          </div>

          <div className="venue-description">
            <h3>About this venue</h3>
            <p>{venue.description || "A premium sports venue offering excellent facilities and equipment for various sports activities."}</p>
          </div>
        </div>

        <div className="booking-section">
          <div className="booking-card">
            <h2>Book this venue</h2>
            <form onSubmit={handleBookingSubmit} className="booking-form">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Time</label>
                <select
                  name="startTime"
                  value={bookingData.startTime}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select start time</option>
                  <option value="06:00">6:00 AM</option>
                  <option value="07:00">7:00 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                </select>
              </div>

              <div className="form-group">
                <label>End Time</label>
                <select
                  name="endTime"
                  value={bookingData.endTime}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select end time</option>
                  <option value="07:00">7:00 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="22:00">10:00 PM</option>
                </select>
              </div>

              <div className="form-group">
                <label>Sport Type</label>
                <select
                  name="sportType"
                  value={bookingData.sportType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select sport</option>
                  {venue.sports?.split(',').map(sport => (
                    <option key={sport.trim()} value={sport.trim()}>
                      {sport.trim()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <div className="summary-item">
                  <span>Venue:</span>
                  <span>{venue.court_name}</span>
                </div>
                <div className="summary-item">
                  <span>Date:</span>
                  <span>{bookingData.date || 'Not selected'}</span>
                </div>
                <div className="summary-item">
                  <span>Time:</span>
                  <span>
                    {bookingData.startTime && bookingData.endTime 
                      ? `${bookingData.startTime} - ${bookingData.endTime}`
                      : 'Not selected'
                    }
                  </span>
                </div>
                <div className="summary-item">
                  <span>Price:</span>
                  <span>₹{venue.per_hr_charge}</span>
                </div>
              </div>

              <button type="submit" className="book-now-btn">
                <i className="fas fa-calendar-plus"></i>
                Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
