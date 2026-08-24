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

function getYouTubeEmbedId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

function playSyntheticInstrumentSound(item) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const family = (item.instrumentFamily || '').toLowerCase();
    const title = (item.title || '').toLowerCase();

    if (family.includes('string') || title.includes('nyatiti') || title.includes('wandindi') || title.includes('litungu')) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(293.66, now);
      osc.frequency.exponentialRampToValueAtTime(146.83, now + 1.2);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } else if (family.includes('membranophone') || title.includes('drum') || title.includes('isukuti')) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.5);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (family.includes('idiophone') || title.includes('kalimba') || title.includes('kayamba') || title.includes('marimba')) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(587.33, now + 0.5);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.0);
    }
  } catch (e) {
    console.warn('Synthetic audio error:', e);
  }
}

export default function ArchiveCard({ item }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const displayImageUrl = getInstrumentImage(item);
  const youtubeId = getYouTubeEmbedId(item.audioUrl);

  const togglePlayback = () => {
    if (youtubeId) {
      setShowEmbed(!showEmbed);
      return;
    }

    if (item.audioUrl && (item.audioUrl.endsWith('.mp3') || item.audioUrl.endsWith('.wav'))) {
      const audioEl = audioRef.current;
      if (!audioEl) return;
      if (isPlaying) {
        audioEl.pause();
        setIsPlaying(false);
      } else {
        audioEl.play().catch(() => playSyntheticInstrumentSound(item));
        setIsPlaying(true);
      }
      return;
    }

    // Fallback: Play synthetic audio acoustic preview for traditional instruments
    playSyntheticInstrumentSound(item);
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1200);
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

        {/* Embedded YouTube Player */}
        {showEmbed && youtubeId && (
          <div className="ratio ratio-16x9 mb-3 rounded overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Playable Control Bar & YouTube Link */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-2 pt-2 border-top">
          <button
            type="button"
            className="btn btn-sm rounded-pill d-flex align-items-center gap-2 px-3 fw-bold"
            style={{ backgroundColor: '#69DC9E', color: '#0C0C0C', border: 'none' }}
            onClick={togglePlayback}
            aria-label={isPlaying ? `Pause ${item.title}` : `Play ${item.title}`}
          >
            <span>{isPlaying ? '⏸ Playing Sample...' : '▶ Play Audio Sample'}</span>
          </button>

          {item.audioUrl && (item.audioUrl.includes('youtube.com') || item.audioUrl.includes('youtu.be')) && (
            <a
              href={item.audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm rounded-pill fw-bold text-white d-inline-flex align-items-center gap-1 text-decoration-none"
              style={{ backgroundColor: '#FF0000', borderColor: '#FF0000' }}
              title="Open YouTube Link in New Tab"
            >
              <span>Watch on YouTube ↗</span>
            </a>
          )}

          {item.audioUrl && (item.audioUrl.endsWith('.mp3') || item.audioUrl.endsWith('.wav')) && (
            <audio ref={audioRef} src={item.audioUrl} onEnded={() => setIsPlaying(false)} preload="none" />
          )}
        </div>
      </div>
    </div>
  );
}
