import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Clock, Mail } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { business } from '../data/business';
import './Footer.css';

export default function Footer() {
  const settings = useSiteSettings();
  const year = new Date().getFullYear();
  const waMsg = encodeURIComponent(`Hello ${settings.owner_name}, I want to enquire about building materials/Rodi/Bajri. Please share price and availability.`);
  const waUrl = `https://wa.me/91${settings.whatsapp}?text=${waMsg}`;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-icon">K</span>
              <div>
                <span className="footer__logo-name">{settings.business_name}</span>
                <span className="footer__logo-owner">{settings.owner_name}</span>
              </div>
            </div>
            <p className="footer__tagline">{settings.hero_subtitle}</p>
            <div className="footer__contact-chips">
              <a href={`tel:${settings.phone}`} className="footer__chip"><Phone size={14} /> {settings.phone}</a>
              <a href={waUrl} className="footer__chip footer__chip--wa" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Quick Links</h4>
            <ul>
              {[['/', 'Home'], ['/products', 'Products'], ['/about', 'About Us'], ['/gallery', 'Gallery'], ['/videos', 'Videos'], ['/enquiry', 'Enquiry']].map(([to, label]) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Music</h4>
            <ul>
              <li><Link to="/track-driver-music">Track Driver Music</Link></li>
              <li><Link to="/ghasi-bhojpuri">Ghasi Bhojpuri</Link></li>
            </ul>
            <h4 style={{ marginTop: 20 }}>Materials</h4>
            <ul>
              {['Rodi', 'Bajri', 'Sand', 'Stone', 'Bricks'].map(p => (
                <li key={p}><Link to="/products">{p}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Contact</h4>
            <ul className="footer__info">
              <li><MapPin size={14} /><span>{settings.address}</span></li>
              <li><Phone size={14} /><span><a href={`tel:${settings.phone}`}>{settings.phone}</a></span></li>
              <li><Mail size={14} /><span><a href={`mailto:${settings.email}`}>{settings.email}</a></span></li>
              <li><Clock size={14} /><span>{business.hours}</span></li>
            </ul>
            <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>
              <MapPin size={14} /> Get Directions
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>{settings.footer_text || `© ${year} ${settings.business_name} · ${settings.owner_name}`}</p>
          <p>Parsneu, Churu, Rajasthan</p>
        </div>
      </div>
    </footer>
  );
}
