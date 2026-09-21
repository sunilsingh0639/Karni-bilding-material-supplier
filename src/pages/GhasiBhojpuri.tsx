import MusicPlayer from '../components/MusicPlayer';
import { ghasiBhojpuri } from '../data/musicTracks';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import './MusicPage.css';

export default function GhasiBhojpuri() {
  useScrollRevealAll();
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
            <MusicPlayer tracks={ghasiBhojpuri} title="Ghasi Bhojpuri"/>
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
