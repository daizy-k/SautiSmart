import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AudioPlayer from '../../components/AudioPlayer';
import { useAuth } from '../../context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SetPiecesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [setPieces, setSetPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePieceId, setActivePieceId] = useState(null);
  const [gradeFilter, setGradeFilter] = useState('All');

  // Route Protection: Redirect unauthenticated users to /login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    let isMounted = true;
    async function fetchSetPieces() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/setpieces`);
        if (!res.ok) {
          throw new Error(`Failed to load set pieces (status ${res.status})`);
        }
        const data = await res.json();
        if (isMounted) {
          const list = Array.isArray(data.data) ? data.data : [];
          setSetPieces(list);
          if (list.length > 0) {
            setActivePieceId(list[0]._id);
          }
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
      fetchSetPieces();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const grades = ['All', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'];

  const visiblePieces = setPieces.filter(
    (piece) => gradeFilter === 'All' || piece.gradeLevel === gradeFilter
  );

  const activePiece = setPieces.find((piece) => piece._id === activePieceId) || null;

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
        <title>Set Piece Practice | SautiSmart</title>
      </Head>

      <section style={{ backgroundColor: '#0F7173', color: '#FFFFFF' }} className="py-5">
        <div className="container">
          <h1 className="fw-bold">Set Piece Practice Studio</h1>
          <p className="lead mb-0">
            Slow a set piece down, speed it up, or isolate a single stem &mdash; all without
            losing pitch.
          </p>
        </div>
      </section>

      <section className="container py-4">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#0F7173' }} role="status">
              <span className="visually-hidden">Loading set pieces...</span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger" role="alert">
            Could not load set pieces: {error}
          </div>
        )}

        {!loading && !error && setPieces.length === 0 && (
          <div className="alert" style={{ backgroundColor: '#E59F71', color: '#0C0C0C' }}>
            No set pieces have been added to SautiSmart yet.
          </div>
        )}

        {!loading && !error && setPieces.length > 0 && (
          <div className="row g-4">
            <div className="col-lg-4">
              <label htmlFor="gradeFilter" className="form-label fw-semibold" style={{ color: '#0C0C0C' }}>
                Filter by Grade Level
              </label>
              <select
                id="gradeFilter"
                className="form-select mb-3"
                value={gradeFilter}
                onChange={(event) => setGradeFilter(event.target.value)}
              >
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              <div className="list-group">
                {visiblePieces.map((piece) => (
                  <button
                    type="button"
                    key={piece._id}
                    onClick={() => setActivePieceId(piece._id)}
                    className="list-group-item list-group-item-action"
                    style={
                      piece._id === activePieceId
                        ? { backgroundColor: '#0F7173', color: '#FFFFFF', borderColor: '#0F7173' }
                        : {}
                    }
                  >
                    <div className="fw-semibold">{piece.title}</div>
                    <div className="small" style={{ opacity: 0.8 }}>
                      {piece.gradeLevel} &middot; {piece.category}
                    </div>
                  </button>
                ))}
                {visiblePieces.length === 0 && (
                  <div className="list-group-item small text-secondary">
                    No set pieces for this grade level yet.
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-8">{activePiece && <AudioPlayer setPiece={activePiece} />}</div>
          </div>
        )}
      </section>
    </>
  );
}
