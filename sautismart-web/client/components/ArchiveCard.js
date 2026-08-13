import { useRef, useState } from 'react';

/**
 * ArchiveCard Component
 * Displays a single cultural archive entry (song or indigenous instrument),
 * rendering its metadata, image placeholder, tags, and inline audio playback.
 */
export default function ArchiveCard({ item }) {
  // DOM reference for controlling the HTML5 audio element
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    <div className="card h-100 shadow-sm border-0">
      <div
        className="card-img-top d-flex align-items-center justify-content-center"
        style={{
          height: '160px',
          backgroundColor: '#0F7173',
          backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!item.imageUrl && (
          <span className="fs-1" style={{ color: '#FFFFFF' }} aria-hidden="true">
            &#9835;
          </span>
        )}
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
