import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/VenueListing" element={<VenueListing />} />
        <Route path="/VenueDetails" element={<VenueDetails />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/OwnerDashboard" element={<OwnerDashboard />} />
        <Route path="/BookingConfirmation" element={<BookingConfirmation />} />
        <Route path="/BookingSuccess" element={<BookingSuccess />} />
        <Route path="/MyBookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

export default App;
