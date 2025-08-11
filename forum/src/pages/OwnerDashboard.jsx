import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/OwnerDashboard.css';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [facilities, setFacilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddFacility, setShowAddFacility] = useState(false);
  const [showEditFacility, setShowEditFacility] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [showAddCourt, setShowAddCourt] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Sample data - replace with actual API calls
  useEffect(() => {
    // Mock data for demonstration
    setFacilities([
      {
        id: 1,
        name: "Elite Sports Complex",
        location: "123 Sports Avenue, Downtown",
        description: "Premium multi-sport facility with state-of-the-art equipment",
        sports: ["Tennis", "Basketball", "Badminton", "Squash"],
        amenities: ["Parking", "Locker Rooms", "Pro Shop", "Café", "WiFi"],
        photos: [
          "https://source.unsplash.com/random/400x300/?tennis-court",
          "https://source.unsplash.com/random/400x300/?basketball-court",
          "https://source.unsplash.com/random/400x300/?badminton-court"
        ],
        courts: [
          {
            id: 1,
            name: "Tennis Court 1",
            sport: "Tennis",
            price: 50,
            operatingHours: "6:00 AM - 10:00 PM",
            status: "active"
          },
          {
            id: 2,
            name: "Basketball Court A",
            sport: "Basketball",
            price: 40,
            operatingHours: "6:00 AM - 11:00 PM",
            status: "active"
          }
        ]
      }
    ]);

    setBookings([
      {
        id: 1,
        userName: "John Smith",
        court: "Tennis Court 1",
        time: "2024-01-15 14:00-16:00",
        status: "Booked",
        facility: "Elite Sports Complex"
      },
      {
        id: 2,
        userName: "Sarah Johnson",
        court: "Basketball Court A",
        time: "2024-01-15 16:00-18:00",
        status: "Completed",
        facility: "Elite Sports Complex"
      },
      {
        id: 3,
        userName: "Mike Davis",
        court: "Tennis Court 1",
        time: "2024-01-16 10:00-12:00",
        status: "Cancelled",
        facility: "Elite Sports Complex"
      }
    ]);
  }, []);

  const handleAddFacility = () => {
    setShowAddFacility(true);
    setEditingFacility(null);
  };

  const handleEditFacility = (facility) => {
    setEditingFacility(facility);
    setShowAddFacility(true);
  };

  const handleAddCourt = (facility) => {
    setSelectedFacility(facility);
    setShowAddCourt(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Booked': return '#3b82f6';
      case 'Completed': return '#10b981';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Booked': return '📅';
      case 'Completed': return '✅';
      case 'Cancelled': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="owner-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Venue Owner Dashboard</h1>
          <p>Manage your sports facilities, courts, and bookings</p>
        </div>
        <button className="btn-primary" onClick={handleAddFacility}>
          <i className="fas fa-plus"></i> Add New Facility
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-chart-line"></i> Overview
        </button>
        <button 
          className={`tab ${activeTab === 'facilities' ? 'active' : ''}`}
          onClick={() => setActiveTab('facilities')}
        >
          <i className="fas fa-building"></i> Facilities
        </button>
        <button 
          className={`tab ${activeTab === 'courts' ? 'active' : ''}`}
          onClick={() => setActiveTab('courts')}
        >
          <i className="fas fa-basketball-ball"></i> Courts
        </button>
        <button 
          className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <i className="fas fa-calendar-check"></i> Bookings
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏟️</div>
                <div className="stat-info">
                  <h3>{facilities.length}</h3>
                  <p>Total Facilities</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏀</div>
                <div className="stat-info">
                  <h3>{facilities.reduce((acc, f) => acc + f.courts.length, 0)}</h3>
                  <p>Total Courts</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>{bookings.filter(b => b.status === 'Booked').length}</h3>
                  <p>Active Bookings</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>${facilities.reduce((acc, f) => acc + f.courts.reduce((sum, c) => sum + c.price, 0), 0)}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {bookings.slice(0, 5).map(booking => (
                  <div key={booking.id} className="activity-item">
                    <div className="activity-icon">{getStatusIcon(booking.status)}</div>
                    <div className="activity-details">
                      <p><strong>{booking.userName}</strong> booked <strong>{booking.court}</strong></p>
                      <span className="activity-time">{booking.time}</span>
                    </div>
                    <span className="activity-status" style={{ color: getStatusColor(booking.status) }}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Facilities Tab */}
        {activeTab === 'facilities' && (
          <div className="facilities-section">
            <div className="section-header">
              <h2>Facility Management</h2>
              <p>Manage your sports facilities and their details</p>
            </div>

            <div className="facilities-grid">
              {facilities.map(facility => (
                <div key={facility.id} className="facility-card">
                  <div className="facility-photos">
                    {facility.photos.map((photo, index) => (
                      <img key={index} src={photo} alt={`${facility.name} ${index + 1}`} />
                    ))}
                  </div>
                  <div className="facility-info">
                    <h3>{facility.name}</h3>
                    <p className="facility-location">
                      <i className="fas fa-map-marker-alt"></i> {facility.location}
                    </p>
                    <p className="facility-description">{facility.description}</p>
                    
                    <div className="facility-sports">
                      <h4>Sports Supported:</h4>
                      <div className="sports-tags">
                        {facility.sports.map(sport => (
                          <span key={sport} className="sport-tag">{sport}</span>
                        ))}
                      </div>
                    </div>

                    <div className="facility-amenities">
                      <h4>Amenities:</h4>
                      <div className="amenities-list">
                        {facility.amenities.map(amenity => (
                          <span key={amenity} className="amenity-item">
                            <i className="fas fa-check"></i> {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="facility-actions">
                      <button 
                        className="btn-secondary"
                        onClick={() => handleEditFacility(facility)}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={() => handleAddCourt(facility)}
                      >
                        <i className="fas fa-plus"></i> Add Court
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courts Tab */}
        {activeTab === 'courts' && (
          <div className="courts-section">
            <div className="section-header">
              <h2>Court Management</h2>
              <p>Manage individual courts and their settings</p>
            </div>

            {facilities.map(facility => (
              <div key={facility.id} className="facility-courts">
                <h3>{facility.name}</h3>
                <div className="courts-grid">
                  {facility.courts.map(court => (
                    <div key={court.id} className="court-card">
                      <div className="court-header">
                        <h4>{court.name}</h4>
                        <span className={`court-status ${court.status}`}>
                          {court.status}
                        </span>
                      </div>
                      <div className="court-details">
                        <p><strong>Sport:</strong> {court.sport}</p>
                        <p><strong>Price:</strong> ${court.price}/hour</p>
                        <p><strong>Hours:</strong> {court.operatingHours}</p>
                      </div>
                      <div className="court-actions">
                        <button className="btn-secondary">
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button className="btn-outline">
                          <i className="fas fa-clock"></i> Set Availability
                        </button>
                        <button className="btn-outline">
                          <i className="fas fa-tools"></i> Maintenance
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <div className="section-header">
              <h2>Booking Management</h2>
              <p>View and manage all bookings across your facilities</p>
            </div>

            <div className="bookings-filters">
              <select className="filter-select">
                <option value="">All Statuses</option>
                <option value="Booked">Booked</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select className="filter-select">
                <option value="">All Facilities</option>
                {facilities.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <input 
                type="date" 
                className="filter-date"
                placeholder="Filter by date"
              />
            </div>

            <div className="bookings-table">
              <div className="table-header">
                <div className="header-cell">User</div>
                <div className="header-cell">Court</div>
                <div className="header-cell">Time</div>
                <div className="header-cell">Status</div>
                <div className="header-cell">Actions</div>
              </div>
              {bookings.map(booking => (
                <div key={booking.id} className="table-row">
                  <div className="table-cell">
                    <div className="user-info">
                      <div className="user-avatar">
                        {booking.userName.charAt(0).toUpperCase()}
                      </div>
                      <span>{booking.userName}</span>
                    </div>
                  </div>
                  <div className="table-cell">{booking.court}</div>
                  <div className="table-cell">{booking.time}</div>
                  <div className="table-cell">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {getStatusIcon(booking.status)} {booking.status}
                    </span>
                  </div>
                  <div className="table-cell">
                    <div className="row-actions">
                      <button className="action-btn">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="action-btn">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="action-btn">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Facility Modal */}
      {showAddFacility && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingFacility ? 'Edit Facility' : 'Add New Facility'}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddFacility(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <form className="facility-form">
                <div className="form-group">
                  <label>Facility Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter facility name"
                    defaultValue={editingFacility?.name || ''}
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    placeholder="Enter facility location"
                    defaultValue={editingFacility?.location || ''}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    placeholder="Describe your facility"
                    defaultValue={editingFacility?.description || ''}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Sports Supported</label>
                  <div className="sports-input">
                    <input 
                      type="text" 
                      placeholder="Add sport (press Enter)"
                    />
                    <div className="sports-tags">
                      {editingFacility?.sports?.map(sport => (
                        <span key={sport} className="sport-tag">
                          {sport} <i className="fas fa-times"></i>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Amenities</label>
                  <div className="amenities-input">
                    <input 
                      type="text" 
                      placeholder="Add amenity (press Enter)"
                    />
                    <div className="amenities-list">
                      {editingFacility?.amenities?.map(amenity => (
                        <span key={amenity} className="amenity-item">
                          <i className="fas fa-check"></i> {amenity}
                          <i className="fas fa-times"></i>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Upload Photos</label>
                  <div className="photo-upload">
                    <input type="file" multiple accept="image/*" />
                    <p>Drag and drop photos or click to browse</p>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowAddFacility(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingFacility ? 'Update Facility' : 'Create Facility'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Court Modal */}
      {showAddCourt && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Court to {selectedFacility?.name}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddCourt(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <form className="court-form">
                <div className="form-group">
                  <label>Court Name</label>
                  <input type="text" placeholder="e.g., Tennis Court 1" />
                </div>
                <div className="form-group">
                  <label>Sport Type</label>
                  <select>
                    <option value="">Select Sport</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Squash">Squash</option>
                    <option value="Football">Football</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price per Hour ($)</label>
                  <input type="number" placeholder="50" min="0" />
                </div>
                <div className="form-group">
                  <label>Operating Hours</label>
                  <div className="time-inputs">
                    <input type="time" />
                    <span>to</span>
                    <input type="time" />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowAddCourt(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Court
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
