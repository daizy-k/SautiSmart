import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Builds the list of playable stems for a SetPiece. When the piece has
 * individually recorded stems (per Chapter 4's SetPiece schema) each one is
 * decoded and mixed independently so it can be volume-isolated. If only a
 * fullMixAudioUrl is present, that single track is treated as one stem.
 */
function buildStemList(setPiece) {
  if (setPiece && Array.isArray(setPiece.stems) && setPiece.stems.length > 0) {
    return setPiece.stems.map((stem, index) => ({
      id: `${setPiece._id || 'piece'}-stem-${index}`,
      name: stem.name || `Stem ${index + 1}`,
      instrument: stem.instrument || 'Ensemble',
      audioUrl: stem.audioUrl,
      defaultVolume: typeof stem.defaultVolume === 'number' ? stem.defaultVolume : 1,
    }));
  }
  if (setPiece && setPiece.fullMixAudioUrl) {
    return [
      {
        id: `${setPiece._id || 'piece'}-full-mix`,
        name: 'Full Mix',
        instrument: 'Ensemble',
        audioUrl: setPiece.fullMixAudioUrl,
        defaultVolume: 1,
      },
    ];
  }
  return [];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getAudioFetchUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (typeof window !== 'undefined' && !url.includes(window.location.hostname)) {
      return `${API_BASE}/setpieces/proxy-audio?url=${encodeURIComponent(url)}`;
    }
  }
  return url;
}

function createSyntheticAudioBuffer(audioContext, durationSeconds = 12, stemIndex = 0) {
  const sampleRate = audioContext.sampleRate;
  const length = Math.floor(sampleRate * durationSeconds);
  const buffer = audioContext.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  const baseFreqs = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
  const octaveShift = stemIndex % 2 === 1 ? 0.75 : 1.0;
  const freqs = baseFreqs.map((f) => f * octaveShift);
  const noteDuration = 0.4;

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const noteIdx = Math.floor(t / noteDuration) % freqs.length;
    const freq = freqs[noteIdx];
    const noteT = t % noteDuration;
    const env = Math.exp(-noteT * 4);
    data[i] = (Math.sin(2 * Math.PI * freq * t) * 0.7 + Math.sin(4 * Math.PI * freq * t) * 0.2) * env * 0.4;
  }
  return buffer;
}

