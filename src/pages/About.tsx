import { Link } from 'react-router-dom';
import { Phone, MessageCircle, CheckCircle, Users, Package, Truck } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import './About.css';

const values = [
  { icon: CheckCircle, title: 'Quality First', desc: 'We source only premium quality Rodi, Bajri and building materials.' },
  { icon: Truck, title: 'Reliable Delivery', desc: 'Timely truck delivery of materials directly to your construction site.' },
  { icon: Users, title: 'Customer Focus', desc: 'Your satisfaction is our priority. We support every project need.' },
  { icon: Package, title: 'Wide Range', desc: 'Rodi, Bajri, Sand, Stone and all construction materials available.' },
];

export default function About() {
  useScrollRevealAll();
  const settings = useSiteSettings();
  const waMsg = encodeURIComponent(`Hello ${settings.owner_name}, I want to enquire about building materials/Rodi/Bajri. Please share price and availability.`);
  const waUrl = `https://wa.me/91${settings.whatsapp}?text=${waMsg}`;

  return (
    <main className="page-content">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero__content reveal">
            <span className="section-label">About Us</span>
            <h1>{settings.business_name}</h1>
            <p>Your trusted partner for premium quality Rodi, Bajri and building materials in Churu, Rajasthan. We are committed to quality, reliability and customer satisfaction.</p>
            <div className="about-hero__actions">
              <Link to="/enquiry" className="btn btn-accent btn-lg">Get Quote</Link>
              <a href={`tel:${settings.phone}`} className="btn btn-outline btn-lg"><Phone size={16} /> {settings.phone}</a>
            </div>
          </div>
          <div className="about-hero__img reveal reveal-delay-2">
            <img src="https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80" alt="Truck delivering building materials" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Meet Owner */}
      <section className="section">
        <div className="container">
          <div className="ganveer-section reveal">
            <div className="ganveer-photo">
              <img
                src="/assets/images/ganveer-singh.jpg"
                alt={`${settings.owner_name} - ${settings.business_name}`}
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(settings.owner_name)}&size=400&background=1a1a1a&color=fff&bold=true`;
                }}
                loading="lazy"
              />
            </div>
            <div className="ganveer-info reveal reveal-delay-2">
              <span className="section-label">Meet the Owner</span>
              <h2>{settings.owner_name}</h2>
              <p className="ganveer-tagline">{settings.business_name}</p>
              <p>{settings.about_text}</p>
              <div className="ganveer-contact">
                <a href={`tel:${settings.phone}`} className="btn btn-accent"><Phone size={16} /> {settings.phone}</a>
                <a href={waUrl} className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="about-story reveal">
            <span className="section-label">Our Story</span>
            <h2>Building Trust, One Delivery at a Time</h2>
            <p>Karni Building Material Supplier was established with a simple mission: to provide high-quality Rodi, Bajri and construction materials to builders, contractors and homeowners across Churu, Rajasthan at fair prices with reliable service.</p>
            <p>We understand that construction projects depend on timely material supply. That's why we maintain a well-stocked yard and ensure prompt truck delivery to keep your project on schedule.</p>
            <p>Based in {settings.address} — we serve the entire surrounding region with bulk and retail supply of all construction materials.</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Our Values</span>
            <h2>Why Choose Us</h2>
          </div>
          <div className="grid-4">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`value-card card reveal reveal-delay-${i + 1}`}>
                <div className="value-card__icon"><Icon size={24} /></div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div className="container">
          <div className="about-cta reveal">
            <h2 style={{ color: '#fff' }}>Ready to Order Materials?</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Contact {settings.owner_name} today for Rodi, Bajri and all building material requirements.</p>
            <div className="about-cta__actions">
              <a href={`tel:${settings.phone}`} className="btn btn-accent btn-lg"><Phone size={18} /> Call Now</a>
              <a href={waUrl} className="btn btn-whatsapp btn-lg" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
