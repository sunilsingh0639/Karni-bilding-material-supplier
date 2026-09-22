import { useState, useEffect } from 'react';
import MusicPlayer from '../components/MusicPlayer';
import { trackDriverMusic } from '../data/musicTracks';
import type { MusicTrack } from '../data/musicTracks';
import { getPlaylists, getTracksByPlaylist } from '../services/musicService';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import './MusicPage.css';

export default function TrackDriverMusic() {
  const [tracks, setTracks] = useState<MusicTrack[]>(trackDriverMusic);
  useScrollRevealAll();

  useEffect(() => {
    async function load() {
      try {
        const playlists = await getPlaylists();
        const pl = playlists.find(p => p.name.toLowerCase().includes('track driver') || p.name.toLowerCase().includes('driver'));
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
            <div className="music-page-header__icon">🚛</div>
            <div>
              <span className="section-label">Driver Music</span>
              <h1>Track Driver Music</h1>
              <p>Music for the road. Search, play and enjoy your favourite tracks while driving.</p>
            </div>
          </div>
          <div className="reveal">
            <MusicPlayer tracks={tracks} title="Track Driver Playlist" />
          </div>
        </div>
      </section>
    </main>
  );
}