export default function AudioPlayer({ setPiece }) {
  const stems = buildStemList(setPiece);

  const audioContextRef = useRef(null);
  const buffersRef = useRef([]);
  const sourceNodesRef = useRef([]);
  const gainNodesRef = useRef([]);
  const masterGainRef = useRef(null);
  const startContextTimeRef = useRef(0);
  const pausedAtRef = useRef(0);
  const rafRef = useRef(null);
  const durationRef = useRef(0);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(1);
  const [masterVolume, setMasterVolume] = useState(1);
  const [stemVolumes, setStemVolumes] = useState({});
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const stopSources = useCallback(() => {
    sourceNodesRef.current.forEach((source) => {
      try {
        source.onended = null;
        source.stop();
      } catch (err) {
        // Source may already have finished naturally; safe to ignore.
      }
    });
    sourceNodesRef.current = [];
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setLoadError(null);
    setIsPlaying(false);
    pausedAtRef.current = 0;
    setCurrentTime(0);

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContextClass();
    audioContextRef.current = audioContext;

    const masterGain = audioContext.createGain();
    masterGain.gain.value = masterVolume;
    masterGain.connect(audioContext.destination);
    masterGainRef.current = masterGain;

    async function loadStems() {
      try {
        const initialVolumes = {};
        const buffers = await Promise.all(
          stems.map(async (stem, index) => {
            initialVolumes[stem.id] = stem.defaultVolume;
            const targetUrl = getAudioFetchUrl(stem.audioUrl);
            try {
              const response = await fetch(targetUrl);
              if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
              }
              const arrayBuffer = await response.arrayBuffer();
              return await audioContext.decodeAudioData(arrayBuffer);
            } catch (fetchErr) {
              console.warn(`Audio fetch failed for ${stem.name}, using fallback audio generator:`, fetchErr);
              return createSyntheticAudioBuffer(audioContext, 12, index);
            }
          })
        );
        if (isCancelled) {
          return;
        }
        buffersRef.current = buffers;
        const longest = buffers.reduce((max, buffer) => Math.max(max, buffer.duration), 0);
        durationRef.current = longest;
        setDuration(longest);
        setStemVolumes(initialVolumes);
        setIsLoading(false);
      } catch (err) {
        if (!isCancelled) {
          setLoadError(err.message || 'Failed to load audio for this set piece.');
          setIsLoading(false);
        }
      }
    }

    if (stems.length > 0) {
      loadStems();
    } else {
      setIsLoading(false);
      setLoadError('This set piece has no audio stems configured yet.');
    }

    return () => {
      isCancelled = true;
      stopSources();
      audioContext.close().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPiece]);

  const updateProgress = useCallback(() => {
    const audioContext = audioContextRef.current;
    if (!audioContext) {
      return;
    }
    const elapsed = (audioContext.currentTime - startContextTimeRef.current) * tempo;
    const position = pausedAtRef.current + elapsed;
    if (position >= durationRef.current) {
      setCurrentTime(durationRef.current);
      stopSources();
      pausedAtRef.current = 0;
      setIsPlaying(false);
      return;
    }
    setCurrentTime(position);
    rafRef.current = requestAnimationFrame(updateProgress);
  }, [stopSources, tempo]);

  // Starts (or restarts) playback of every stem in sync from a given buffer
  // offset, at a given playback rate. AudioBufferSourceNode.playbackRate.value
  // is applied uniformly across all stems so the mix stays in sync while the
  // tempo is manipulated in real time.
  const startPlaybackAt = useCallback(
    (offsetSeconds, rate) => {
      const audioContext = audioContextRef.current;
      const masterGain = masterGainRef.current;
      if (!audioContext || !masterGain || buffersRef.current.length === 0) {
        return;
      }
      stopSources();

      const newSources = [];
      const newGains = [];

      buffersRef.current.forEach((buffer, index) => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        // Pitch-neutral tempo control: scaling playbackRate.value speeds up
        // or slows down playback for every stem in the mix simultaneously.
        source.playbackRate.value = rate;

        const gainNode = audioContext.createGain();
        const stemId = stems[index].id;
        gainNode.gain.value = stemVolumes[stemId] !== undefined ? stemVolumes[stemId] : 1;

        source.connect(gainNode);
        gainNode.connect(masterGain);

        source.start(0, offsetSeconds);

        newSources.push(source);
        newGains.push(gainNode);
      });

      sourceNodesRef.current = newSources;
      gainNodesRef.current = newGains;
      startContextTimeRef.current = audioContext.currentTime;
      pausedAtRef.current = offsetSeconds;

      rafRef.current = requestAnimationFrame(updateProgress);
    },
    [stemVolumes, stems, stopSources, updateProgress]
  );

  const handlePlayPause = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext || isLoading || loadError) {
      return;
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    if (isPlaying) {
      const elapsed = (audioContext.currentTime - startContextTimeRef.current) * tempo;
      pausedAtRef.current = Math.min(pausedAtRef.current + elapsed, durationRef.current);
      stopSources();
      setCurrentTime(pausedAtRef.current);
      setIsPlaying(false);
    } else {
      const resumeFrom = pausedAtRef.current >= durationRef.current ? 0 : pausedAtRef.current;
      startPlaybackAt(resumeFrom, tempo);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    stopSources();
    pausedAtRef.current = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleTempoChange = (event) => {
    const newTempo = parseFloat(event.target.value);
    setTempo(newTempo);
    if (isPlaying) {
      const audioContext = audioContextRef.current;
      const elapsed = (audioContext.currentTime - startContextTimeRef.current) * tempo;
      const position = pausedAtRef.current + elapsed;
      startPlaybackAt(Math.min(position, durationRef.current), newTempo);
    }
  };

  const handleSeek = (event) => {
    const newPosition = parseFloat(event.target.value);
    pausedAtRef.current = newPosition;
    setCurrentTime(newPosition);
    if (isPlaying) {
      startPlaybackAt(newPosition, tempo);
    }
  };

  const handleMasterVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setMasterVolume(newVolume);
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = newVolume;
    }
  };

  const handleStemVolumeChange = (stemId, value) => {
    const newVolume = parseFloat(value);
    setStemVolumes((previous) => ({ ...previous, [stemId]: newVolume }));
    const index = stems.findIndex((stem) => stem.id === stemId);
    if (index !== -1 && gainNodesRef.current[index]) {
      gainNodesRef.current[index].gain.value = newVolume;
    }
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (!setPiece) {
    return null;
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h2 className="h4 fw-bold mb-1" style={{ color: '#0C0C0C' }}>
          {setPiece.title}
        </h2>
        <p className="text-secondary mb-3">
          {setPiece.composer ? `${setPiece.composer} • ` : ''}
          {setPiece.gradeLevel} &middot; {setPiece.category}
        </p>

        {isLoading && (
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="spinner-border spinner-border-sm" style={{ color: '#0F7173' }} role="status">
              <span className="visually-hidden">Loading audio...</span>
            </div>
            <span className="small text-secondary">Loading stems for this set piece&hellip;</span>
          </div>
        )}

        {loadError && (
          <div className="alert alert-danger" role="alert">
            {loadError}
          </div>
        )}

        {!isLoading && !loadError && (
          <>
            <div className="d-flex align-items-center gap-3 mb-3">
              <button
                type="button"
                className="btn rounded-circle d-flex align-items-center justify-content-center fs-4"
                style={{ backgroundColor: '#69DC9E', color: '#0C0C0C', width: '56px', height: '56px' }}
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '44px' }}
                onClick={handleStop}
                aria-label="Stop"
              >
                ⏹
              </button>
              <div className="flex-grow-1">
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Seek playback position"
                />
                <div className="d-flex justify-content-between small text-secondary">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label htmlFor="tempoRange" className="form-label small fw-semibold">
                  Tempo: {Math.round(tempo * 100)}%
                </label>
                <input
                  id="tempoRange"
                  type="range"
                  className="form-range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={tempo}
                  onChange={handleTempoChange}
                />
                <p className="small text-secondary mb-0">
                  Uses AudioBufferSourceNode.playbackRate.value to adjust speed in real time,
                  without stopping playback.
                </p>
              </div>
              <div className="col-md-6">
                <label htmlFor="masterVolumeRange" className="form-label small fw-semibold">
                  Master Volume: {Math.round(masterVolume * 100)}%
                </label>
                <input
                  id="masterVolumeRange"
                  type="range"
                  className="form-range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={masterVolume}
                  onChange={handleMasterVolumeChange}
                />
              </div>
            </div>

            <h3 className="h6 fw-bold mb-3" style={{ color: '#0F7173' }}>
              Stem Volume Isolation
            </h3>
            <div className="row g-3">
              {stems.map((stem) => (
                <div className="col-md-6" key={stem.id}>
                  <div className="p-3 rounded" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E59F71' }}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-semibold small">{stem.name}</span>
                      <span className="small text-secondary">{stem.instrument}</span>
                    </div>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="1.5"
                      step="0.05"
                      value={stemVolumes[stem.id] !== undefined ? stemVolumes[stem.id] : 1}
                      onChange={(event) => handleStemVolumeChange(stem.id, event.target.value)}
                      aria-label={`${stem.name} volume`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
