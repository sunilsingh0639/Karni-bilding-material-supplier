import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { business } from '../data/business';
import './Header.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/videos', label: 'Videos' },
  { to: '/enquiry', label: 'Enquiry' },
  { to: '/track-driver-music', label: 'Track Driver Music' },
  { to: '/ghasi-bhojpuri', label: 'Ghasi Bhojpuri' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleQuote = () => { setOpen(false); navigate('/enquiry'); };

  return (
    <>
      <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
        <div className="header__inner container">
          <Link to="/" className="header__logo" onClick={() => setOpen(false)}>
            <span className="header__logo-icon">K</span>
            <span className="header__logo-text">
              <span className="header__logo-main">Karni</span>
              <span className="header__logo-sub">Building Material Supplier</span>
            </span>
          </Link>

          <nav className="header__nav" aria-label="Main navigation">
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `header__link${isActive ? ' active' : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            <a href={`tel:${business.phone}`} className="header__action-icon" aria-label="Call us">
              <Phone size={18} />
            </a>
            <button className="btn btn-accent btn-sm" onClick={handleQuote}>Get Quote</button>
            <button className="header__hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu" aria-expanded={open}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu${open ? ' mobile-menu--open' : ''}`} aria-hidden={!open}>
        <div className="mobile-menu__inner">
          <nav className="mobile-menu__nav">
            {navLinks.map((l, i) => (
              <NavLink
                key={l.to} to={l.to} end={l.to === '/'}
                className={({ isActive }) => `mobile-menu__link${isActive ? ' active' : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mobile-menu__footer">
            <a href={`tel:${business.phone}`} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
              <Phone size={16} /> Call Now
            </a>
            <a href={`https://wa.me/${business.whatsapp}`} className="btn btn-whatsapp" style={{ flex: 1, justifyContent: 'center' }}>
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
          <button className="btn btn-accent" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={handleQuote}>
            Get Quote
          </button>
        </div>
      </div>
      {open && <div className="mobile-menu__overlay" onClick={() => setOpen(false)} />}
    </>
  );
}
