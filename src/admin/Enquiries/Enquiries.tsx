import { useState, useEffect } from 'react';
import { MessageSquare, Search, X, CheckCircle, AlertCircle, Phone, ExternalLink, Calendar, MapPin, Package } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { getEnquiries, updateEnquiryStatus } from '../../services/enquiryService';
import type { Enquiry } from '../../types';

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`admin-toast admin-toast--${type}`}>
      {type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
      <span>{msg}</span>
    </div>
  );
}

const STATUS_CONFIG: Record<string, { badge: string; label: string }> = {
  new: { badge: 'admin-badge--red', label: 'New' },
  contacted: { badge: 'admin-badge--yellow', label: 'Contacted' },
  completed: { badge: 'admin-badge--green', label: 'Completed' },
  closed: { badge: 'admin-badge--gray', label: 'Closed' },
};

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const load = async () => {
    setLoading(true);
    try { setEnquiries(await getEnquiries()); } catch { setToast({ msg: 'Failed to load enquiries.', type: 'error' }); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id: string, status: Enquiry['status']) => {
    try {
      await updateEnquiryStatus(id, status);
      setToast({ msg: 'Status updated.', type: 'success' });
      if (selected?.id === id) setSelected(e => e && ({ ...e, status }));
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    } catch { setToast({ msg: 'Update failed.', type: 'error' }); }
  };

  const filtered = enquiries
    .filter(e => statusFilter === 'all' || e.status === statusFilter)
    .filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.mobile.includes(search) || e.product.toLowerCase().includes(search.toLowerCase()));

  const counts = { new: enquiries.filter(e => e.status === 'new').length, contacted: enquiries.filter(e => e.status === 'contacted').length, completed: enquiries.filter(e => e.status === 'completed').length, closed: enquiries.filter(e => e.status === 'closed').length };

  return (
    <AdminLayout title="Enquiries">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="admin-filter-tabs">
          {[
            { key: 'all', label: 'All', count: enquiries.length },
            { key: 'new', label: 'New', count: counts.new },
            { key: 'contacted', label: 'Contacted', count: counts.contacted },
            { key: 'completed', label: 'Completed', count: counts.completed },
            { key: 'closed', label: 'Closed', count: counts.closed },
          ].map(({ key, label, count }) => (
            <button key={key} className={`admin-filter-tab${statusFilter === key ? ' admin-filter-tab--active' : ''}`}
              onClick={() => setStatusFilter(key)}>
              {label}
              {count > 0 && <span style={{ marginLeft: 5, opacity: 0.7, fontSize: 11 }}>{count}</span>}
            </button>
          ))}
        </div>
        <div className="admin-search-bar" style={{ marginLeft: 'auto', minWidth: 200 }}>
          <Search size={14} style={{ color: 'var(--a-text3)', flexShrink: 0 }} />
          <input placeholder="Search enquiries…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button style={{ background: 'none', border: 'none', color: 'var(--a-text3)', cursor: 'pointer', padding: 2 }} onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon"><MessageSquare size={28} /></div>
          <h3>No enquiries found</h3>
          <p>{search || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Enquiries submitted from the website will appear here.'}</p>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(e)}>
                    <td>
                      <div>
                        <div style={{ color: 'var(--a-text)', fontWeight: 500, fontSize: 13.5 }}>{e.name}</div>
                        <div style={{ color: 'var(--a-text3)', fontSize: 12, marginTop: 1 }}>{e.mobile}</div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{e.product}</td>
                    <td style={{ fontSize: 13 }}>{e.location}</td>
                    <td style={{ fontSize: 12, color: 'var(--a-text3)' }}>
                      {new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td onClick={ev => ev.stopPropagation()}>
                      <select
                        className="admin-input admin-select"
                        style={{ padding: '5px 10px', fontSize: 12, width: 'auto', borderRadius: 8 }}
                        value={e.status}
                        onChange={ev => handleStatus(e.id, ev.target.value as Enquiry['status'])}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td onClick={ev => ev.stopPropagation()}>
                      <span className={`admin-badge ${STATUS_CONFIG[e.status].badge}`}>{STATUS_CONFIG[e.status].label}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div>
                <div className="admin-modal__title">{selected.name}</div>
                <div style={{ fontSize: 12, color: 'var(--a-text3)', marginTop: 2 }}>
                  {new Date(selected.created_at).toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`admin-badge ${STATUS_CONFIG[selected.status].badge}`}>{STATUS_CONFIG[selected.status].label}</span>
                <button className="admin-btn admin-btn--ghost admin-btn--icon admin-btn--sm" onClick={() => setSelected(null)}><X size={16} /></button>
              </div>
            </div>

            {/* Contact actions */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <a href={`tel:${selected.mobile}`} className="admin-btn admin-btn--ghost" style={{ textDecoration: 'none', flex: 1, justifyContent: 'center' }}>
                <Phone size={14} /> Call {selected.mobile}
              </a>
              {selected.whatsapp && (
                <a href={`https://wa.me/91${selected.whatsapp}`} className="admin-btn admin-btn--primary" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flex: 1, justifyContent: 'center' }}>
                  <ExternalLink size={14} /> WhatsApp
                </a>
              )}
            </div>

            {/* Details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { icon: Phone, label: 'Mobile', value: selected.mobile },
                { icon: Phone, label: 'WhatsApp', value: selected.whatsapp || '—' },
                { icon: Package, label: 'Product', value: selected.product },
                { icon: Package, label: 'Quantity', value: selected.quantity || '—' },
                { icon: MapPin, label: 'Location', value: selected.location },
                { icon: Calendar, label: 'Delivery Date', value: selected.delivery_date || '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ background: 'var(--a-surface2)', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Icon size={12} style={{ color: 'var(--a-text3)' }} />
                    <span style={{ fontSize: 11, color: 'var(--a-text3)' }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 13.5, color: 'var(--a-text)', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>

            {selected.email && (
              <div style={{ background: 'var(--a-surface2)', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--a-text3)', marginBottom: 4 }}>Email</div>
                <div style={{ fontSize: 13.5, color: 'var(--a-text)' }}>{selected.email}</div>
              </div>
            )}

            {selected.message && (
              <div style={{ background: 'var(--a-surface2)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--a-text3)', marginBottom: 6 }}>Message</div>
                <div style={{ fontSize: 13.5, color: 'var(--a-text)', lineHeight: 1.5 }}>{selected.message}</div>
              </div>
            )}

            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Update Status</label>
              <select className="admin-input admin-select" value={selected.status}
                onChange={e => handleStatus(selected.id, e.target.value as Enquiry['status'])}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
