import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ImageSlider.css';

// Replace src values with actual business photos.
// Add photos to /public/assets/images/ and update paths like: '/assets/images/rodi-truck.jpg'
export const sliderSlides = [
  {
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1400&q=85',
    alt: 'Truck loaded with Rodi material ready for delivery',
    label: 'Fast Delivery',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1400&q=85',
    alt: 'Large pile of Rodi stone aggregate at yard',
    label: 'Premium Rodi',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85',
    alt: 'Quality Bajri fine aggregate supply',
    label: 'Quality Bajri',
  },
  {
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1400&q=85',
    alt: 'Truck unloading material at construction site',
    label: 'Site Delivery',
  },
  {
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1400&q=85',
    alt: 'Construction material supply Rajasthan',
    label: 'Bulk Supply',
  },
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const next = useCallback(() => setCurrent(c => (c + 1) % sliderSlides.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + sliderSlides.length) % sliderSlides.length), []);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000) as unknown as ReturnType<typeof setInterval>;
  }, [next]);

  useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, [resetTimer]);

  const handleTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; setDragging(true); };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragging) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetTimer(); }
    setDragging(false);
  };

  return (
    <div className="slider" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} aria-label="Image slider">
      <div className="slider__track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {sliderSlides.map((s, i) => (
          <div key={i} className="slider__slide">
            <img src={s.image} alt={s.alt} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="slider__overlay" />
          </div>
        ))}
      </div>

      <button className="slider__btn slider__btn--prev" onClick={() => { prev(); resetTimer(); }} aria-label="Previous slide">
        <ChevronLeft size={20} />
      </button>
      <button className="slider__btn slider__btn--next" onClick={() => { next(); resetTimer(); }} aria-label="Next slide">
        <ChevronRight size={20} />
      </button>

      <div className="slider__dots">
        {sliderSlides.map((s, i) => (
          <button key={i} className={`slider__dot${i === current ? ' active' : ''}`}
            onClick={() => { setCurrent(i); resetTimer(); }} aria-label={`Go to slide ${i + 1}`}>
            <span className="slider__dot-label">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
