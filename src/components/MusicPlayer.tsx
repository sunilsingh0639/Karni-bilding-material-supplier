import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Music2,
  Volume2, VolumeX, Search, X, ListMusic,
  ChevronUp, ChevronDown, AlertCircle, Plus,
} from 'lucide-react';
import type { MusicTrack } from '../data/musicTracks';
import './MusicPlayer.css';

/* ── YouTube IFrame API types ── */
declare global {
  interface Window {
    YT: {
      Player: new (el: HTMLElement | string, opts: YTPlayerOptions) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; BUFFERING: number; CUED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}
interface YTPlayerOptions {
  height: string; width: string; videoId: string;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: () => void;
    onStateChange?: (e: { data: number }) => void;
    onError?: (e: { data: number }) => void;
  };
}
interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(id: string): void;
  cueVideoById(id: string): void;
  seekTo(t: number, allowSeekAhead: boolean): void;
  getPlayerState(): number;
  getCurrentTime(): number;
  getDuration(): number;
  setVolume(v: number): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
}

interface SearchResult {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
}

interface Props {
  tracks: MusicTrack[];
  title: string;
}

/* ── Singleton YT API loader ── */
let ytApiLoaded = false;
let ytApiLoading = false;
const ytCallbacks: (() => void)[] = [];

function loadYTApi(cb: () => void) {
  if (ytApiLoaded) { cb(); return; }
  ytCallbacks.push(cb);
  if (ytApiLoading) return;
  ytApiLoading = true;
  window.onYouTubeIframeAPIReady = () => {
    ytApiLoaded = true;
    ytCallbacks.splice(0).forEach(fn => fn());
  };
  const s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);
}

