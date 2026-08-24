import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ArchiveCard from '../../components/ArchiveCard';
import { useAuth } from '../../context/AuthContext';

// Resolve backend API URL from environment variable (NEXT_PUBLIC_API_URL configured in client/.env.local)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ArchivePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Local state for fetched archive items, loading indicators, errors, and filters
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [categoryTab, setCategoryTab] = useState('all'); // 'all' | 'songs' | 'instruments'
  const [tribeFilter, setTribeFilter] = useState('All');
  const [occasionFilter, setOccasionFilter] = useState('All');

  // Route Protection: Redirect unauthenticated users to /login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

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
    if (user) {
      fetchArchive();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

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

  // Separate music songs vs instruments
  const folkSongs = filteredItems.filter((item) => item.itemType === 'Folk Song');
  const instruments = filteredItems.filter((item) => item.itemType !== 'Folk Song');

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (authLoading || !user) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" style={{ color: '#0F7173' }} role="status">
          <span className="visually-hidden">Checking access...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Cultural Archive | SautiSmart</title>
      </Head>

      {/* Header Hero */}
      <section style={{ backgroundColor: '#0F7173', color: '#FFFFFF' }} className="py-5">
        <div className="container">
          <h1 className="fw-bold mb-2">Centralized Cultural Repository</h1>
          <p className="lead mb-0">
            Traditional Kenyan folk songs and indigenous musical instruments, categorized by tribe of
            origin and cultural occasion.
          </p>
        </div>
      </section>

      <section className="container py-4">
        {/* Navigation & Section Jump Bar */}
        <div className="card border-0 shadow-sm mb-4 rounded-3 p-3" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            {/* Main Category Tabs */}
            <div className="btn-group" role="group" aria-label="Category Selection">
              <button
                type="button"
                className={`btn fw-bold px-4 ${categoryTab === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={categoryTab === 'all' ? { backgroundColor: '#0F7173', borderColor: '#0F7173' } : {}}
                onClick={() => setCategoryTab('all')}
              >
                All Collections ({filteredItems.length})
              </button>
              <button
                type="button"
                className={`btn fw-bold px-4 ${categoryTab === 'songs' ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={categoryTab === 'songs' ? { backgroundColor: '#0F7173', borderColor: '#0F7173' } : {}}
                onClick={() => setCategoryTab('songs')}
              >
                Folk Songs & Music ({folkSongs.length})
              </button>
              <button
                type="button"
                className={`btn fw-bold px-4 ${categoryTab === 'instruments' ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={categoryTab === 'instruments' ? { backgroundColor: '#0F7173', borderColor: '#0F7173' } : {}}
                onClick={() => setCategoryTab('instruments')}
              >
                Indigenous Instruments ({instruments.length})
              </button>
            </div>

            {/* Quick Section Jump Buttons */}
            {categoryTab === 'all' && (
              <div className="d-flex align-items-center gap-2 ms-auto">
                <span className="small text-secondary fw-semibold">Quick Jump:</span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark fw-semibold"
                  onClick={() => scrollToSection('folk-songs-section')}
                >
                  Songs Section ↓
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark fw-semibold"
                  onClick={() => scrollToSection('instruments-section')}
                >
                  Instruments Section ↓
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Dropdowns */}
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
            No archive items match the selected filters.
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 1: CULTURAL FOLK SONGS & MUSIC                    */}
        {/* ========================================================= */}
        {!loading && !error && (categoryTab === 'all' || categoryTab === 'songs') && (
          <div id="folk-songs-section" className="mb-5 pt-2">
            <div className="p-3 mb-4 rounded-3 border-start border-4 border-success shadow-sm" style={{ backgroundColor: '#E8F5E9' }}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="h4 fw-bold mb-1" style={{ color: '#0F7173' }}>
                    Cultural Folk Songs & Traditional Chants
                  </h2>
                  <p className="mb-0 small text-secondary">
                    Official CBC repertoire of Kenyan folk music, bridal welcome chants, initiation dances, and harvest celebrations.
                  </p>
                </div>
                <span className="badge px-3 py-2 fs-6 rounded-pill" style={{ backgroundColor: '#69DC9E', color: '#0C0C0C' }}>
                  {folkSongs.length} Songs Loaded
                </span>
              </div>
            </div>

            {folkSongs.length === 0 ? (
              <div className="alert alert-light text-secondary">No folk songs match the selected filters.</div>
            ) : (
              <div className="row g-4">
                {folkSongs.map((item) => (
                  <div className="col-md-6 col-lg-4" key={item._id}>
                    <ArchiveCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Distinct Section Separator Bar */}
        {!loading && !error && categoryTab === 'all' && folkSongs.length > 0 && instruments.length > 0 && (
          <div className="my-5 text-center position-relative">
            <hr style={{ borderColor: '#E59F71', borderWidth: '2px' }} />
            <button
              type="button"
              className="btn btn-sm px-4 rounded-pill fw-bold shadow-sm position-absolute top-50 start-50 translate-middle"
              style={{ backgroundColor: '#E59F71', color: '#0C0C0C' }}
              onClick={() => scrollToSection('instruments-section')}
            >
              End of Music Section &mdash; Start of Indigenous Instruments ↓
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 2: INDIGENOUS MUSICAL INSTRUMENTS CATALOG         */}
        {/* ========================================================= */}
        {!loading && !error && (categoryTab === 'all' || categoryTab === 'instruments') && (
          <div id="instruments-section" className="mb-5 pt-2">
            <div className="p-3 mb-4 rounded-3 border-start border-4 border-warning shadow-sm" style={{ backgroundColor: '#FFF3E0' }}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="h4 fw-bold mb-1" style={{ color: '#0F7173' }}>
                    Indigenous Musical Instruments Catalog
                  </h2>
                  <p className="mb-0 small text-secondary">
                    Traditional Kenyan organology categorized into Chordophones (Strings), Membranophones (Drums), Idiophones (Self-sounding), and Aerophones (Wind).
                  </p>
                </div>
                <span className="badge px-3 py-2 fs-6 rounded-pill" style={{ backgroundColor: '#E59F71', color: '#0C0C0C' }}>
                  {instruments.length} Instruments Loaded
                </span>
              </div>
            </div>

            {instruments.length === 0 ? (
              <div className="alert alert-light text-secondary">No instruments match the selected filters.</div>
            ) : (
              <div className="row g-4">
                {instruments.map((item) => (
                  <div className="col-md-6 col-lg-4" key={item._id}>
                    <ArchiveCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
