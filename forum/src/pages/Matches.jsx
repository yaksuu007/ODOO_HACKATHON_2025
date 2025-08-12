import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/apiService';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ sport: '', venue_id: '', status: '' });

  useEffect(() => {
    let isMounted = true;
    Promise.all([api.getMatches(), api.getVenues()])
      .then(([m, v]) => {
        if (!isMounted) return;
        setMatches(m || []);
        setVenues(v || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    return () => { isMounted = false; };
  }, []);

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      const sportOk = !filters.sport || m.sport?.toLowerCase() === filters.sport.toLowerCase();
      const venueOk = !filters.venue_id || Number(m.venue_id) === Number(filters.venue_id);
      const statusOk = !filters.status || m.status === filters.status;
      return sportOk && venueOk && statusOk;
    });
  }, [matches, filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      await api.createMatch({
        title: payload.title,
        sport: payload.sport,
        venue_id: Number(payload.venue_id),
        date: payload.date,
        start_time: payload.start_time,
        duration_hours: Number(payload.duration_hours || 1),
        max_players: Number(payload.max_players || 10)
      });
      const fresh = await api.getMatches();
      setMatches(fresh || []);
      e.currentTarget.reset();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading matches...</div>;
  if (error) return <div style={{ padding: 24, color: 'tomato' }}>Error: {error}</div>;

  return (
    <div className="container" style={{ padding: 24, paddingTop: 120 }}>
      <h1 style={{ marginBottom: 16 }}>Matches</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        <form onSubmit={handleCreate} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Create Match</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            <input name="title" placeholder="Title" required />
            <input name="sport" placeholder="Sport (e.g., Football)" required />
            <select name="venue_id" required>
              <option value="">Select Venue</option>
              {venues.map((v) => (
                <option key={v.v_no} value={v.v_no}>{v.court_name}</option>
              ))}
            </select>
            <input name="date" type="date" required />
            <input name="start_time" type="time" required />
            <input name="duration_hours" type="number" min="1" max="8" placeholder="Duration (hrs)" />
            <input name="max_players" type="number" min="2" max="40" placeholder="Max players" />
            <button className="btn-primary" type="submit">Create</button>
          </div>
        </form>

        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input placeholder="Sport" value={filters.sport} onChange={(e) => setFilters({ ...filters, sport: e.target.value })} />
            <select value={filters.venue_id} onChange={(e) => setFilters({ ...filters, venue_id: e.target.value })}>
              <option value="">All Venues</option>
              {venues.map((v) => (
                <option key={v.v_no} value={v.v_no}>{v.court_name}</option>
              ))}
            </select>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {filtered.map((m) => (
              <div key={m.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{m.title}</h3>
                    <div style={{ opacity: 0.8, fontSize: 14 }}>{m.sport} • {m.venue_name || `Venue #${m.venue_id}`}</div>
                    <div style={{ marginTop: 6 }}>
                      {m.date} • {m.start_time} • {m.duration_hours}h • {m.current_players}/{m.max_players}
                    </div>
                  </div>
                  <div style={{ textTransform: 'capitalize' }}>{m.status}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button className="btn-secondary" onClick={async () => {
                    const title = prompt('New title', m.title);
                    if (!title) return;
                    await api.updateMatch(m.id, { title });
                    setMatches(await api.getMatches());
                  }}>Edit</button>
                  <button className="btn-outline" onClick={async () => {
                    if (!confirm('Delete match?')) return;
                    await api.deleteMatch(m.id);
                    setMatches(await api.getMatches());
                  }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


