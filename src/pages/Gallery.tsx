import { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { galleryImages, galleryCategories } from '../data/gallery';
import type { GalleryImage } from '../data/gallery';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import './Gallery.css';

export default function Gallery() {
  const [cat, setCat] = useState('All');
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  useScrollRevealAll();

  const filtered = cat === 'All' ? galleryImages : galleryImages.filter(g => g.category === cat);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <main className="page-content">
      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Gallery</span>
            <h1>Our Gallery</h1>
            <p>A visual showcase of our materials, delivery and construction work.</p>
          </div>

          <div className="products-filter reveal">
            {galleryCategories.map(c => (
              <button key={c} className={`filter-btn${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>

          <div className="gallery-grid">
            {filtered.map((img, i) => (
              <button key={img.id} className={`gallery-item reveal reveal-delay-${(i % 4) + 1}`} onClick={() => setLightbox(img)}>
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="gallery-item__overlay">
                  <span>{img.alt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox__close" onClick={closeLightbox} aria-label="Close"><X size={24} /></button>
          <div className="lightbox__content" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src.replace('w=800', 'w=1200')} alt={lightbox.alt} />
            <p>{lightbox.alt}</p>
          </div>
        </div>
      )}
    </main>
  );
}
