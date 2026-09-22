import { useState, useEffect } from 'react';
import MusicPlayer from '../components/MusicPlayer';
import { ghasiBhojpuri } from '../data/musicTracks';
import type { MusicTrack } from '../data/musicTracks';
import { getPlaylists, getTracksByPlaylist } from '../services/musicService';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import './MusicPage.css';

export default function GhasiBhojpuri() {
  const [tracks, setTracks] = useState<MusicTrack[]>(ghasiBhojpuri);
  useScrollRevealAll();

  useEffect(() => {
    async function load() {
      try {
        const playlists = await getPlaylists();
        const pl = playlists.find(p => p.name.toLowerCase().includes('ghasi') || p.name.toLowerCase().includes('bhojpuri'));
        if (pl) {
          const dbTracks = await getTracksByPlaylist(pl.id);
          if (dbTracks.length > 0) {
            setTracks(dbTracks.map(t => ({
              id: t.id, title: t.title, artist: t.channel_name,
              videoId: t.youtube_video_id, thumbnail: t.thumbnail_url, duration: t.duration,
            })));
          }
        }
      } catch {/* use static fallback */}
    }
    load();
  }, []);

  return (
    <main className="page-content">
      <section className="section">
        <div className="container">
          <div className="music-page-header reveal">
            <div className="music-page-header__icon">🎵</div>
            <div>
              <span className="section-label">Bhojpuri Music</span>
              <h1>Ghasi Bhojpuri</h1>
              <p>Enjoy Bhojpuri music powered by YouTube. Search songs, build your playlist and play.</p>
            </div>
          </div>
          <div className="reveal">
            <MusicPlayer tracks={tracks} title="Ghasi Bhojpuri" />
          </div>
        </div>
      </section>
    </main>
  );
}
