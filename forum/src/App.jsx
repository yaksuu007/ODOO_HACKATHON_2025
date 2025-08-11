import React, { useState } from "react";
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

function App() {
  const [user, setUser] = useState(null);

  // Example logout handler
  const handleLogout = () => {
    setUser(null);
    // Add any other logout logic here, e.g., API call
  };

  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Routes for different pages */}
     <Routes>
  {/* Change homepage to VenueListing */}
  <Route path="/" element={<VenueListing />} />
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
