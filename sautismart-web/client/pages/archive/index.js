import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import ArchiveCard from '../../components/ArchiveCard';

// Resolve backend API URL from environment variable (NEXT_PUBLIC_API_URL configured in client/.env.local)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ArchivePage() {
  // Local state for fetched archive items, loading indicators, errors, and filters
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tribeFilter, setTribeFilter] = useState('All');
  const [occasionFilter, setOccasionFilter] = useState('All');

  // Fetch cultural archive items from the Express backend API on component mount
  useEffect(() => {
    let isMounted = true;
    async function fetchArchive() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/archive`);
        if (!res.ok) {
          throw new Error(`Failed to load archive (status ${res.status})`);
        }
        const data = await res.json();
        if (isMounted) {
          setItems(Array.isArray(data.data) ? data.data : []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchArchive();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute unique list of tribes dynamically from the loaded items
  const tribes = useMemo(() => {
    const unique = new Set(items.map((item) => item.tribeOfOrigin).filter(Boolean));
    return ['All', ...Array.from(unique).sort()];
  }, [items]);

  const occasions = useMemo(() => {
    const unique = new Set(items.map((item) => item.culturalOccasion).filter(Boolean));
    return ['All', ...Array.from(unique).sort()];
  }, [items]);

  const filteredItems = items.filter((item) => {
    const matchesTribe = tribeFilter === 'All' || item.tribeOfOrigin === tribeFilter;
    const matchesOccasion = occasionFilter === 'All' || item.culturalOccasion === occasionFilter;
    return matchesTribe && matchesOccasion;
  });

  return (
    <>
      <Head>
        <title>Cultural Archive | SautiSmart</title>
      </Head>

      <section style={{ backgroundColor: '#0F7173', color: '#FFFFFF' }} className="py-5">
        <div className="container">
          <h1 className="fw-bold">Centralized Cultural Repository</h1>
          <p className="lead mb-0">
            Traditional Kenyan folk songs and indigenous instruments, categorized by tribe of
            origin and cultural occasion.
          </p>
        </div>
      </section>

      <section className="container py-4">
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label htmlFor="tribeFilter" className="form-label fw-semibold" style={{ color: '#0C0C0C' }}>
              Filter by Tribe of Origin
            </label>
            <select
              id="tribeFilter"
              className="form-select"
              value={tribeFilter}
              onChange={(event) => setTribeFilter(event.target.value)}
            >
              {tribes.map((tribe) => (
                <option key={tribe} value={tribe}>
                  {tribe}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="occasionFilter" className="form-label fw-semibold" style={{ color: '#0C0C0C' }}>
              Filter by Cultural Occasion
            </label>
            <select
              id="occasionFilter"
              className="form-select"
              value={occasionFilter}
              onChange={(event) => setOccasionFilter(event.target.value)}
            >
              {occasions.map((occasion) => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#0F7173' }} role="status">
              <span className="visually-hidden">Loading archive...</span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger" role="alert">
            Could not load the cultural archive: {error}
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="alert" style={{ backgroundColor: '#E59F71', color: '#0C0C0C' }}>
            No archive items match the selected filters yet.
          </div>
        )}

        <div className="row g-4">
          {filteredItems.map((item) => (
            <div className="col-md-6 col-lg-4" key={item._id}>
              <ArchiveCard item={item} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
