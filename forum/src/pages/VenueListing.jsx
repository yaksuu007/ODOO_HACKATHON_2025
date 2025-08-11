import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
            fetch("http://localhost:5001/api/venues")  // <-- fetch all venues here!
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

  if (loading) return <p>Loading venues...</p>;
  if (error) return <p>Error: {error}</p>;

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

  return (
    <div className="venue-listing-container" style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <aside className="filter-sidebar" style={{ minWidth: "220px" }}>
        <h3>Search & Filters</h3>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by name or sport"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h4>Filter by Sport</h4>
          {allSports.map((sport) => (
            <label key={sport} style={{ display: "block", marginTop: "5px" }}>
              <input
                type="checkbox"
                checked={selectedSports.includes(sport)}
                onChange={() => toggleSport(sport)}
              />{" "}
              {sport}
            </label>
          ))}
        </div>

        <div>
          <h4>Max Price: ₹{maxPrice}</h4>
          <input
            type="range"
            min="0"
            max="1000"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{ width: "100%" }}
          />
        </div>
      </aside>

      <main className="venue-listing-main" style={{ flex: 1 }}>
        <h2>Available Venues</h2>

        <div
          className="venue-card-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {currentVenues.length === 0 ? (
            <p>No venues found matching the criteria.</p>
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
                style={{
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)")}
              >
                <img
                  src={venue.image || "https://via.placeholder.com/280x160?text=Venue+Image"}
                  alt={venue.court_name}
                  style={{ width: "100%", height: "160px", objectFit: "cover" }}
                />
                <div
                  className="venue-card-body"
                  style={{
                    padding: "15px",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h3 style={{ margin: "0 0 8px" }}>{venue.court_name}</h3>
                  <p style={{ margin: "0 0 4px", color: "#555" }}>{venue.sports}</p>
                  <p style={{ margin: "0 0 4px" }}>₹{venue.per_hr_charge} / slot</p>
                  <p style={{ margin: "0 0 12px" }}>⭐ {venue.rating || "N/A"}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/booking/confirm/${venue.v_no}`);
                    }}
                    style={{
                      marginTop: "auto",
                      padding: "10px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div
          className="pagination"
          style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "8px" }}
        >
          {Array.from({ length: Math.ceil(filteredVenues.length / venuesPerPage) }).map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => paginate(index + 1)}
              style={{
                padding: "8px 12px",
                border: "1px solid #2563eb",
                borderRadius: "4px",
                backgroundColor: currentPage === index + 1 ? "#2563eb" : "white",
                color: currentPage === index + 1 ? "white" : "#2563eb",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
