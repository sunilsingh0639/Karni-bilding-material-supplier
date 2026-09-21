import MusicPlayer from '../components/MusicPlayer';
import { trackDriverMusic } from '../data/musicTracks';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import './MusicPage.css';

export default function TrackDriverMusic() {
  useScrollRevealAll();
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
            <MusicPlayer tracks={trackDriverMusic} title="Track Driver Playlist" />
          </div>
          <div className="music-page-note reveal">
            <strong>To update songs:</strong> Edit <code>src/data/musicTracks.ts</code> and replace the <code>videoId</code> values with real YouTube video IDs.
            To enable search, add <code>VITE_YOUTUBE_API_KEY=your_key</code> to your <code>.env</code> file.
          </div>
        </div>
      </section>
    </main>
  );
}
