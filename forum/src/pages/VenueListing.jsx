import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/VenueListing.css";

export default function VenueListing() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSports, setSelectedSports] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);

  const venuesPerPage = 6;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:5001/api/venues")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch venues");
        return res.json();
      })
      .then((data) => {
        setVenues(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Apply preselected sport from query string, e.g. /VenueListing?sport=Tennis
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sport = params.get("sport");
    if (sport) {
      setSelectedSports([sport]);
      setCurrentPage(1);
    }
  }, [location.search]);

  // Defensive: only call flatMap if venues is an array
  const allSports = [...new Set(
    Array.isArray(venues)
      ? venues.flatMap(v =>
          Array.isArray(v.sports)
            ? v.sports
            : v.sports?.split(",").map(s => s.trim()) || []
        )
      : []
  )];

  const toggleSport = (sport) => {
    setCurrentPage(1);
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter((s) => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const filteredVenues = venues.filter((venue) => {
    const nameMatch = (venue.court_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const sportMatch = (venue.sports || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSearch = nameMatch || sportMatch;

    const matchesSport =
      selectedSports.length === 0 ||
      selectedSports.some((sport) => (venue.sports || "").toLowerCase().includes(sport.toLowerCase()));

    const matchesPrice = Number(venue.per_hr_charge) <= maxPrice;

    return matchesSearch && matchesSport && matchesPrice;
  });

  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = filteredVenues.slice(indexOfFirstVenue, indexOfLastVenue);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="venue-listing-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading venues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="venue-listing-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Error</h3>
          <p>{error}</p>
          <button className="btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="venue-listing-container">
      <aside className="filter-sidebar">
        <h3>Search & Filters</h3>

        <div className="filter-group">
          <label>Search Venues</label>
          <input
            type="text"
            placeholder="Search by name or sport"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Filter by Sport</label>
          <div className="sport-filters">
            {allSports.map((sport) => (
              <label key={sport} className="sport-checkbox">
                <input
                  type="checkbox"
                  checked={selectedSports.includes(sport)}
                  onChange={() => toggleSport(sport)}
                />
                <span>{sport}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Max Price: ₹{maxPrice}</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="price-slider"
          />
        </div>

        <button
          className="filter-button"
          onClick={() => {
            setSearchTerm("");
            setSelectedSports([]);
            setMaxPrice(1000);
            setCurrentPage(1);
          }}
        >
          <i className="fas fa-refresh"></i>
          Clear Filters
        </button>
      </aside>

      <main className="venue-listing-main">
        <div className="venue-header">
          <h1>Available Venues</h1>
          <p>Found {filteredVenues.length} venues matching your criteria</p>
        </div>

        <div className="venue-card-grid">
          {currentVenues.length === 0 ? (
            <div className="no-venues">
              <div className="no-venues-icon">🏟️</div>
              <h3>No venues found</h3>
              <p>Try adjusting your search criteria or filters</p>
              <button 
                className="btn" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSports([]);
                  setMaxPrice(1000);
                }}
              >
                <i className="fas fa-refresh"></i>
                Reset Filters
              </button>
            </div>
          ) : (
            currentVenues.map((venue) => (
              <div
                className="venue-card"
                key={venue.v_no}
                onClick={() => navigate(`/venue/${venue.v_no}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/venue/${venue.v_no}`);
                }}
              >
                <img
                  src={venue.image || "https://via.placeholder.com/320x200?text=Venue+Image"}
                  alt={venue.court_name}
                  className="venue-img"
                />
                <div className="venue-card-body">
                  <h3 className="venue-title">{venue.court_name}</h3>
                  <p className="venue-sport">{venue.sports}</p>
                  <p className="venue-location">
                    <i className="fas fa-map-marker-alt"></i>
                    {venue.location || "Location not specified"}
                  </p>
                  <p className="venue-price">
                    <i className="fas fa-rupee-sign"></i>
                    {venue.per_hr_charge} / hour
                  </p>
                  <div className="venue-rating">
                    <i className="fas fa-star"></i>
                    <span>{venue.rating || "N/A"}</span>
                  </div>
                  <button
                    className="venue-book-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/venue/${venue.v_no}`);
                    }}
                  >
                    <i className="fas fa-calendar-plus"></i>
                    Book Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredVenues.length > venuesPerPage && (
          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredVenues.length / venuesPerPage) }).map((_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
