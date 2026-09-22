import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ImageIcon, Music, FileText, Package,
  MessageSquare, Settings, LogOut, Menu, X, ChevronRight, User,
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import './AdminLayout.css';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/images', icon: ImageIcon, label: 'Images' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/music', icon: Music, label: 'Music' },
  { to: '/admin/content', icon: FileText, label: 'Website Content' },
  { to: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

interface Props { children: React.ReactNode; title: string; }

export default function AdminLayout({ children, title }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email ?? '');
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const initial = email ? email[0].toUpperCase() : 'A';

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar${sidebarOpen ? ' admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <span className="admin-sidebar__logo-icon">K</span>
            <div>
              <div className="admin-sidebar__logo-main">Karni BMSF</div>
              <div className="admin-sidebar__logo-sub">Admin Panel</div>
            </div>
          </div>
          <button className="admin-sidebar__close" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          <div className="admin-sidebar__section-label">Navigation</div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={17} />
              <span>{label}</span>
              <ChevronRight size={13} className="admin-nav-item__arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          {email && (
            <div className="admin-sidebar__user">
              <div className="admin-sidebar__avatar">{initial}</div>
              <span className="admin-sidebar__user-email">{email}</span>
            </div>
          )}
          <button className="admin-nav-item admin-nav-item--logout" onClick={handleLogout}>
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-topbar__menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <h1 className="admin-topbar__title">{title}</h1>
          <div className="admin-topbar__right">
            <div className="admin-topbar__avatar" title={email}>
              {email ? <User size={15} /> : 'A'}
            </div>
            <button className="admin-topbar__logout" onClick={handleLogout} title="Sign out">
              <LogOut size={17} />
            </button>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
