import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./COMPONENTS/NAVBAR"; // adjust path as needed
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import VenueListing from "./pages/VenueListing";
import VenueDetails from "./pages/VenueDetails";
import OwnerDashboard from "./pages/OwnerDashboard";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";
import LandingPage from "./pages/LandingPage";

function App() {
  const [user, setUser] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUser(user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
        }
      }
    };

    checkAuthStatus();
  }, []);

  // Example logout handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    // Add any other logout logic here, e.g., API call
  };

  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Routes for different pages */}
     <Routes>
  {/* Change homepage to VenueListing */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/Auth" element={<Auth setUser={setUser} />} />
  <Route path="/VenueListing" element={<VenueListing />} />
  <Route path="/venue/:id" element={<VenueDetails />} />
  <Route path="/Profile" element={<Profile user={user} />} />
  <Route path="/OwnerDashboard" element={<OwnerDashboard />} />
  <Route path="/BookingConfirmation/:id" element={<BookingConfirmation />} />
  <Route path="/BookingSuccess" element={<BookingSuccess />} />
  <Route path="/MyBookings" element={<MyBookings />} />
</Routes>

    </Router>
  );
}

export default App;
