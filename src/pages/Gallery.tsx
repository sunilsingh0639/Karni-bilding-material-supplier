import { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { galleryImages, galleryCategories } from '../data/gallery';
import { getGalleryImages } from '../services/mediaService';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import './Gallery.css';

interface DisplayImage { id: string; src: string; alt: string; category: string; }

export default function Gallery() {
  const [cat, setCat] = useState('All');
  const [lightbox, setLightbox] = useState<DisplayImage | null>(null);
  const [images, setImages] = useState<DisplayImage[]>(galleryImages.map(g => ({ id: g.id, src: g.src, alt: g.alt, category: g.category })));
  const [categories, setCategories] = useState<string[]>(galleryCategories);
  useScrollRevealAll();

  useEffect(() => {
    getGalleryImages().then(data => {
      if (data.length > 0) {
        const mapped: DisplayImage[] = data.map(m => ({ id: m.id, src: m.public_url, alt: m.title, category: m.category }));
        setImages(mapped);
        const cats = ['All', ...Array.from(new Set(data.map(m => m.category)))];
        setCategories(cats);
      }
    }).catch(() => {/* use static fallback */});
  }, []);

  const filtered = cat === 'All' ? images : images.filter(g => g.category === cat);
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
            {categories.map(c => (
              <button key={c} className={`filter-btn${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>

          <div className="gallery-grid">
            {filtered.map((img, i) => (
              <button key={img.id} className={`gallery-item reveal reveal-delay-${(i % 4) + 1}`} onClick={() => setLightbox(img)}>
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="gallery-item__overlay"><span>{img.alt}</span></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox__close" onClick={closeLightbox} aria-label="Close"><X size={24} /></button>
          <div className="lightbox__content" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.alt} />
            <p>{lightbox.alt}</p>
          </div>
        </div>
      )}
    </main>
  );
}
