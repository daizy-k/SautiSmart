import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import AdminAddModal from '../../components/AdminAddModal';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token, isAdmin, loading: authLoading } = useAuth();

  // Tab State: 'setpieces' | 'archive' | 'theory'
  const [activeTab, setActiveTab] = useState('setpieces');

  // List Items
  const [setPieces, setSetPieces] = useState([]);
  const [archiveItems, setArchiveItems] = useState([]);
  const [theoryModules, setTheoryModules] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Alert State
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Form States
  const [setPieceForm, setSetPieceForm] = useState({
    title: '',
    composer: 'Traditional',
    instrument: 'Voice & Nyatiti',
    category: 'Choral',
    gradeLevel: 'Grade 4',
    audioURL: '',
    description: '',
  });

  const [archiveForm, setArchiveForm] = useState({
    itemName: '',
    category: 'Folk Song',
    tribeOfOrigin: 'Kikuyu',
    culturalOccasion: 'Circumcision / Initiation',
    mediaURL: '',
    description: '',
    culturalSignificance: '',
  });

  const [theoryForm, setTheoryForm] = useState({
    title: '',
    gradeLevel: 'Grade 4',
    strand: 'Performing Arts',
    topic: 'Rhythm and Meter',
    contentBody: '',
  });

  // Modal display toggles
  const [showSetPieceModal, setShowSetPieceModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showTheoryModal, setShowTheoryModal] = useState(false);

  // Protection Check: Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/login');
    }
  }, [user, isAdmin, authLoading, router]);

  // Fetch items based on active tab
  useEffect(() => {
    if (user && isAdmin) {
      fetchTabContent();
    }
  }, [user, isAdmin, activeTab]);

  const fetchTabContent = async () => {
    setLoadingData(true);
    try {
      if (activeTab === 'setpieces') {
        const res = await fetch(`${API_BASE}/setpieces`);
        const data = await res.json();
        setSetPieces(Array.isArray(data.data) ? data.data : []);
      } else if (activeTab === 'archive') {
        const res = await fetch(`${API_BASE}/archive`);
        const data = await res.json();
        setArchiveItems(Array.isArray(data.data) ? data.data : []);
      } else if (activeTab === 'theory') {
        const res = await fetch(`${API_BASE}/theory`);
        const data = await res.json();
        setTheoryModules(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error('Fetch Data Error:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Submit Set Piece Form
  const handleAddSetPiece = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    try {
      const payload = {
        title: setPieceForm.title,
        composer: setPieceForm.composer,
        category: setPieceForm.category,
        gradeLevel: setPieceForm.gradeLevel,
        fullMixAudioUrl: setPieceForm.audioURL,
        description: setPieceForm.description,
        stems: setPieceForm.audioURL
          ? [{ name: setPieceForm.instrument, instrument: setPieceForm.instrument, audioUrl: setPieceForm.audioURL }]
          : [],
      };

      const res = await fetch(`${API_BASE}/setpieces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add set piece');
      }

      setAlert({ type: 'success', message: 'New Set Piece added successfully!' });
      setShowSetPieceModal(false);
      setSetPieceForm({
        title: '',
        composer: 'Traditional',
        instrument: 'Voice & Nyatiti',
        category: 'Choral',
        gradeLevel: 'Grade 4',
        audioURL: '',
        description: '',
      });
      fetchTabContent();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
    }
  };

  // Submit Archive Form
  const handleAddArchiveItem = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    try {
      const payload = {
        title: archiveForm.itemName,
        itemType: archiveForm.category,
        tribeOfOrigin: archiveForm.tribeOfOrigin,
        culturalOccasion: archiveForm.culturalOccasion,
        description: archiveForm.description,
        culturalSignificance: archiveForm.culturalSignificance,
        audioUrl: archiveForm.mediaURL.endsWith('.mp3') || archiveForm.mediaURL.endsWith('.wav') ? archiveForm.mediaURL : '',
        imageUrl: !archiveForm.mediaURL.endsWith('.mp3') && !archiveForm.mediaURL.endsWith('.wav') ? archiveForm.mediaURL : '',
      };

      const res = await fetch(`${API_BASE}/archive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add archive item');
      }

      setAlert({ type: 'success', message: 'Cultural Archive Item added successfully!' });
      setShowArchiveModal(false);
      setArchiveForm({
        itemName: '',
        category: 'Folk Song',
        tribeOfOrigin: 'Kikuyu',
        culturalOccasion: 'Circumcision / Initiation',
        mediaURL: '',
        description: '',
        culturalSignificance: '',
      });
      fetchTabContent();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
    }
  };

  // Submit Theory Form
  const handleAddTheoryModule = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    try {
      const payload = {
        title: theoryForm.title,
        gradeLevel: theoryForm.gradeLevel,
        strand: theoryForm.strand,
        topic: theoryForm.topic,
        content: theoryForm.contentBody,
      };

      const res = await fetch(`${API_BASE}/theory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add theory module');
      }

      setAlert({ type: 'success', message: 'Theory Module created successfully!' });
      setShowTheoryModal(false);
      setTheoryForm({
        title: '',
        gradeLevel: 'Grade 4',
        strand: 'Performing Arts',
        topic: 'Rhythm and Meter',
        contentBody: '',
      });
      fetchTabContent();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
    }
  };

  // Delete item handler
  const handleDeleteItem = async (endpoint, id) => {
    if (!confirm('Are you sure you want to delete this content entry?')) return;

    try {
      const res = await fetch(`${API_BASE}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Delete operation failed');
      }

      setAlert({ type: 'success', message: 'Item deleted successfully.' });
      fetchTabContent();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message });
    }
  };

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" style={{ color: '#0F7173' }} role="status">
          <span className="visually-hidden">Authenticating Admin...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | SautiSmart</title>
      </Head>

      {/* Brand Header Banner */}
      <section style={{ backgroundColor: '#0F7173', color: '#FFFFFF' }} className="py-4 shadow-sm">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <h1 className="h3 fw-bold mb-1 d-flex align-items-center gap-2">
                <span>⚡ Admin Content Management Dashboard</span>
              </h1>
              <p className="small mb-0 opacity-75">
                Manage syllabus set pieces, cultural archives, and theory modules for Kenyan CBC Music Education.
              </p>
            </div>
            <span className="badge px-3 py-2 fs-6 rounded-pill" style={{ backgroundColor: '#E59F71', color: '#0C0C0C' }}>
              Administrator: {user.name} &middot; Music Learning App for CBC Students
            </span>
          </div>
        </div>
      </section>

      <div className="container py-4">
        {/* Alerts */}
        {alert.message && (
          <div
            className={`alert alert-${alert.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}
            role="alert"
            style={alert.type === 'success' ? { backgroundColor: '#69DC9E', color: '#0C0C0C', borderColor: '#69DC9E' } : {}}
          >
            {alert.message}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', message: '' })} />
          </div>
        )}

        {/* Upload Form Component */}
        <AdminAddModal onContentAdded={fetchTabContent} />

        {/* Admin Management Bar with Form Triggers */}
        <div className="card border-0 shadow-sm mb-4 rounded-3" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-md-3">
                <span className="fw-bold small text-uppercase tracking-wider" style={{ color: '#0C0C0C' }}>
                  ⚡ Quick Action Forms:
                </span>
              </div>
              <div className="col-md-9 d-flex flex-wrap gap-2 justify-content-md-end">
                <button
                  type="button"
                  className="btn btn-sm text-white fw-bold px-3"
                  style={{ backgroundColor: '#0F7173' }}
                  onClick={() => setShowSetPieceModal(true)}
                >
                  + Add New Set Piece
                </button>
                <button
                  type="button"
                  className="btn btn-sm fw-bold px-3"
                  style={{ backgroundColor: '#E59F71', color: '#0C0C0C' }}
                  onClick={() => setShowArchiveModal(true)}
                >
                  + Add Archive Item
                </button>
                <button
                  type="button"
                  className="btn btn-sm fw-bold px-3"
                  style={{ backgroundColor: '#69DC9E', color: '#0C0C0C' }}
                  onClick={() => setShowTheoryModal(true)}
                >
                  + Add Theory Module
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Database Content Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link fw-semibold ${activeTab === 'setpieces' ? 'active' : ''}`}
              style={activeTab === 'setpieces' ? { color: '#0F7173', borderTop: '3px solid #0F7173' } : { color: '#0C0C0C' }}
              onClick={() => setActiveTab('setpieces')}
            >
              🎵 Set Pieces ({setPieces.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link fw-semibold ${activeTab === 'archive' ? 'active' : ''}`}
              style={activeTab === 'archive' ? { color: '#0F7173', borderTop: '3px solid #0F7173' } : { color: '#0C0C0C' }}
              onClick={() => setActiveTab('archive')}
            >
              🏛️ Cultural Archive ({archiveItems.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link fw-semibold ${activeTab === 'theory' ? 'active' : ''}`}
              style={activeTab === 'theory' ? { color: '#0F7173', borderTop: '3px solid #0F7173' } : { color: '#0C0C0C' }}
              onClick={() => setActiveTab('theory')}
            >
              📚 Theory Modules ({theoryModules.length})
            </button>
          </li>
        </ul>

        {loadingData ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#0F7173' }} role="status" />
          </div>
        ) : (
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-0">
              {/* SET PIECES TABLE */}
              {activeTab === 'setpieces' && (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ backgroundColor: '#0F7173', color: '#FFFFFF' }}>
                      <tr>
                        <th>Title</th>
                        <th>Grade</th>
                        <th>Category</th>
                        <th>Composer</th>
                        <th>Audio Track</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {setPieces.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-muted">
                            No Set Pieces found in database. Click "+ Add New Set Piece" above to create one.
                          </td>
                        </tr>
                      ) : (
                        setPieces.map((item) => (
                          <tr key={item._id}>
                            <td className="fw-bold">{item.title}</td>
                            <td>
                              <span className="badge" style={{ backgroundColor: '#E59F71', color: '#0C0C0C' }}>
                                {item.gradeLevel}
                              </span>
                            </td>
                            <td>{item.category}</td>
                            <td>{item.composer || 'Traditional'}</td>
                            <td>
                              {item.fullMixAudioUrl ? (
                                <span className="badge" style={{ backgroundColor: '#69DC9E', color: '#0C0C0C' }}>
                                  ✓ Audio Attached
                                </span>
                              ) : (
                                <span className="text-muted small">No Audio</span>
                              )}
                            </td>
                            <td className="text-end">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteItem('setpieces', item._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CULTURAL ARCHIVE TABLE */}
              {activeTab === 'archive' && (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ backgroundColor: '#0F7173', color: '#FFFFFF' }}>
                      <tr>
                        <th>Title / Item Name</th>
                        <th>Category</th>
                        <th>Tribe of Origin</th>
                        <th>Cultural Occasion</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {archiveItems.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-muted">
                            No Cultural Archive items found. Click "+ Add Archive Item" above to create one.
                          </td>
                        </tr>
                      ) : (
                        archiveItems.map((item) => (
                          <tr key={item._id}>
                            <td className="fw-bold">{item.title}</td>
                            <td>
                              <span className="badge" style={{ backgroundColor: '#69DC9E', color: '#0C0C0C' }}>
                                {item.itemType}
                              </span>
                            </td>
                            <td>{item.tribeOfOrigin}</td>
                            <td>{item.culturalOccasion}</td>
                            <td className="text-end">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteItem('archive', item._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* THEORY MODULES TABLE */}
              {activeTab === 'theory' && (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ backgroundColor: '#0F7173', color: '#FFFFFF' }}>
                      <tr>
                        <th>Title</th>
                        <th>Grade</th>
                        <th>Strand</th>
                        <th>Topic</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {theoryModules.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-muted">
                            No Theory Modules found. Click "+ Add Theory Module" above to create one.
                          </td>
                        </tr>
                      ) : (
                        theoryModules.map((item) => (
                          <tr key={item._id}>
                            <td className="fw-bold">{item.title}</td>
                            <td>
                              <span className="badge" style={{ backgroundColor: '#E59F71', color: '#0C0C0C' }}>
                                {item.gradeLevel}
                              </span>
                            </td>
                            <td>{item.strand}</td>
                            <td>{item.topic}</td>
                            <td className="text-end">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteItem('theory', item._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FORM MODAL 1: ADD SET PIECE */}
      {showSetPieceModal && (
        <div className="modal d-block tab-modal" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header text-white" style={{ backgroundColor: '#0F7173' }}>
                <h5 className="modal-title fw-bold">🎵 Add New Set Piece</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowSetPieceModal(false)} />
              </div>
              <form onSubmit={handleAddSetPiece}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={setPieceForm.title}
                        onChange={(e) => setSetPieceForm({ ...setPieceForm, title: e.target.value })}
                        placeholder="e.g. Wana wa Akhaisenga"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Instrument / Primary Voice</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={setPieceForm.instrument}
                        onChange={(e) => setSetPieceForm({ ...setPieceForm, instrument: e.target.value })}
                        placeholder="e.g. Choral Voices & Nyatiti"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Grade Level</label>
                      <select
                        className="form-select"
                        value={setPieceForm.gradeLevel}
                        onChange={(e) => setSetPieceForm({ ...setPieceForm, gradeLevel: e.target.value })}
                      >
                        <option>Grade 4</option>
                        <option>Grade 5</option>
                        <option>Grade 6</option>
                        <option>Grade 7</option>
                        <option>Grade 8</option>
                        <option>Grade 9</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Category</label>
                      <select
                        className="form-select"
                        value={setPieceForm.category}
                        onChange={(e) => setSetPieceForm({ ...setPieceForm, category: e.target.value })}
                      >
                        <option>Choral</option>
                        <option>Instrumental</option>
                        <option>Set Book Song</option>
                        <option>Folk Fusion</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Composer</label>
                      <input
                        type="text"
                        className="form-control"
                        value={setPieceForm.composer}
                        onChange={(e) => setSetPieceForm({ ...setPieceForm, composer: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Audio URL (Audio Track link)</label>
                      <input
                        type="url"
                        className="form-control"
                        value={setPieceForm.audioURL}
                        onChange={(e) => setSetPieceForm({ ...setPieceForm, audioURL: e.target.value })}
                        placeholder="https://example.com/audio/song.mp3"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={setPieceForm.description}
                        onChange={(e) => setSetPieceForm({ ...setPieceForm, description: e.target.value })}
                        placeholder="Syllabus notes and performance guidelines..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowSetPieceModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn text-white fw-bold" style={{ backgroundColor: '#0F7173' }}>
                    Save Set Piece
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL 2: ADD CULTURAL ARCHIVE ITEM */}
      {showArchiveModal && (
        <div className="modal d-block tab-modal" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header text-dark" style={{ backgroundColor: '#E59F71' }}>
                <h5 className="modal-title fw-bold">🏛️ Add Cultural Archive Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowArchiveModal(false)} />
              </div>
              <form onSubmit={handleAddArchiveItem}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Item Name / Title</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={archiveForm.itemName}
                        onChange={(e) => setArchiveForm({ ...archiveForm, itemName: e.target.value })}
                        placeholder="e.g. Mwanani or Isukuti"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Category (Item Type)</label>
                      <select
                        className="form-select"
                        value={archiveForm.category}
                        onChange={(e) => setArchiveForm({ ...archiveForm, category: e.target.value })}
                      >
                        <option>Folk Song</option>
                        <option>Indigenous Instrument</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Tribe of Origin</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={archiveForm.tribeOfOrigin}
                        onChange={(e) => setArchiveForm({ ...archiveForm, tribeOfOrigin: e.target.value })}
                        placeholder="e.g. Luhya, Kikuyu, Luo, Giriama"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Cultural Occasion</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={archiveForm.culturalOccasion}
                        onChange={(e) => setArchiveForm({ ...archiveForm, culturalOccasion: e.target.value })}
                        placeholder="e.g. Wedding, Harvest, Circumcision"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Media URL (Audio / Image Link)</label>
                      <input
                        type="url"
                        className="form-control"
                        value={archiveForm.mediaURL}
                        onChange={(e) => setArchiveForm({ ...archiveForm, mediaURL: e.target.value })}
                        placeholder="https://example.com/media/sample.mp3"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        required
                        value={archiveForm.description}
                        onChange={(e) => setArchiveForm({ ...archiveForm, description: e.target.value })}
                        placeholder="Detailed historical background..."
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Cultural Significance</label>
                      <input
                        type="text"
                        className="form-control"
                        value={archiveForm.culturalSignificance}
                        onChange={(e) => setArchiveForm({ ...archiveForm, culturalSignificance: e.target.value })}
                        placeholder="Role in community rituals..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowArchiveModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn text-dark fw-bold" style={{ backgroundColor: '#E59F71' }}>
                    Save Archive Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL 3: ADD THEORY MODULE */}
      {showTheoryModal && (
        <div className="modal d-block tab-modal" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header text-dark" style={{ backgroundColor: '#69DC9E' }}>
                <h5 className="modal-title fw-bold">📚 Add Theory Module</h5>
                <button type="button" className="btn-close" onClick={() => setShowTheoryModal(false)} />
              </div>
              <form onSubmit={handleAddTheoryModule}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Module Title</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={theoryForm.title}
                        onChange={(e) => setTheoryForm({ ...theoryForm, title: e.target.value })}
                        placeholder="e.g. Understanding Sol-fa Notation"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Grade Level</label>
                      <select
                        className="form-select"
                        value={theoryForm.gradeLevel}
                        onChange={(e) => setTheoryForm({ ...theoryForm, gradeLevel: e.target.value })}
                      >
                        <option>Grade 4</option>
                        <option>Grade 5</option>
                        <option>Grade 6</option>
                        <option>Grade 7</option>
                        <option>Grade 8</option>
                        <option>Grade 9</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">CBC Strand</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={theoryForm.strand}
                        onChange={(e) => setTheoryForm({ ...theoryForm, strand: e.target.value })}
                        placeholder="e.g. Performing Arts or Creating Music"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Topic</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={theoryForm.topic}
                        onChange={(e) => setTheoryForm({ ...theoryForm, topic: e.target.value })}
                        placeholder="e.g. Western Scale Structures"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Content Body (Lesson Notes)</label>
                      <textarea
                        className="form-control"
                        rows="5"
                        required
                        value={theoryForm.contentBody}
                        onChange={(e) => setTheoryForm({ ...theoryForm, contentBody: e.target.value })}
                        placeholder="Enter comprehensive lesson notes and explanations..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowTheoryModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn text-dark fw-bold" style={{ backgroundColor: '#69DC9E' }}>
                    Save Theory Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
