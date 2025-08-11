import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/VenueListing.css";

export default function VenueListing() {
  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 6;

  const navigate = useNavigate();

  const venues = [
    {
      id: 1,
      name: "Green Valley Tennis Court",
      sport: "Tennis",
      price: 500,
      rating: 4.5,
      image: "https://via.placeholder.com/300x200?text=Tennis+Court",
    },
    //... other venues as you had
    {
      id: 8,
      name: "Golden Goal Football Turf",
      sport: "Football",
      price: 750,
      rating: 4.7,
      image: "https://via.placeholder.com/300x200?text=Football+Turf",
    },
  ];

  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = venues.slice(indexOfFirstVenue, indexOfLastVenue);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="venue-listing-container">
      {/* Sidebar */}
      <aside className="filter-sidebar">
        <h3>Search & Filters</h3>
        {/* Filters unchanged */}
      </aside>

      {/* Main Content */}
      <main className="venue-listing-main">
        <h2>Available Venues</h2>
        <div className="venue-card-grid">
          {currentVenues.map((venue) => (
            <div
              className="venue-card"
              key={venue.id}
              onClick={() => navigate(`/venue/${venue.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={venue.image} alt={venue.name} />
              <div className="venue-card-body">
                <h3>{venue.name}</h3>
                <p>{venue.sport}</p>
                <p>₹{venue.price} / slot</p>
                <p>⭐ {venue.rating}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering card click
                    navigate(`/booking/confirm/${venue.id}`);
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(venues.length / venuesPerPage) }).map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
