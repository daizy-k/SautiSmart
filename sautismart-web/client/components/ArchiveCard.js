import { useRef, useState } from 'react';

/**
 * ArchiveCard Component
 * Displays a single cultural archive entry (song or indigenous instrument),
 * rendering its metadata, image placeholder, tags, and inline audio playback.
 */
function getInstrumentImage(item) {
  if (item.imageUrl && item.imageUrl.startsWith('/images/instruments/')) {
    return item.imageUrl;
  }
  const family = (item.instrumentFamily || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  const type = (item.itemType || '').toLowerCase();

  // 1st Image: Chordophone (String / Lyre / Bow / Fiddle)
  if (
    family.includes('string') ||
    family.includes('chordophone') ||
    title.includes('nyatiti') ||
    title.includes('wandindi') ||
    title.includes('litungu') ||
    title.includes('obokano') ||
    title.includes('fiddle') ||
    title.includes('lyre') ||
    title.includes('bow') ||
    title.includes('zither')
  ) {
    return '/images/instruments/chordophone.png';
  }
  // 2nd Image: Membranophone (Drums / Percussive Hide Drums)
  if (
    family.includes('membranophone') ||
    family.includes('drum') ||
    title.includes('drum') ||
    title.includes('isukuti') ||
    title.includes('bul') ||
    title.includes('kithembe') ||
    title.includes('embegete') ||
    title.includes('ngoma')
  ) {
    return '/images/instruments/membranophone.png';
  }
  // 3rd Image: Idiophone (Kalimba / Shakers / Kayamba / Bells / Thumb Piano)
  if (
    family.includes('idiophone') ||
    title.includes('kayamba') ||
    title.includes('marimba') ||
    title.includes('gara') ||
    title.includes('bell') ||
    title.includes('kalimba') ||
    title.includes('chinyimba') ||
    title.includes('rattle')
  ) {
    return '/images/instruments/idiophone.png';
  }
  // 4th Image: Aerophone (Wind / Flute / Horn / Siwa / Trumpet)
  if (
    family.includes('wind') ||
    family.includes('aerophone') ||
    title.includes('flute') ||
    title.includes('horn') ||
    title.includes('chivoti') ||
    title.includes('siwa') ||
    title.includes('muturiru') ||
    title.includes('biringi') ||
    title.includes('aluti')
  ) {
    return '/images/instruments/aerophone.png';
  }

  // Fallback default based on itemType
  if (type.includes('song')) {
    return '/images/instruments/aerophone.png';
  }
  return '/images/instruments/chordophone.png';
}

export default function ArchiveCard({ item }) {
  // DOM reference for controlling the HTML5 audio element
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const displayImageUrl = getInstrumentImage(item);

  // Toggle audio playback state
  const togglePlayback = () => {
    const audioEl = audioRef.current;
    if (!audioEl) {
      return;
    }
    if (isPlaying) {
      audioEl.pause();
      setIsPlaying(false);
    } else {
      audioEl.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 overflow-hidden">
      <div
        className="card-img-top d-flex align-items-center justify-content-center position-relative"
        style={{
          height: '200px',
          backgroundColor: '#0F7173',
          backgroundImage: `url(${displayImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <span
          className="position-absolute bottom-0 end-0 badge m-2"
          style={{ backgroundColor: 'rgba(15, 113, 115, 0.95)', color: '#FFFFFF' }}
        >
          {item.instrumentFamily || item.itemType}
        </span>
      </div>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h3 className="h5 fw-bold mb-0" style={{ color: '#0C0C0C' }}>
            {item.title}
          </h3>
          <span className="badge rounded-pill" style={{ backgroundColor: '#E59F71', color: '#0C0C0C' }}>
            {item.itemType}
          </span>
        </div>
        <p className="mb-1 small text-secondary">
          <strong>Tribe of Origin:</strong> {item.tribeOfOrigin || 'N/A'}
        </p>
        <p className="mb-2 small text-secondary">
          <strong>Occasion:</strong> {item.culturalOccasion || 'N/A'}
        </p>
        <p className="card-text flex-grow-1">{item.description}</p>

        {item.culturalSignificance && (
          <p className="small fst-italic mb-2" style={{ color: '#0F7173' }}>
            {item.culturalSignificance}
          </p>
        )}

        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="badge"
                style={{ backgroundColor: '#FFFFFF', color: '#0F7173', border: '1px solid #0F7173' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {item.audioUrl && (
          <div className="d-flex align-items-center gap-2 mt-2">
            <button
              type="button"
              className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ backgroundColor: '#69DC9E', color: '#0C0C0C', width: '40px', height: '40px' }}
              onClick={togglePlayback}
              aria-label={isPlaying ? `Pause ${item.title}` : `Play ${item.title}`}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <audio ref={audioRef} src={item.audioUrl} onEnded={() => setIsPlaying(false)} preload="none" />
            <span className="small text-secondary">Listen to a sample</span>
          </div>
        )}
      </div>
    </div>
  );
}
