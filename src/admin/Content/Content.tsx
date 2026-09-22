import { useState, useEffect } from 'react';
import { Save, CheckCircle, AlertCircle, Building2, Globe, FileText } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { getSiteSettings, updateSiteSettings } from '../../services/contentService';
import type { SiteSettings } from '../../types';

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`admin-toast admin-toast--${type}`}>
      {type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
      <span>{msg}</span>
    </div>
  );
}

interface Section { id: string; icon: React.ElementType; label: string; fields: { key: keyof SiteSettings; label: string; placeholder?: string; multiline?: boolean; rows?: number }[] }

const SECTIONS: Section[] = [
  {
    id: 'business', icon: Building2, label: 'Business Information',
    fields: [
      { key: 'business_name', label: 'Business Name', placeholder: 'Karni Building Material Supplier' },
      { key: 'owner_name', label: 'Owner Name', placeholder: 'Ganveer Singh' },
      { key: 'phone', label: 'Phone Number', placeholder: '8003293523' },
      { key: 'whatsapp', label: 'WhatsApp Number', placeholder: '8003293523' },
      { key: 'email', label: 'Email Address', placeholder: 'Ganveersingh8@gmail.com' },
      { key: 'address', label: 'Address', placeholder: 'Gaav Parsneu, Churu, Rajasthan - 331802' },
    ],
  },
  {
    id: 'hero', icon: Globe, label: 'Hero Section',
    fields: [
      { key: 'hero_title', label: 'Hero Title', placeholder: 'Karni Building Material Supplier' },
      { key: 'hero_subtitle', label: 'Hero Subtitle', placeholder: 'Quality Rodi, Bajri & Building Materials…' },
    ],
  },
  {
    id: 'content', icon: FileText, label: 'Page Content',
    fields: [
      { key: 'about_text', label: 'About Text', multiline: true, rows: 4 },
      { key: 'contact_text', label: 'Contact Section Text', multiline: true, rows: 2 },
      { key: 'footer_text', label: 'Footer Text', multiline: true, rows: 2 },
    ],
  },
];

export default function AdminContent() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [activeSection, setActiveSection] = useState('business');

  useEffect(() => {
    getSiteSettings().then(s => { setSettings(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const set = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSettings(s => ({ ...s, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      setToast({ msg: 'Settings saved successfully!', type: 'success' });
    } catch {
      setToast({ msg: 'Failed to save settings.', type: 'error' });
    }
    setSaving(false);
  };

  if (loading) return (
    <AdminLayout title="Website Content">
      <div className="admin-loading"><div className="admin-spinner" /></div>
    </AdminLayout>
  );

  const currentSection = SECTIONS.find(s => s.id === activeSection)!;

  return (
    <AdminLayout title="Website Content">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, maxWidth: 900 }}>
        {/* Section nav */}
        <div className="admin-card" style={{ padding: 12, alignSelf: 'start' }}>
          {SECTIONS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`admin-nav-item${activeSection === id ? ' active' : ''}`}
              style={{ width: '100%', marginBottom: 2 }}
              onClick={() => setActiveSection(id)}
            >
              <Icon size={16} />
              <span style={{ fontSize: 13 }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Fields */}
        <div>
          <div className="admin-card">
            <div className="admin-section-header" style={{ marginBottom: 24 }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <currentSection.icon size={17} style={{ color: 'var(--a-gold)' }} />
                {currentSection.label}
              </h3>
            </div>

            {currentSection.fields.map(({ key, label, placeholder, multiline, rows }) => (
              <div key={key} className="admin-form-group">
                <label>{label}</label>
                {multiline ? (
                  <textarea
                    className="admin-input admin-textarea"
                    rows={rows ?? 3}
                    value={(settings[key] as string) ?? ''}
                    onChange={set(key)}
                    placeholder={placeholder}
                  />
                ) : (
                  <input
                    className="admin-input"
                    value={(settings[key] as string) ?? ''}
                    onChange={set(key)}
                    placeholder={placeholder}
                  />
                )}
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="admin-btn admin-btn--primary admin-btn--lg" onClick={handleSave} disabled={saving}>
                {saving
                  ? <><span className="admin-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</>
                  : <><Save size={16} /> Save Changes</>
                }
              </button>
            </div>
          </div>

          {/* Live preview hint */}
          <div style={{ marginTop: 12, padding: '12px 16px', background: 'var(--a-gold-dim2)', border: '1px solid rgba(212,160,23,0.1)', borderRadius: 10 }}>
            <p style={{ fontSize: 12, color: 'var(--a-text3)', lineHeight: 1.5 }}>
              💡 Changes saved here will reflect on the public website after a page refresh — no code rebuild required.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
