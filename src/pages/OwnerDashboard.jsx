import React, { useState } from "react";
import "./styles/OwnerDashboard.css";

export default function OwnerDashboard() {
  const [activeSection, setActiveSection] = useState("myCourts");
  const [courts, setCourts] = useState([
    {
      id: 1,
      name: "Green Valley Tennis",
      sport: "Tennis",
      location: "Vapi",
      pricePerHour: 500,
      images: [],
      status: "Published",
    },
    {
      id: 2,
      name: "Smash Arena",
      sport: "Badminton",
      location: "Surat",
      pricePerHour: 350,
      images: [],
      status: "Published",
    },
  ]);

  const [bookings] = useState([
    {
      id: 101,
      courtName: "Green Valley Tennis",
      user: "Rohan",
      date: "2025-08-15",
      time: "17:00 - 18:00",
      price: 500,
      status: "Confirmed",
    },
    {
      id: 102,
      courtName: "Smash Arena",
      user: "Ananya",
      date: "2025-08-20",
      time: "07:00 - 08:00",
      price: 300,
      status: "Pending",
    },
  ]);

  // Add Court form state
  const [newCourt, setNewCourt] = useState({
    name: "",
    sport: "Tennis",
    location: "",
    pricePerHour: "",
    slots: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  // Settings form state
  const [owner, setOwner] = useState({
    name: "Court Owner",
    email: "owner@example.com",
    phone: "9999999999",
    paymentAccount: "UPI: owner@bank",
  });

  const handleDeleteCourt = (id) => {
    if (!window.confirm("Delete this court?")) return;
    setCourts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleNewCourtChange = (field, value) => {
    setNewCourt((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCourt = (e) => {
    e.preventDefault();
    const id = Date.now();
    setCourts((prev) => [
      ...prev,
      { id, ...newCourt, pricePerHour: Number(newCourt.pricePerHour), images: imagePreviews, status: "Draft" },
    ]);
    setNewCourt({ name: "", sport: "Tennis", location: "", pricePerHour: "", slots: [] });
    setImagePreviews([]);
    alert("Court added (local state). Connect to backend to persist.");
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // limit 5
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  const handleOwnerChange = (field, value) => {
    setOwner((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="owner-dashboard">
      <aside className="od-sidebar">
        <div className="od-brand">Owner Dashboard</div>
        <nav>
          <button className={activeSection === "myCourts" ? "active" : ""} onClick={() => setActiveSection("myCourts")}>
            My Courts
          </button>
          <button className={activeSection === "addCourt" ? "active" : ""} onClick={() => setActiveSection("addCourt")}>
            Add New Court
          </button>
          <button className={activeSection === "bookings" ? "active" : ""} onClick={() => setActiveSection("bookings")}>
            Bookings
          </button>
          <button className={activeSection === "settings" ? "active" : ""} onClick={() => setActiveSection("settings")}>
            Settings
          </button>
        </nav>
      </aside>

      <main className="od-main">
        {/* Header */}
        <header className="od-header">
          <h1>
            {activeSection === "myCourts" && "My Courts"}
            {activeSection === "addCourt" && "Add New Court"}
            {activeSection === "bookings" && "Bookings"}
            {activeSection === "settings" && "Settings"}
          </h1>
        </header>

        {/* Sections */}
        <section className={`od-section ${activeSection === "myCourts" ? "visible" : "hidden"}`}>
          <div className="cards-grid">
            {courts.map((c) => (
              <div key={c.id} className="court-card">
                <div className="court-thumb">
                  {c.images && c.images.length ? <img src={c.images[0]} alt={c.name} /> : <div className="placeholder">No Image</div>}
                </div>
                <div className="court-body">
                  <h3>{c.name}</h3>
                  <p className="meta">{c.sport} • {c.location}</p>
                  <p className="meta">₹{c.pricePerHour} / hr</p>
                  <p className="status">Status: <strong>{c.status}</strong></p>
                  <div className="card-actions">
                    <button className="edit">Edit</button>
                    <button className="delete" onClick={() => handleDeleteCourt(c.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`od-section ${activeSection === "addCourt" ? "visible" : "hidden"}`}>
          <form className="add-court-form" onSubmit={handleAddCourt}>
            <div className="form-row">
              <label>Court Name</label>
              <input value={newCourt.name} onChange={(e) => handleNewCourtChange("name", e.target.value)} required />
            </div>

            <div className="form-row two-col">
              <div>
                <label>Sport Type</label>
                <select value={newCourt.sport} onChange={(e) => handleNewCourtChange("sport", e.target.value)}>
                  <option>Tennis</option>
                  <option>Badminton</option>
                  <option>Football</option>
                  <option>Basketball</option>
                  <option>Cricket</option>
                </select>
              </div>
              <div>
                <label>Location</label>
                <input value={newCourt.location} onChange={(e) => handleNewCourtChange("location", e.target.value)} required />
              </div>
            </div>

            <div className="form-row two-col">
              <div>
                <label>Price per hour (₹)</label>
                <input type="number" value={newCourt.pricePerHour} onChange={(e) => handleNewCourtChange("pricePerHour", e.target.value)} required />
              </div>
              <div>
                <label>Available Slots (comma separated, e.g. 08:00-09:00,17:00-18:00)</label>
                <input value={newCourt.slots} onChange={(e) => handleNewCourtChange("slots", e.target.value)} placeholder="optional" />
              </div>
            </div>

            <div className="form-row">
              <label>Upload Images (max 5)</label>
              <input type="file" accept="image/*" multiple onChange={handleImages} />
              <div className="image-previews">
                {imagePreviews.map((src, i) => (
                  <img key={i} src={src} alt={`preview-${i}`} />
                ))}
                {!imagePreviews.length && <div className="preview-empty">No images</div>}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary">Add Court</button>
              <button type="button" onClick={() => { setNewCourt({ name: "", sport: "Tennis", location: "", pricePerHour: "", slots: [] }); setImagePreviews([]); }}>Reset</button>
            </div>
          </form>
        </section>

        <section className={`od-section ${activeSection === "bookings" ? "visible" : "hidden"}`}>
          <div className="bookings-list">
            <h2>Upcoming Bookings</h2>
            <div className="bookings-table">
              <div className="table-header">
                <div>Booking ID</div><div>Court</div><div>User</div><div>Date</div><div>Time</div><div>Price</div><div>Status</div>
              </div>
              {bookings.map((b) => (
                <div className="table-row" key={b.id}>
                  <div>{b.id}</div>
                  <div>{b.courtName}</div>
                  <div>{b.user}</div>
                  <div>{b.date}</div>
                  <div>{b.time}</div>
                  <div>₹{b.price}</div>
                  <div><span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`od-section ${activeSection === "settings" ? "visible" : "hidden"}`}>
          <form className="settings-form" onSubmit={(e) => { e.preventDefault(); alert("Saved (local)"); }}>
            <div className="form-row">
              <label>Owner Name</label>
              <input value={owner.name} onChange={(e) => handleOwnerChange("name", e.target.value)} />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input value={owner.email} onChange={(e) => handleOwnerChange("email", e.target.value)} />
            </div>
            <div className="form-row">
              <label>Phone</label>
              <input value={owner.phone} onChange={(e) => handleOwnerChange("phone", e.target.value)} />
            </div>
            <div className="form-row">
              <label>Payment Details</label>
              <input value={owner.paymentAccount} onChange={(e) => handleOwnerChange("paymentAccount", e.target.value)} />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary">Save Settings</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
