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
  const defaultTabFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    if (view === 'past') return 'past';
    return 'all';
  }, [location.search]);

  useEffect(() => {
    setActiveTab(defaultTabFromQuery);
  }, [defaultTabFromQuery]);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        if (user?.designation === 'facilities') {
          fetchOwnerBookings(user.id);
        } else {
          fetchBookings(user.id);
        }
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

  const fetchBookings = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/bookings/user/${userId}`);
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

  const fetchOwnerBookings = async (ownerId) => {
    try {
      // Expected backend endpoint for facility owner's bookings
      const response = await fetch(`http://localhost:5001/api/bookings/owner/${ownerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch owner bookings');
      }
      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
      setError('Failed to load facility bookings');
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      // Refresh bookings
      fetchBookings(user.id);
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

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'past') {
      const bookingDate = new Date(booking.booking_date);
      const now = new Date();
      // If end_time exists, combine with booking_date for better accuracy
      if (booking.end_time) {
        const [h, m] = String(booking.end_time).split(':');
        bookingDate.setHours(parseInt(h || '0', 10), parseInt(m || '0', 10), 0, 0);
      }
      return bookingDate < now;
    }
    return booking.status.toLowerCase() === activeTab;
  });

  const getBookingStats = () => {
    const stats = {
      all: bookings.length,
      confirmed: bookings.filter(b => b.status.toLowerCase() === 'confirmed').length,
      pending: bookings.filter(b => b.status.toLowerCase() === 'pending').length,
      completed: bookings.filter(b => b.status.toLowerCase() === 'completed').length,
      cancelled: bookings.filter(b => b.status.toLowerCase() === 'cancelled').length,
      past: bookings.filter(b => {
        const d = new Date(b.booking_date);
        if (b.end_time) {
          const [h, m] = String(b.end_time).split(':');
          d.setHours(parseInt(h || '0', 10), parseInt(m || '0', 10), 0, 0);
        }
        return d < new Date();
      }).length,
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
      <h1 className="page-title">My Bookings</h1>
      <p className="page-subtitle">Manage and track all your sports venue bookings</p>

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
          className={`tab ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past ({stats.past})
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
            <h3>No bookings found</h3>
            <p>
              {activeTab === 'all' 
                ? "You haven't made any bookings yet. Start by exploring our venues!"
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
            const venueName = booking.venue_name || booking.court_name || booking.facility || booking.venue || 'Venue';
            const venueImg = booking.venue_image || booking.image || booking.photo || "https://via.placeholder.com/320x200?text=Venue+Image";
            const rawDate = booking.booking_date || booking.date || booking.st_date || booking.created_at;
            const start = booking.start_time || booking.start || booking.startTime;
            const end = booking.end_time || booking.end || booking.endTime;
            const locationStr = booking.venue_location || booking.location || booking.facility_location || booking.address || '—';
            const sport = booking.sport_type || booking.sport || booking.sports || '—';
            const amount = booking.total_amount ?? booking.amount ?? booking.price ?? booking.total ?? '—';
            const status = (booking.status || 'pending');

            let dateStr = '—';
            try { if (rawDate) dateStr = new Date(rawDate).toLocaleDateString(); } catch(e) {}

            return (
              <div key={booking.id || `${venueName}-${rawDate}`} className="booking-card">
                <img
                  src={venueImg}
                  alt={venueName}
                  className="booking-img"
                />
                <div className="booking-info">
                  <h3 className="booking-title">{venueName}</h3>
                  <div className="booking-details">
                    <div className="booking-detail">
                      <i className="fas fa-calendar"></i>
                      <span>{dateStr}</span>
                    </div>
                    <div className="booking-detail">
                      <i className="fas fa-clock"></i>
                      <span>{start && end ? `${start} - ${end}` : (start || end || '—')}</span>
                    </div>
                    <div className="booking-detail">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{locationStr}</span>
                    </div>
                    <div className="booking-detail">
                      <i className="fas fa-running"></i>
                      <span>{sport}</span>
                    </div>
                    <div className="price">
                      <i className="fas fa-rupee-sign"></i>
                      <span>{amount}</span>
                    </div>
                  </div>
                  <div className={`status ${getStatusColor(status)}`}>
                    {status}
                  </div>
                  <div className="booking-actions">
                    <button
                      className="details-btn"
                      onClick={() => navigate(`/booking/${booking.id}`)}
                    >
                      <i className="fas fa-eye"></i>
                      View Details
                    </button>
                    {String(status).toLowerCase() === 'confirmed' && (
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancelBooking(booking.id)}
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
