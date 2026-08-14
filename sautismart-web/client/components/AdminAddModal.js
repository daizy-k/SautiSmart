import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const AdminAddModal = ({ onContentAdded }) => {
  const [activeTab, setActiveTab] = useState('setPiece');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form States
  const [setPieceForm, setSetPieceForm] = useState({ title: '', instrument: 'Descant Recorder', gradeLevel: 4, audioURL: '' });
  const [archiveForm, setArchiveForm] = useState({ itemName: '', category: 'Song', tribeOfOrigin: '', culturalOccasion: '', mediaURL: '', description: '' });
  const [theoryForm, setTheoryForm] = useState({ title: '', gradeLevel: 4, contentBody: '' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleSubmit = async (endpoint, formData, resetFn) => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    // Format payload to match backend mongoose models
    let payload = formData;
    if (endpoint === 'setpieces') {
      const gLevel = String(formData.gradeLevel).startsWith('Grade') 
        ? formData.gradeLevel 
        : `Grade ${formData.gradeLevel}`;
      payload = {
        title: formData.title,
        gradeLevel: gLevel,
        composer: 'Traditional',
        category: 'Instrumental',
        fullMixAudioUrl: formData.audioURL,
        stems: formData.audioURL ? [{ name: formData.instrument || 'Lead', instrument: formData.instrument || 'Lead', audioUrl: formData.audioURL }] : []
      };
    } else if (endpoint === 'archive') {
      payload = {
        title: formData.itemName,
        itemType: formData.category === 'Instrument' ? 'Indigenous Instrument' : 'Folk Song',
        tribeOfOrigin: formData.tribeOfOrigin,
        culturalOccasion: formData.culturalOccasion,
        description: formData.description || `${formData.itemName} - Traditional ${formData.category} from ${formData.tribeOfOrigin}`,
        audioUrl: formData.mediaURL.endsWith('.mp3') || formData.mediaURL.endsWith('.wav') ? formData.mediaURL : '',
        imageUrl: !formData.mediaURL.endsWith('.mp3') && !formData.mediaURL.endsWith('.wav') ? formData.mediaURL : ''
      };
    } else if (endpoint === 'theory') {
      const gLevel = String(formData.gradeLevel).startsWith('Grade') 
        ? formData.gradeLevel 
        : `Grade ${formData.gradeLevel}`;
      payload = {
        title: formData.title,
        gradeLevel: gLevel,
        strand: 'Performing Arts',
        topic: formData.title,
        content: formData.contentBody
      };
    }

    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit item.');
      }

      setMessage({ text: 'Content successfully uploaded to database!', type: 'success' });
      resetFn();
      if (onContentAdded) onContentAdded();
    } catch (err) {
      setMessage({ text: err.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4" style={{ borderColor: '#0F7173' }}>
      <div className="card-header text-white" style={{ backgroundColor: '#0F7173' }}>
        <h5 className="mb-0">Admin Management Portal: Upload Learning Resources</h5>
      </div>
      <div className="card-body">
        {message.text && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        {/* Tab Selection */}
        <ul className="nav nav-pills mb-3">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'setPiece' ? 'active' : ''}`}
              style={{ backgroundColor: activeTab === 'setPiece' ? '#0F7173' : 'transparent', color: activeTab === 'setPiece' ? '#FFF' : '#0C0C0C' }}
              onClick={() => setActiveTab('setPiece')}
            >
              Add Set Piece
            </button>
          </li>
          <li className="nav-item ms-2">
            <button 
              className={`nav-link ${activeTab === 'archive' ? 'active' : ''}`}
              style={{ backgroundColor: activeTab === 'archive' ? '#0F7173' : 'transparent', color: activeTab === 'archive' ? '#FFF' : '#0C0C0C' }}
              onClick={() => setActiveTab('archive')}
            >
              Add Cultural Item / YouTube Link
            </button>
          </li>
          <li className="nav-item ms-2">
            <button 
              className={`nav-link ${activeTab === 'theory' ? 'active' : ''}`}
              style={{ backgroundColor: activeTab === 'theory' ? '#0F7173' : 'transparent', color: activeTab === 'theory' ? '#FFF' : '#0C0C0C' }}
              onClick={() => setActiveTab('theory')}
            >
              Add Theory Module
            </button>
          </li>
        </ul>

        {/* Form 1: Set Piece */}
        {activeTab === 'setPiece' && (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit('setpieces', setPieceForm, () => setSetPieceForm({ title: '', instrument: 'Descant Recorder', gradeLevel: 4, audioURL: '' }));
          }}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Piece Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={setPieceForm.title} 
                  onChange={(e) => setSetPieceForm({ ...setPieceForm, title: e.target.value })} 
                  placeholder="e.g., National Anthem Variation" 
                  required 
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Instrument</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={setPieceForm.instrument} 
                  onChange={(e) => setSetPieceForm({ ...setPieceForm, instrument: e.target.value })} 
                  placeholder="e.g., Descant Recorder" 
                  required 
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Grade Level (4-9)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="4" 
                  max="9" 
                  value={setPieceForm.gradeLevel} 
                  onChange={(e) => setSetPieceForm({ ...setPieceForm, gradeLevel: e.target.value })} 
                  required 
                />
              </div>
              <div className="col-12">
                <label className="form-label">Audio File URL</label>
                <input 
                  type="url" 
                  className="form-control" 
                  value={setPieceForm.audioURL} 
                  onChange={(e) => setSetPieceForm({ ...setPieceForm, audioURL: e.target.value })} 
                  placeholder="Direct .mp3 link (e.g., https://example.com/audio.mp3)" 
                  required 
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="btn mt-3 text-white" 
              style={{ backgroundColor: '#0F7173' }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Save Set Piece to Database'}
            </button>
          </form>
        )}

        {/* Form 2: Cultural Item */}
        {activeTab === 'archive' && (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit('archive', archiveForm, () => setArchiveForm({ itemName: '', category: 'Song', tribeOfOrigin: '', culturalOccasion: '', mediaURL: '', description: '' }));
          }}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Song or Instrument Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={archiveForm.itemName} 
                  onChange={(e) => setArchiveForm({ ...archiveForm, itemName: e.target.value })} 
                  placeholder="e.g., Sioyaye Circumcision Song" 
                  required 
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Category</label>
                <select 
                  className="form-select" 
                  value={archiveForm.category} 
                  onChange={(e) => setArchiveForm({ ...archiveForm, category: e.target.value })}
                >
                  <option value="Song">Song</option>
                  <option value="Instrument">Instrument</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Tribe of Origin</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={archiveForm.tribeOfOrigin} 
                  onChange={(e) => setArchiveForm({ ...archiveForm, tribeOfOrigin: e.target.value })} 
                  placeholder="e.g., Luhya, Luo, Kikuyu" 
                  required 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Cultural Occasion</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={archiveForm.culturalOccasion} 
                  onChange={(e) => setArchiveForm({ ...archiveForm, culturalOccasion: e.target.value })} 
                  placeholder="e.g., Wedding, Initiation, Naming" 
                  required 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">YouTube / Media URL</label>
                <input 
                  type="url" 
                  className="form-control" 
                  value={archiveForm.mediaURL} 
                  onChange={(e) => setArchiveForm({ ...archiveForm, mediaURL: e.target.value })} 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  required 
                />
              </div>
              <div className="col-12">
                <label className="form-label">Description / Background Lore</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  value={archiveForm.description} 
                  onChange={(e) => setArchiveForm({ ...archiveForm, description: e.target.value })} 
                  placeholder="Provide historical context or instruments used..."
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="btn mt-3 text-white" 
              style={{ backgroundColor: '#0F7173' }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Save Cultural Item to Database'}
            </button>
          </form>
        )}

        {/* Form 3: Theory Module */}
        {activeTab === 'theory' && (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit('theory', theoryForm, () => setTheoryForm({ title: '', gradeLevel: 4, contentBody: '' }));
          }}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Lesson Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={theoryForm.title} 
                  onChange={(e) => setTheoryForm({ ...theoryForm, title: e.target.value })} 
                  placeholder="e.g., The Treble Clef and Staff" 
                  required 
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Grade Level (4-9)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="4" 
                  max="9" 
                  value={theoryForm.gradeLevel} 
                  onChange={(e) => setTheoryForm({ ...theoryForm, gradeLevel: e.target.value })} 
                  required 
                />
              </div>
              <div className="col-12">
                <label className="form-label">Lesson Content / Revision Notes</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  value={theoryForm.contentBody} 
                  onChange={(e) => setTheoryForm({ ...theoryForm, contentBody: e.target.value })} 
                  placeholder="Enter the revision notes or instructions for students..." 
                  required 
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="btn mt-3 text-white" 
              style={{ backgroundColor: '#0F7173' }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Save Theory Lesson to Database'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminAddModal;
