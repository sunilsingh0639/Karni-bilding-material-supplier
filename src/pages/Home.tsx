import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Star, CheckCircle, Truck, Shield, Clock, Mail } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import EnquiryModal from '../components/EnquiryModal';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { getActiveProducts } from '../services/productService';
import { products as staticProducts } from '../data/products';
import { business } from '../data/business';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import './Home.css';

const reviews = [
  { name: 'Ramesh Kumar', location: 'Churu', rating: 5, text: 'Excellent quality Rodi and timely delivery. Very satisfied with Ganveer bhai\'s service.' },
  { name: 'Suresh Sharma', location: 'Rajgarh', rating: 5, text: 'Best Bajri supplier in the area. Competitive prices and good quality material.' },
  { name: 'Mahesh Patel', location: 'Sardarshahar', rating: 4, text: 'Reliable supply and good customer support. Will definitely order again.' },
  { name: 'Dinesh Verma', location: 'Taranagar', rating: 5, text: 'Quality Rodi and professional service. Highly recommended for bulk orders.' },
];

const features = [
  { icon: CheckCircle, title: 'Premium Quality', desc: 'Carefully sourced Rodi, Bajri and construction materials.' },
  { icon: Truck, title: 'Truck Delivery', desc: 'Direct truck delivery to your construction site on schedule.' },
  { icon: Shield, title: 'Trusted Supplier', desc: 'Serving Churu district with integrity and trust.' },
  { icon: Clock, title: 'Quick Response', desc: 'Fast enquiry response and same-day order processing.' },
];

interface DisplayProduct {
  id: string; name: string; category: string; description: string;
  image: string; available: boolean; unit: string;
}

function toDisplay(p: { id: string; name: string; category: string; description: string; image_url?: string; image?: string; is_active?: boolean; available?: boolean; unit: string; }): DisplayProduct {
  return {
    id: p.id, name: p.name, category: p.category, description: p.description,
    image: p.image_url ?? (p as { image?: string }).image ?? '',
    available: p.is_active ?? (p as { available?: boolean }).available ?? true,
    unit: p.unit,
  };
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultProduct, setDefaultProduct] = useState('');
  const [products, setProducts] = useState<DisplayProduct[]>(staticProducts.map(toDisplay));
  const settings = useSiteSettings();
  useScrollRevealAll();

  useEffect(() => {
    getActiveProducts().then(data => {
      if (data.length > 0) setProducts(data.map(toDisplay));
    }).catch(() => {/* keep static fallback */});
  }, []);

  const openEnquiry = (product = '') => { setDefaultProduct(product); setModalOpen(true); };
  const waMsg = encodeURIComponent(`Hello ${settings.owner_name}, I want to enquire about building materials/Rodi/Bajri. Please share price and availability.`);
  const waUrl = `https://wa.me/91${settings.whatsapp}?text=${waMsg}`;

  return (
    <main className="page-content">
      <Hero onEnquire={() => openEnquiry()} />

      {/* Features */}
      <section className="section-sm features-section">
        <div className="container">
          <div className="features-grid">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`feature-card reveal reveal-delay-${i + 1}`}>
                <div className="feature-card__icon"><Icon size={22} /></div>
                <div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section" id="products">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Our Products</span>
            <h2>Quality Building Materials</h2>
            <p>Rodi, Bajri, Sand, Stone and all construction materials — sourced and supplied with care.</p>
          </div>
          <div className="grid-4 products-grid">
            {products.slice(0, 8).map((p, i) => (
              <div key={p.id} className={`reveal reveal-delay-${(i % 4) + 1}`}>
                <ProductCard product={p} onEnquire={openEnquiry} />
              </div>
            ))}
          </div>
          <div className="section-cta reveal">
            <Link to="/products" className="btn btn-primary btn-lg">View All Products</Link>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="section about-snippet">
        <div className="container">
          <div className="about-snippet__grid">
            <div className="about-snippet__img reveal">
              <img src="https://images.unsplash.com/photo-1590736969955-71cc94901144?w=700&q=80" alt="Truck delivering Rodi Bajri material" loading="lazy" />
            </div>
            <div className="about-snippet__content reveal reveal-delay-2">
              <span className="section-label">About Us</span>
              <h2>Your Trusted Rodi & Bajri Supplier</h2>
              <p>{settings.about_text}</p>
              <div className="about-snippet__actions">
                <Link to="/about" className="btn btn-primary">Learn More</Link>
                <a href={`tel:${settings.phone}`} className="btn btn-outline"><Phone size={16} /> {settings.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section reviews-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Customer Reviews</span>
            <h2>What Our Customers Say</h2>
            <p>Sample reviews — replace with real customer testimonials.</p>
          </div>
          <div className="reviews-scroll">
            {reviews.map((r, i) => (
              <div key={i} className={`review-card card reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="review-card__stars">
                  {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={14} fill="var(--accent)" color="var(--accent)" />)}
                </div>
                <p className="review-card__text">"{r.text}"</p>
                <div className="review-card__author">
                  <span className="review-card__name">{r.name}</span>
                  <span className="review-card__loc"><MapPin size={12} /> {r.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-banner__inner reveal">
            <div>
              <h2>Need Rodi, Bajri or Building Materials?</h2>
              <p>Contact {settings.owner_name} for quick pricing and delivery to your site.</p>
            </div>
            <div className="cta-banner__actions">
              <a href={`tel:${settings.phone}`} className="btn btn-accent btn-lg"><Phone size={18} /> Call Now</a>
              <a href={waUrl} className="btn btn-whatsapp btn-lg" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section contact-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Contact Us</span>
            <h2>Get In Touch</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-info reveal">
              <div className="contact-item">
                <div className="contact-item__icon"><MapPin size={20} /></div>
                <div><strong>{settings.owner_name}</strong><p>{settings.address}</p></div>
              </div>
              <div className="contact-item">
                <div className="contact-item__icon"><Phone size={20} /></div>
                <div><strong>Phone / WhatsApp</strong><p><a href={`tel:${settings.phone}`}>{settings.phone}</a></p></div>
              </div>
              <div className="contact-item">
                <div className="contact-item__icon"><Mail size={20} /></div>
                <div><strong>Email</strong><p><a href={`mailto:${settings.email}`}>{settings.email}</a></p></div>
              </div>
              <div className="contact-item">
                <div className="contact-item__icon"><Clock size={20} /></div>
                <div><strong>Business Hours</strong><p>{business.hours}</p></div>
              </div>
              <div className="contact-actions">
                <a href={`tel:${settings.phone}`} className="btn btn-call"><Phone size={16} /> Call Now</a>
                <a href={waUrl} className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WhatsApp</a>
                <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline"><MapPin size={16} /> Directions</a>
              </div>
            </div>
            <div className="contact-map reveal reveal-delay-2">
              <iframe
                src="https://maps.google.com/maps?q=Parsneu+Churu+Rajasthan+331802&output=embed"
                title="Karni Building Material Supplier location" loading="lazy" allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: 'var(--radius-lg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} defaultProduct={defaultProduct} />
    </main>
  );
}
