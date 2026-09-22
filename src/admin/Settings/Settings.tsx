import { Database, HardDrive, PlayCircle, Globe } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const INFO_CARDS = [
  {
    icon: Database,
    title: 'Supabase Database',
    color: 'var(--a-green)',
    bg: 'var(--a-green-dim)',
    items: [
      { label: 'Project URL', value: import.meta.env.VITE_SUPABASE_URL ? '✓ Configured' : '✗ Not configured' },
      { label: 'Tables', value: 'media, products, music_tracks, music_playlists, enquiries, site_settings' },
      { label: 'Auth', value: 'Supabase Email/Password' },
    ],
  },
  {
    icon: HardDrive,
    title: 'Supabase Storage',
    color: 'var(--a-blue)',
    bg: 'var(--a-blue-dim)',
    items: [
      { label: 'Bucket', value: 'business-media' },
      { label: 'Persistence', value: 'Survives all Netlify deployments' },
      { label: 'Access', value: 'Public read · Authenticated write' },
    ],
  },
  {
    icon: PlayCircle,
    title: 'YouTube Integration',
    color: 'var(--a-red)',
    bg: 'var(--a-red-dim)',
    items: [
      { label: 'Player', value: 'YouTube IFrame API' },
      { label: 'Search', value: 'Via Netlify serverless function' },
      { label: 'API Key', value: 'Stored in Netlify env vars (server-side only)' },
    ],
  },
  {
    icon: Globe,
    title: 'Deployment',
    color: 'var(--a-purple)',
    bg: 'var(--a-purple-dim)',
    items: [
      { label: 'Platform', value: 'Netlify' },
      { label: 'Build', value: 'npm run build → dist/' },
      { label: 'Functions', value: 'netlify/functions/' },
    ],
  },
];

export default function AdminSettings() {
  return (
    <AdminLayout title="Settings">
      <div style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--a-text)', letterSpacing: '-0.4px', marginBottom: 4 }}>
            System Information
          </h2>
          <p style={{ fontSize: 13, color: 'var(--a-text3)' }}>
            Configuration overview for Karni Building Material Supplier admin panel.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, marginBottom: 24 }}>
          {INFO_CARDS.map(({ icon: Icon, title, color, bg, items }) => (
            <div key={title} className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, background: bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                  <Icon size={18} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--a-text)' }}>{title}</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 11, color: 'var(--a-text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                    <span style={{ fontSize: 13, color: 'var(--a-text2)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--a-text)', marginBottom: 16 }}>Admin Account</h3>
          <p style={{ fontSize: 13, color: 'var(--a-text3)', lineHeight: 1.6, marginBottom: 12 }}>
            To change your admin password, use the Supabase dashboard → Authentication → Users, or trigger a password reset email.
          </p>
          <p style={{ fontSize: 13, color: 'var(--a-text3)', lineHeight: 1.6 }}>
            To add additional admin users, create them in Supabase Auth and run:
          </p>
          <pre style={{ background: 'var(--a-surface2)', border: '1px solid var(--a-border)', borderRadius: 10, padding: '12px 16px', fontSize: 12, color: 'var(--a-text2)', marginTop: 10, overflowX: 'auto', fontFamily: 'monospace' }}>
            {`UPDATE profiles SET role = 'admin'\nWHERE email = 'newadmin@example.com';`}
          </pre>
        </div>
      </div>
    </AdminLayout>
  );
}
