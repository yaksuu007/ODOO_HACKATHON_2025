import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Profile.css";

 function Profile() {
  const [activeTab, setActiveTab] = useState("edit");
  const [bookingTab, setBookingTab] = useState("active");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const dummyBookings = [
    {
      id: 1,
      sport: "Tennis",
      court: "Vapi Sports Arena",
      date: "2025-08-15",
      time: "5:00 PM - 6:00 PM",
      price: "₹500",
      status: "Confirmed",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      sport: "Badminton",
      court: "CourtPro Hub",
      date: "2025-08-20",
      time: "7:00 AM - 8:00 AM",
      price: "₹300",
      status: "Pending",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <h2>My Account</h2>
        <ul>
          <li className={activeTab === "edit" ? "active" : ""} onClick={() => setActiveTab("edit")}>
            Edit Profile
          </li>
          <li className={activeTab === "bookings" ? "active" : ""} onClick={() => setActiveTab("bookings")}>
            Bookings
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="profile-content">
        {activeTab === "edit" && (
          <div className="edit-profile">
            <h2>Edit Profile</h2>

            <div className="profile-pic-upload">
              <img src={profileImage || "https://via.placeholder.com/150"} alt="Profile" />
              <label htmlFor="upload">Change Picture</label>
              <input type="file" id="upload" accept="image/*" onChange={handleImageChange} />
            </div>

            <form>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter full name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter email" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" placeholder="Enter phone number" />
              </div>

              <h3>Change Password</h3>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" placeholder="Enter current password" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" />
              </div>

              <button type="submit" className="btn">
                Save Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="profile-bookings">
            <h2>My Bookings</h2>
            <div className="booking-tabs">
              <button
                className={bookingTab === "active" ? "active" : ""}
                onClick={() => setBookingTab("active")}
              >
                Active
              </button>
              <button
                className={bookingTab === "past" ? "active" : ""}
                onClick={() => setBookingTab("past")}
              >
                Past
              </button>
            </div>

            <div className="booking-list">
              {dummyBookings
                .filter((b) => (bookingTab === "active" ? b.status !== "Completed" : b.status === "Completed"))
                .map((booking) => (
                  <div
                    key={booking.id}
                    className="booking-card"
                    onClick={() => navigate(`/booking/confirm/${booking.id}`)}
                  >
                    <img src={booking.image} alt={booking.court} />
                    <div>
                      <h3>{booking.court}</h3>
                      <p>{booking.sport}</p>
                      <p>{booking.date}</p>
                      <p>{booking.time}</p>
                      <p>{booking.price}</p>
                      <p>Status: {booking.status}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Profile;