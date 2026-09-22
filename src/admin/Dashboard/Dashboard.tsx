import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon, Music, Package, MessageSquare, Star, ArrowRight, Upload, Plus } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../../services/supabaseClient';

interface Stats { images: number; products: number; tracks: number; enquiries: number; featured: number; }

const STAT_CARDS = (s: Stats) => [
  { icon: ImageIcon, label: 'Total Images', value: s.images, sub: 'In Supabase Storage', to: '/admin/images', color: 'var(--a-blue)', bg: 'var(--a-blue-dim)' },
  { icon: Star, label: 'Featured', value: s.featured, sub: 'Highlighted images', to: '/admin/images', color: 'var(--a-gold)', bg: 'var(--a-gold-dim)' },
  { icon: Package, label: 'Products', value: s.products, sub: 'Active listings', to: '/admin/products', color: 'var(--a-green)', bg: 'var(--a-green-dim)' },
  { icon: Music, label: 'Music Tracks', value: s.tracks, sub: 'YouTube tracks', to: '/admin/music', color: 'var(--a-purple)', bg: 'var(--a-purple-dim)' },
  { icon: MessageSquare, label: 'New Enquiries', value: s.enquiries, sub: 'Awaiting response', to: '/admin/enquiries', color: 'var(--a-red)', bg: 'var(--a-red-dim)' },
];

const QUICK_ACTIONS = [
  { icon: Upload, label: 'Upload Image', sub: 'Add to gallery', to: '/admin/images', color: 'var(--a-blue)' },
  { icon: Plus, label: 'Add Product', sub: 'New listing', to: '/admin/products', color: 'var(--a-green)' },
  { icon: Music, label: 'Add Music', sub: 'YouTube track', to: '/admin/music', color: 'var(--a-purple)' },
  { icon: MessageSquare, label: 'Enquiries', sub: 'View all', to: '/admin/enquiries', color: 'var(--a-red)' },
];

function SkeletonCard() {
  return (
    <div className="admin-stat-card">
      <div className="admin-skeleton" style={{ width: 44, height: 44, borderRadius: 12 }} />
      <div className="admin-skeleton" style={{ width: 60, height: 32, borderRadius: 8, marginTop: 4 }} />
      <div className="admin-skeleton" style={{ width: 100, height: 14, borderRadius: 6 }} />
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ images: 0, products: 0, tracks: 0, enquiries: 0, featured: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [img, prod, tracks, enq, feat] = await Promise.allSettled([
        supabase.from('media').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('music_tracks').select('id', { count: 'exact', head: true }),
        supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('media').select('id', { count: 'exact', head: true }).eq('is_featured', true),
      ]);
      setStats({
        images: img.status === 'fulfilled' ? (img.value.count ?? 0) : 0,
        products: prod.status === 'fulfilled' ? (prod.value.count ?? 0) : 0,
        tracks: tracks.status === 'fulfilled' ? (tracks.value.count ?? 0) : 0,
        enquiries: enq.status === 'fulfilled' ? (enq.value.count ?? 0) : 0,
        featured: feat.status === 'fulfilled' ? (feat.value.count ?? 0) : 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--a-text)', letterSpacing: '-0.5px', marginBottom: 4 }}>
          Welcome back, Admin 👋
        </h2>
        <p style={{ fontSize: 14, color: 'var(--a-text3)' }}>
          Manage Karni Building Material Supplier
        </p>
      </div>

      {/* Stats */}
      <div className="admin-stat-grid">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : STAT_CARDS(stats).map(({ icon: Icon, label, value, sub, to, color, bg }) => (
            <Link key={label} to={to} style={{ textDecoration: 'none' }}>
              <div className="admin-stat-card">
                <div className="admin-stat-card__icon" style={{ background: bg, color }}>
                  <Icon size={20} />
                </div>
                <div className="admin-stat-card__value">{value}</div>
                <div className="admin-stat-card__label">{label}</div>
                <div className="admin-stat-card__sub">{sub}</div>
              </div>
            </Link>
          ))
        }
      </div>

      {/* Quick Actions */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-section-header">
          <h3>Quick Actions</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {QUICK_ACTIONS.map(({ icon: Icon, label, sub, to, color }) => (
            <Link key={label} to={to} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--a-surface2)', border: '1px solid var(--a-border)',
                borderRadius: 12, padding: '16px', cursor: 'pointer',
                transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: 10,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--a-border)'; (e.currentTarget as HTMLDivElement).style.transform = ''; }}
              >
                <div style={{ width: 36, height: 36, background: `${color}20`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                  <Icon size={17} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--a-text)', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--a-text3)' }}>{sub}</div>
                </div>
                <ArrowRight size={13} style={{ color: 'var(--a-text3)', marginTop: 'auto' }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="admin-card">
        <div className="admin-section-header">
          <h3>About This Panel</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { label: 'Storage', value: 'Supabase Storage', note: 'Images persist across deployments' },
            { label: 'Database', value: 'Supabase PostgreSQL', note: 'All content stored in cloud' },
            { label: 'Music', value: 'YouTube IFrame API', note: 'Real YouTube playback' },
            { label: 'Deployment', value: 'Netlify', note: 'Serverless functions included' },
          ].map(({ label, value, note }) => (
            <div key={label} style={{ background: 'var(--a-surface2)', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: 'var(--a-text3)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--a-text)', marginBottom: 2 }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--a-text3)' }}>{note}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
