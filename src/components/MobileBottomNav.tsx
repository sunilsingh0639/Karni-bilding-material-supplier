import { NavLink } from 'react-router-dom';
import { Home, Package, Image, Music, FileText } from 'lucide-react';
import './MobileBottomNav.css';

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/gallery', icon: Image, label: 'Gallery' },
  { to: '/track-driver-music', icon: Music, label: 'Music' },
  { to: '/enquiry', icon: FileText, label: 'Enquiry' },
];

export default function MobileBottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}>
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
