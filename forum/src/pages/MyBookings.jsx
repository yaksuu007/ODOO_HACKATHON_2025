import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/MyBookings.css";

export default function MyBookings() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const isPastView = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('view') === 'past';
  }, [location.search]);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        fetchBookings();
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Failed to load user data');
        setLoading(false);
      }
    } else {
      setError('Please login to view your bookings');
      setLoading(false);
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/bookings`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/booking/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      // Refresh bookings
      fetchBookings();
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'confirmed';
      case 'cancelled':
        return 'cancelled';
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      default:
        return 'pending';
    }
  };

  const filteredBookings = useMemo(() => {
    let result = bookings.filter((booking) => {
      if (activeTab === 'all') return true;
      return (booking.status || '').toLowerCase() === activeTab;
    });

    if (isPastView) {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      result = result.filter((b) => {
        const dateValue = b.st_date || b.booking_date;
        if (!dateValue) return false;
        const d = new Date(dateValue);
        return d < startOfToday;
      });
    }

    return result;
  }, [bookings, activeTab, isPastView]);

  const getBookingStats = () => {
    const stats = {
      all: bookings.length,
      confirmed: bookings.filter(b => b.status.toLowerCase() === 'confirmed').length,
      pending: bookings.filter(b => b.status.toLowerCase() === 'pending').length,
      completed: bookings.filter(b => b.status.toLowerCase() === 'completed').length,
      cancelled: bookings.filter(b => b.status.toLowerCase() === 'cancelled').length,
    };
    return stats;
  };

  const stats = getBookingStats();

  if (loading) {
    return (
      <div className="my-bookings">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-bookings">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Error</h3>
          <p>{error}</p>
          <button className="btn" onClick={() => navigate('/auth')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings">
      <h1 className="page-title">{isPastView ? 'Previous Bookings' : 'My Bookings'}</h1>
      <p className="page-subtitle">{isPastView ? 'Your completed or past bookings' : 'Manage and track all your sports venue bookings'}</p>

      {/* Booking Stats */}
      <div className="booking-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.all}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.confirmed}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Bookings ({stats.all})
        </button>
        <button
          className={`tab ${activeTab === 'confirmed' ? 'active' : ''}`}
          onClick={() => setActiveTab('confirmed')}
        >
          Confirmed ({stats.confirmed})
        </button>
        <button
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({stats.pending})
        </button>
        <button
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({stats.completed})
        </button>
        <button
          className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled ({stats.cancelled})
        </button>
      </div>

      {/* Bookings Grid */}
      <div className="bookings-grid">
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">📅</div>
            <h3>No {isPastView ? 'previous' : ''} bookings found</h3>
            <p>
              {activeTab === 'all' 
                ? (isPastView ? "You have no previous bookings yet." : "You haven't made any bookings yet. Start by exploring our venues!")
                : `You don't have any ${activeTab} bookings.`
              }
            </p>
            {activeTab === 'all' && (
              <button className="btn" onClick={() => navigate('/VenueListing')}>
                <i className="fas fa-search"></i>
                Browse Venues
              </button>
            )}
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const bookingId = booking.Bno || booking.id;
            const stDate = booking.st_date || booking.booking_date;
            const startTime = (booking.start_time || '').slice(0,5);
            const endTime = (booking.end_time || '').slice(0,5);
            const venueName = booking.venue_name || `Venue #${booking.venue_id}`;
            const venueLocation = booking.venue_address || booking.venue_location || '';
            const totalAmount = booking.total_amount ?? booking.amount ?? booking.price ?? '';
            return (
            <div key={booking.id} className="booking-card">
              <img
                src={booking.venue_image || "https://via.placeholder.com/320x200?text=Venue+Image"}
                alt={venueName}
                className="booking-img"
              />
              <div className="booking-info">
                <h3 className="booking-title">{venueName}</h3>
                <div className="booking-details">
                  <div className="booking-detail">
                    <i className="fas fa-calendar"></i>
                    <span>{stDate ? new Date(stDate).toLocaleDateString() : ''}</span>
                  </div>
                  <div className="booking-detail">
                    <i className="fas fa-clock"></i>
                    <span>{startTime} - {endTime}</span>
                  </div>
                  <div className="booking-detail">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{venueLocation}</span>
                  </div>
                  <div className="price">
                    <i className="fas fa-rupee-sign"></i>
                    <span>{totalAmount}</span>
                  </div>
                </div>
                <div className={`status ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </div>
                <div className="booking-actions">
                  <button
                    className="details-btn"
                    onClick={() => booking.venue_id && navigate(`/venue/${booking.venue_id}`)}
                  >
                    <i className="fas fa-eye"></i>
                    View Venue
                  </button>
                  {booking.status.toLowerCase() === 'confirmed' && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelBooking(bookingId)}
                    >
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
}
