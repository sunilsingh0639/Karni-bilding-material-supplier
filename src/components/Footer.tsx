import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { business } from '../data/business';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  const waUrl = `https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(business.whatsappMessage)}`;
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-icon">K</span>
              <div>
                <span className="footer__logo-name">{business.name}</span>
                <span className="footer__logo-owner">{business.owner}</span>
              </div>
            </div>
            <p className="footer__tagline">{business.tagline}</p>
            <div className="footer__contact-chips">
              <a href={`tel:${business.phone}`} className="footer__chip"><Phone size={14} /> {business.phone}</a>
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
              <li><MapPin size={14} /><span>{business.address}</span></li>
              <li><Phone size={14} /><span><a href={`tel:${business.phone}`}>{business.phone}</a></span></li>
              <li><Clock size={14} /><span>{business.hours}</span></li>
            </ul>
            <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>
              <MapPin size={14} /> Get Directions
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {year} {business.name} · {business.owner}</p>
          <p>Parsneu, Churu, Rajasthan</p>
        </div>
      </div>
    </footer>
  );
}
