import { Phone, MessageCircle, ChevronDown, MapPin } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { business } from '../data/business';
import ImageSlider from './ImageSlider';
import './Hero.css';

interface HeroProps { onEnquire: () => void; }

export default function Hero({ onEnquire }: HeroProps) {
  const settings = useSiteSettings();
  const waMsg = encodeURIComponent(`Hello ${settings.owner_name}, I want to enquire about building materials/Rodi/Bajri. Please share price and availability.`);
  const waUrl = `https://wa.me/91${settings.whatsapp}?text=${waMsg}`;

  return (
    <section className="hero">
      <div className="hero__slider-wrap">
        <ImageSlider />
        <div className="hero__overlay-content">
          <div className="container">
            <div className="hero__text">
              <span className="hero__label">Rajasthan's Trusted Supplier</span>
              <h1 className="hero__title">{settings.hero_title.replace('\\n', '\n').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 ? <br /> : null}</span>
              ))}</h1>
              <p className="hero__sub">{settings.hero_subtitle}</p>
              <div className="hero__owner">
                <span className="hero__owner-name">{settings.owner_name}</span>
                <span className="hero__owner-loc"><MapPin size={12} /> {business.city}</span>
              </div>
              <div className="hero__actions">
                <a href={`tel:${settings.phone}`} className="btn btn-accent btn-lg">
                  <Phone size={18} /> Call Now
                </a>
                <a href={waUrl} className="btn btn-whatsapp btn-lg" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <button className="btn hero__outline-btn btn-lg" onClick={onEnquire}>
                  Send Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero__scroll-hint">
        <ChevronDown size={20} />
      </div>
    </section>
  );
}
