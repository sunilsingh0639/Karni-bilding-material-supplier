import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { videos } from '../data/videos';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import './Videos.css';

export default function Videos() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  useScrollRevealAll();

  return (
    <main className="page-content">
      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Videos</span>
            <h1>Our Videos</h1>
            <p>Watch our business videos to learn more about our materials and services.</p>
          </div>

          <div className="videos-grid">
            {videos.map((v, i) => (
              <div key={v.id} className={`video-card card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="video-card__thumb" onClick={() => setActiveVideo(v.videoId)}>
                  <img src={v.thumbnail} alt={v.title} loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/480x270/1a1a1a/888?text=Video'; }} />
                  <div className="video-card__play">
                    <Play size={28} fill="white" color="white" />
                  </div>
                </div>
                <div className="video-card__body">
                  <h3>{v.title}</h3>
                  <p>{v.description}</p>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveVideo(v.videoId)}>
                    <Play size={14} /> Watch Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {activeVideo && (
        <div className="video-modal" onClick={() => setActiveVideo(null)}>
          <button className="lightbox__close" onClick={() => setActiveVideo(null)}><X size={24} /></button>
          <div className="video-modal__content" onClick={e => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
              title="Video player" allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )}
    </main>
  );
}
