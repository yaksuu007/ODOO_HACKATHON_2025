import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
           fetch(`http://localhost:5001/api/venue/${id}`)

      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch venue details");
        return res.json();
      })
      .then(data => {
        setVenue(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading venue details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!venue) return <p>No venue found</p>;

  return (
    <div className="venue-details container mt-4">
      <img src={venue.image || "https://via.placeholder.com/600x400?text=Venue+Details"} alt={venue.court_name} className="mb-4 rounded-lg" />
      <h2>{venue.court_name}</h2>
      <p><strong>Sport:</strong> {venue.sports}</p>
      <p><strong>Price per slot:</strong> ₹{venue.per_hr_charge}</p>
      <p><strong>Rating:</strong> ⭐ {venue.rating || "N/A"}</p>
      <p>{venue.description || "No description available."}</p>
      <button className="btn" onClick={() => navigate(`/booking/confirm/${venue.v_no}`)}>Book Now</button>
    </div>
  );
}
