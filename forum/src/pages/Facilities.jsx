import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService';

export default function Facilities() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    api.getVenues()
      .then((data) => {
        if (!isMounted) return;
        setVenues(data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading facilities...</div>;
  if (error) return <div style={{ padding: 24, color: 'tomato' }}>Error: {error}</div>;

  return (
    <div className="container" style={{ padding: 24, paddingTop: 120 }}>
      <h1 style={{ marginBottom: 16 }}>Facilities</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {venues.map((v) => (
          <div key={v.v_no} style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#0b1220' }}>
            <div style={{ height: 160, background: '#111827' }}>
              {/* placeholder image */}
            </div>
            <div style={{ padding: 12 }}>
              <h3 style={{ margin: 0 }}>{v.court_name}</h3>
              <div style={{ opacity: 0.8, fontSize: 14, marginTop: 6 }}>{v.sports}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}>
                <div>₹{v.per_hr_charge} / hr</div>
                <button className="btn" onClick={() => navigate(`/venue/${v.v_no}`)}>View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