const fmt = (s: number) => {
  if (!s || isNaN(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
};

export default function MusicPlayer({ tracks, title }: Props) {
  const [queue, setQueue] = useState<MusicTrack[]>(tracks);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [miniOpen, setMiniOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const playerRef = useRef<YTPlayer | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Use refs for values needed inside stable callbacks
  const queueRef = useRef(queue);
  const currentIdxRef = useRef(currentIdx);
  const currentTimeRef = useRef(currentTime);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { currentIdxRef.current = currentIdx; }, [currentIdx]);
  useEffect(() => { currentTimeRef.current = currentTime; }, [currentTime]);

  const stopTick = () => clearInterval(tickRef.current);
  const startTick = () => {
    stopTick();
    tickRef.current = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      const t = p.getCurrentTime();
      const d = p.getDuration();
      setCurrentTime(t);
      setDuration(d);
      setProgress(d > 0 ? (t / d) * 100 : 0);
    }, 500) as unknown as ReturnType<typeof setInterval>;
  };

  // Stable next/prev using refs
  const goNext = useCallback(() => {
    const q = queueRef.current;
    const next = (currentIdxRef.current + 1) % q.length;
    setCurrentIdx(next);
    setProgress(0); setCurrentTime(0); setDuration(0); setPlayerError(null);
    playerRef.current?.loadVideoById(q[next].videoId);
  }, []);

  const goPrev = useCallback(() => {
    const q = queueRef.current;
    if (currentTimeRef.current > 3) {
      playerRef.current?.loadVideoById(q[currentIdxRef.current].videoId);
      return;
    }
    const prev = (currentIdxRef.current - 1 + q.length) % q.length;
    setCurrentIdx(prev);
    setProgress(0); setCurrentTime(0); setDuration(0); setPlayerError(null);
    playerRef.current?.loadVideoById(q[prev].videoId);
  }, []);

  // Init YouTube player once
  useEffect(() => {
    loadYTApi(() => {
      if (!mountRef.current) return;
      const div = document.createElement('div');
      mountRef.current.appendChild(div);

      playerRef.current = new window.YT.Player(div, {
        height: '1', width: '1',
        videoId: tracks[0]?.videoId ?? '',
        playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: () => {
            setPlayerReady(true);
            playerRef.current?.setVolume(80);
          },
          onStateChange: (e) => {
            const S = window.YT.PlayerState;
            if (e.data === S.PLAYING) {
              setPlaying(true);
              setPlayerError(null);
              setDuration(playerRef.current?.getDuration() ?? 0);
              startTick();
            } else if (e.data === S.PAUSED) {
              setPlaying(false);
              stopTick();
            } else if (e.data === S.ENDED) {
              setPlaying(false);
              stopTick();
              goNext();
            }
          },
          onError: (e) => {
            stopTick();
            setPlaying(false);
            const msgs: Record<number, string> = {
              2: 'Invalid video ID.',
              5: 'This video cannot play in embedded players.',
              100: 'This video is unavailable or removed.',
              101: 'The owner does not allow embedded playback.',
              150: 'The owner does not allow embedded playback.',
            };
            setPlayerError(msgs[e.data] ?? 'This song is currently unavailable. Please choose another.');
          },
        },
      });
    });
    return () => {
      stopTick();
      playerRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlay = () => {
    if (!playerReady || !playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const selectTrack = (idx: number) => {
    setCurrentIdx(idx);
    setProgress(0); setCurrentTime(0); setDuration(0); setPlayerError(null);
    if (!playerRef.current || !playerReady) return;
    playerRef.current.loadVideoById(queueRef.current[idx].videoId);
  };

  const removeFromQueue = (id: string) => {
    setQueue(q => {
      const idx = q.findIndex(t => t.id === id);
      if (idx < 0) return q;
      const newQ = q.filter(t => t.id !== id);
      if (newQ.length === 0) return q; // keep at least one
      if (idx < currentIdxRef.current) setCurrentIdx(i => Math.max(0, i - 1));
      else if (idx === currentIdxRef.current) {
        const nextIdx = Math.min(idx, newQ.length - 1);
        setCurrentIdx(nextIdx);
        playerRef.current?.loadVideoById(newQ[nextIdx].videoId);
      }
      return newQ;
    });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = Number(e.target.value);
    setProgress(pct);
    playerRef.current?.seekTo((pct / 100) * duration, true);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    playerRef.current?.setVolume(v);
    setMuted(v === 0);
  };

  const handleMute = () => {
    if (!playerRef.current) return;
    if (muted) { playerRef.current.unMute(); setMuted(false); }
    else { playerRef.current.mute(); setMuted(true); }
  };

  /* ── YouTube Search ── */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true); setSearchError(null); setSearchResults([]);
    try {
      // Use Netlify function in production; fallback to direct API in dev if key available
      const devKey = (import.meta.env.VITE_YOUTUBE_API_KEY as string) || '';
      const isNetlify = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      let results: SearchResult[] = [];

      if (isNetlify || !devKey) {
        const res = await fetch(`/.netlify/functions/youtube-search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? 'Search failed.');
        results = (data.results ?? []).map((item: { videoId: string; title: string; channel: string; thumbnail: string; duration?: string }) => ({
          videoId: item.videoId, title: item.title, channel: item.channel, thumbnail: item.thumbnail,
        }));
      } else {
        // Dev mode: call YouTube API directly
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&maxResults=12&key=${devKey}`;
        const res = await fetch(url);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error?.message ?? (res.status === 403 ? 'API quota exceeded or key invalid.' : 'Search failed.'));
        }
        const data = await res.json();
        results = (data.items ?? [])
          .filter((item: { id: { videoId?: string } }) => item.id?.videoId)
          .map((item: { id: { videoId: string }; snippet: { title: string; channelTitle: string; thumbnails: { medium?: { url: string }; default?: { url: string } } } }) => ({
            videoId: item.id.videoId, title: item.snippet.title, channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.medium?.url ?? item.snippet.thumbnails.default?.url ?? '',
          }));
      }

      if (results.length === 0) setSearchError('No music found. Try a different search.');
      else setSearchResults(results);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Search failed.';
      if (msg.includes('quota')) setSearchError('YouTube API quota exceeded. Please try again later.');
      else if (msg.includes('unavailable') || msg.includes('503') || msg.includes('network')) setSearchError('Music service is temporarily unavailable.');
      else setSearchError(msg);
    } finally {
      setSearching(false);
    }
  };

  const playFromSearch = (result: SearchResult) => {
    const track: MusicTrack = {
      id: `sr-${result.videoId}`,
      title: result.title,
      artist: result.channel,
      videoId: result.videoId,
      thumbnail: result.thumbnail,
    };
    setQueue(q => {
      const exists = q.findIndex(t => t.videoId === result.videoId);
      if (exists >= 0) {
        // already in queue — just play it
        setTimeout(() => selectTrack(exists), 0);
        return q;
      }
      const newQ = [...q, track];
      const newIdx = newQ.length - 1;
      setTimeout(() => {
        setCurrentIdx(newIdx);
        setProgress(0); setCurrentTime(0); setDuration(0); setPlayerError(null);
        playerRef.current?.loadVideoById(result.videoId);
      }, 0);
      return newQ;
    });
    setShowSearch(false);
  };

  const addToQueueFromSearch = (result: SearchResult) => {
    const track: MusicTrack = {
      id: `sr-${result.videoId}`,
      title: result.title,
      artist: result.channel,
      videoId: result.videoId,
      thumbnail: result.thumbnail,
    };
    setQueue(q => q.find(t => t.videoId === result.videoId) ? q : [...q, track]);
  };

  const current = queue[currentIdx] ?? queue[0];

  return (
    <div className="mp">
      {/* Hidden YT mount point */}
      <div ref={mountRef} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }} aria-hidden="true" />

      {/* ── Search Panel ── */}
      {showSearch && (
        <div className="mp-search-panel">
          <div className="mp-search-bar">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search Bhojpuri, Rajasthani, Hindi songs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSearchResults([]); setSearchError(null); }}>
                <X size={14} />
              </button>
            )}
            <button className="btn btn-accent btn-sm" onClick={handleSearch} disabled={searching}>
              {searching ? 'Searching…' : 'Search'}
            </button>
            <button className="mp-search-close" onClick={() => setShowSearch(false)}><X size={18} /></button>
          </div>


          {searchError && <div className="mp-error"><AlertCircle size={14} /> {searchError}</div>}

          {searchResults.length > 0 && (
            <div className="mp-search-results">
              {searchResults.map(r => (
                <div key={r.videoId} className="mp-search-result">
                  <img src={r.thumbnail} alt={r.title} loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x60/1a1a1a/888?text=♪'; }} />
                  <div className="mp-search-result__info">
                    <span className="mp-search-result__title" title={r.title}>{r.title}</span>
                    <span className="mp-search-result__channel">{r.channel}</span>
                  </div>
                  <div className="mp-search-result__actions">
                    <button className="mp-ctrl mp-ctrl--sm mp-ctrl--play" onClick={() => playFromSearch(r)} title="Play now">
                      <Play size={14} fill="currentColor" />
                    </button>
                    <button className="mp-ctrl mp-ctrl--sm" onClick={() => addToQueueFromSearch(r)} title="Add to queue">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Main Layout ── */}
      <div className="mp-layout">

        {/* Playlist */}
        {showPlaylist && (
          <div className="mp-playlist">
            <div className="mp-playlist__header">
              <Music2 size={16} />
              <span className="mp-playlist__title">{title}</span>
              <span className="mp-playlist__count">{queue.length}</span>
              <button className="mp-icon-btn" onClick={() => setShowSearch(s => !s)} title="Search songs">
                <Search size={15} />
              </button>
            </div>
            <div className="mp-playlist__list">
              {queue.map((t, i) => (
                <div key={t.id} className={`mp-track${i === currentIdx ? ' active' : ''}`}>
                  <button className="mp-track__main" onClick={() => selectTrack(i)}>
                    <div className="mp-track__num">
                      {i === currentIdx && playing
                        ? <span className="mp-track__eq"><span /><span /><span /></span>
                        : <span>{i + 1}</span>}
                    </div>
                    <img src={t.thumbnail} alt={t.title} className="mp-track__thumb" loading="lazy"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/52x40/1a1a1a/888?text=♪'; }} />
                    <div className="mp-track__info">
                      <span className="mp-track__title">{t.title}</span>
                      <span className="mp-track__artist">{t.artist}</span>
                    </div>
                    {t.duration && <span className="mp-track__dur">{t.duration}</span>}
                  </button>
                  <button className="mp-track__remove" onClick={() => removeFromQueue(t.id)} title="Remove from queue">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Player */}
        <div className="mp-main">
          {/* Now Playing Art */}
          <div className="mp-now-playing">
            <div className="mp-now-playing__art">
              <img src={current?.thumbnail} alt={current?.title}
                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/1a1a1a/888?text=♪'; }} />
              {playing && <div className="mp-now-playing__pulse" />}
            </div>
            <div className="mp-now-playing__info">
              <h3 className="mp-now-playing__title">{current?.title ?? 'Select a track'}</h3>
              <p className="mp-now-playing__artist">{current?.artist ?? ''}</p>
            </div>
          </div>

          {/* Error */}
          {playerError && (
            <div className="mp-error">
              <AlertCircle size={14} /> {playerError}
            </div>
          )}

          {/* Not ready hint */}
          {!playerReady && !playerError && (
            <p className="mp-loading">⏳ Loading player… Tap Play to start.</p>
          )}

          {/* Progress bar */}
          <div className="mp-progress">
            <span className="mp-time">{fmt(currentTime)}</span>
            <div className="mp-progress__track">
              <div className="mp-progress__fill" style={{ width: `${progress}%` }} />
              <input
                type="range" min={0} max={100} step={0.1}
                value={progress} onChange={handleSeek}
                className="mp-progress__bar" aria-label="Seek"
              />
            </div>
            <span className="mp-time">{fmt(duration)}</span>
          </div>

          {/* Controls */}
          <div className="mp-controls">
            <button className="mp-ctrl" onClick={goPrev} aria-label="Previous" disabled={!playerReady}>
              <SkipBack size={20} />
            </button>
            <button className="mp-ctrl mp-ctrl--play" onClick={handlePlay}
              aria-label={playing ? 'Pause' : 'Play'} disabled={!playerReady}>
              {playing ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
            </button>
            <button className="mp-ctrl" onClick={goNext} aria-label="Next" disabled={!playerReady}>
              <SkipForward size={20} />
            </button>
          </div>

          {/* Volume + actions */}
          <div className="mp-bottom-row">
            <div className="mp-volume">
              <button className="mp-ctrl mp-ctrl--sm" onClick={handleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
                {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input type="range" min={0} max={100} value={muted ? 0 : volume}
                onChange={handleVolume} className="mp-volume__bar" aria-label="Volume" />
              <span className="mp-vol-label">{muted ? 0 : volume}%</span>
            </div>
            <div className="mp-bottom-actions">
              <button className={`mp-ctrl mp-ctrl--sm${showSearch ? ' active' : ''}`}
                onClick={() => setShowSearch(s => !s)} title="Search music">
                <Search size={15} />
              </button>
              <button className={`mp-ctrl mp-ctrl--sm${showPlaylist ? ' active' : ''}`}
                onClick={() => setShowPlaylist(p => !p)} title="Toggle playlist">
                <ListMusic size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Mini Player (mobile) ── */}
      <div className={`mp-mini${miniOpen ? ' mp-mini--open' : ''}`}>
        <button className="mp-mini__expand" onClick={() => setMiniOpen(o => !o)} aria-label="Expand player">
          {miniOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
        <img src={current?.thumbnail} alt={current?.title} className="mp-mini__thumb"
          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/1a1a1a/888?text=♪'; }} />
        <div className="mp-mini__info">
          <span className="mp-mini__title">{current?.title ?? 'No track'}</span>
          <span className="mp-mini__artist">{current?.artist ?? ''}</span>
        </div>
        <div className="mp-mini__controls">
          <button className="mp-ctrl mp-ctrl--sm" onClick={goPrev} aria-label="Previous"><SkipBack size={16} /></button>
          <button className="mp-ctrl mp-ctrl--play mp-ctrl--sm" onClick={handlePlay} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button className="mp-ctrl mp-ctrl--sm" onClick={goNext} aria-label="Next"><SkipForward size={16} /></button>
        </div>
      </div>
    </div>
  );
}
