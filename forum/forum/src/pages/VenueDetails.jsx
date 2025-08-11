import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy data placeholder - replace with real data fetching
  const venue = {
    id,
    name: "Green Valley Tennis Court",
    sport: "Tennis",
    price: 500,
    rating: 4.5,
    description: "A great tennis court with synthetic grass and floodlights.",
    image: "https://via.placeholder.com/600x400?text=Venue+Details",
  };

  return (
    <div className="venue-details container mt-4">
      <img src={venue.image} alt={venue.name} className="mb-4 rounded-lg" />
      <h2>{venue.name}</h2>
      <p><strong>Sport:</strong> {venue.sport}</p>
      <p><strong>Price per slot:</strong> ₹{venue.price}</p>
      <p><strong>Rating:</strong> ⭐ {venue.rating}</p>
      <p>{venue.description}</p>
      <button
        className="btn"
        onClick={() => navigate(`/booking/confirm/${venue.id}`)}
      >
        Book Now
      </button>
    </div>
  );
}
