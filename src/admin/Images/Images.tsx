import { useState, useEffect, useRef } from 'react';
import { Trash2, Edit2, X, Search, Star, ChevronUp, ChevronDown, CheckCircle, AlertCircle, Upload, RefreshCw, ImageIcon } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ImageUploader from '../components/ImageUploader';
import type { UploadResult } from '../components/ImageUploader';
import { getAllImages, updateImage, deleteImage, updateImageOrder } from '../../services/mediaService';
import { supabase } from '../../services/supabaseClient';
import type { MediaItem } from '../../types';
import './Images.css';
import '../components/ImageUploader.css';

const CATEGORIES = ['hero', 'rodi', 'bajri', 'trucks', 'delivery', 'construction', 'gallery', 'owner', 'team', 'other'];
const CAT_LABELS: Record<string, string> = { hero: 'Hero', rodi: 'Rodi', bajri: 'Bajri', trucks: 'Trucks', delivery: 'Delivery', construction: 'Construction', gallery: 'Gallery', owner: 'Owner', team: 'Team', other: 'Other' };

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`admin-toast admin-toast--${type}`}>
      {type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
      <span>{msg}</span>
    </div>
  );
}

interface UploadForm { title: string; description: string; category: string; is_featured: boolean; uploadResult: UploadResult | null; }
const EMPTY_FORM: UploadForm = { title: '', description: '', category: 'gallery', is_featured: false, uploadResult: null };

export default function AdminImages() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MediaItem | null>(null);
  const [replaceItem, setReplaceItem] = useState<MediaItem | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState<UploadForm>({ ...EMPTY_FORM });
  const [showUpload, setShowUpload] = useState(false);
  const replaceResultRef = useRef<UploadResult | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => setToast({ msg, type });

  const load = async () => {
    setLoading(true);
    try { setImages(await getAllImages()); } catch { showToast('Failed to load images.', 'error'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSaveNew = async () => {
    if (!form.uploadResult) { showToast('Please upload an image first.', 'error'); return; }
    if (!form.title.trim()) { showToast('Please enter a title.', 'error'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('media').insert({
        file_name: form.uploadResult.fileName,
        storage_path: form.uploadResult.storagePath,
        public_url: form.uploadResult.publicUrl,
        title: form.title,
        description: form.description,
        category: form.category,
        is_featured: form.is_featured,
        is_active: true,
        display_order: images.length + 1,
      });
      if (error) throw error;
      showToast('Image saved successfully!', 'success');
      setForm({ ...EMPTY_FORM });
      setShowUpload(false);
      await load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Save failed.', 'error');
    }
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!editItem) return;
    try {
      await updateImage(editItem.id, {
        title: editItem.title, description: editItem.description,
        category: editItem.category, is_featured: editItem.is_featured,
        is_active: editItem.is_active, display_order: editItem.display_order,
      });
      showToast('Image updated.', 'success');
      setEditItem(null); await load();
    } catch { showToast('Update failed.', 'error'); }
  };

  const handleReplace = async () => {
    if (!replaceItem || !replaceResultRef.current) { showToast('Please select a new image first.', 'error'); return; }
    try {
      const r = replaceResultRef.current;
      await updateImage(replaceItem.id, {
        file_name: r.fileName,
        storage_path: r.storagePath,
        public_url: r.publicUrl,
      });
      showToast('Image replaced.', 'success');
      setReplaceItem(null); replaceResultRef.current = null; await load();
    } catch { showToast('Replace failed.', 'error'); }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await deleteImage(deleteItem.id, deleteItem.storage_path);
      showToast('Image deleted.', 'success');
      setDeleteItem(null); await load();
    } catch { showToast('Delete failed.', 'error'); }
  };

  const moveOrder = async (img: MediaItem, dir: 'up' | 'down') => {
    const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex(i => i.id === img.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[swapIdx];
    await Promise.all([updateImageOrder(a.id, b.display_order), updateImageOrder(b.id, a.display_order)]);
    await load();
  };

  const filtered = images
    .filter(i => catFilter === 'all' || i.category === catFilter)
    .filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <AdminLayout title="Image Management">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h2>Images</h2>
          <p style={{ fontSize: 13, color: 'var(--a-text3)', marginTop: 2 }}>
            {images.length} image{images.length !== 1 ? 's' : ''} · Stored in Supabase
          </p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={() => setShowUpload(true)}>
          <Upload size={15} /> Upload Image
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="admin-filter-tabs">
          {['all', ...CATEGORIES].map(c => (
            <button key={c} className={`admin-filter-tab${catFilter === c ? ' admin-filter-tab--active' : ''}`}
              onClick={() => setCatFilter(c)}>
              {c === 'all' ? 'All' : CAT_LABELS[c] ?? c}
            </button>
          ))}
        </div>
        <div className="admin-search-bar" style={{ marginLeft: 'auto', minWidth: 200 }}>
          <Search size={14} style={{ color: 'var(--a-text3)', flexShrink: 0 }} />
          <input placeholder="Search images…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button style={{ background: 'none', border: 'none', color: 'var(--a-text3)', cursor: 'pointer', padding: 2 }} onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="img-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="img-card">
              <div className="admin-skeleton" style={{ aspectRatio: '4/3', borderRadius: '10px 10px 0 0' }} />
              <div style={{ padding: '10px 12px' }}>
                <div className="admin-skeleton" style={{ height: 14, borderRadius: 6, marginBottom: 6 }} />
                <div className="admin-skeleton" style={{ height: 11, width: '60%', borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon"><ImageIcon size={28} /></div>
          <h3>No images found</h3>
          <p>{search || catFilter !== 'all' ? 'Try adjusting your filters.' : 'Upload your first image to get started.'}</p>
          {!search && catFilter === 'all' && (
            <button className="admin-btn admin-btn--primary" onClick={() => setShowUpload(true)} style={{ marginTop: 8 }}>
              <Upload size={15} /> Upload Image
            </button>
          )}
        </div>
      ) : (
        <div className="img-grid">
          {filtered.map(img => (
            <div key={img.id} className="img-card">
              <div className="img-card__thumb">
                <img src={img.public_url} alt={img.title} loading="lazy"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x200/111/333?text=Image'; }} />
                <div className="img-card__badges">
                  {img.is_featured && <span className="admin-badge admin-badge--gold"><Star size={9} /> Featured</span>}
                  {!img.is_active && <span className="admin-badge admin-badge--gray">Hidden</span>}
                </div>
                <div className="img-card__overlay">
                  <button className="img-card__overlay-btn" onClick={() => setEditItem({ ...img })} title="Edit"><Edit2 size={14} /></button>
                  <button className="img-card__overlay-btn" onClick={() => { replaceResultRef.current = null; setReplaceItem({ ...img }); }} title="Replace"><RefreshCw size={14} /></button>
                  <button className="img-card__overlay-btn img-card__overlay-btn--danger" onClick={() => setDeleteItem(img)} title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="img-card__body">
                <p className="img-card__title">{img.title}</p>
                <div className="img-card__meta">
                  <span className="admin-badge admin-badge--gray" style={{ fontSize: 10 }}>{CAT_LABELS[img.category] ?? img.category}</span>
                  <div className="img-card__order-btns">
                    <button className="admin-btn admin-btn--icon admin-btn--sm admin-btn--ghost" onClick={() => moveOrder(img, 'up')} title="Move up"><ChevronUp size={12} /></button>
                    <button className="admin-btn admin-btn--icon admin-btn--sm admin-btn--ghost" onClick={() => moveOrder(img, 'down')} title="Move down"><ChevronDown size={12} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="admin-modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="admin-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">Upload New Image</span>
              <button className="admin-btn admin-btn--ghost admin-btn--icon admin-btn--sm" onClick={() => setShowUpload(false)}><X size={16} /></button>
            </div>

            <div className="admin-form-group">
              <label>Select Image</label>
              <ImageUploader
                category={form.category}
                onUploaded={r => setForm(f => ({ ...f, uploadResult: r }))}
                onError={msg => showToast(msg, 'error')}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label>Title *</label>
                <input className="admin-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Image title" />
              </div>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label>Category</label>
                <select className="admin-input admin-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                </select>
              </div>
            </div>

            <div className="admin-form-group" style={{ marginTop: 12 }}>
              <label>Description</label>
              <input className="admin-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" />
            </div>

            <label className="admin-toggle" style={{ marginBottom: 20 }}>
              <div className={`admin-toggle__track${form.is_featured ? ' admin-toggle__track--on' : ''}`} onClick={() => setForm(f => ({ ...f, is_featured: !f.is_featured }))}>
                <div className="admin-toggle__thumb" />
              </div>
              <span className="admin-toggle__label">Mark as Featured</span>
            </label>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn--ghost" onClick={() => setShowUpload(false)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSaveNew} disabled={saving || !form.uploadResult}>
                {saving ? 'Saving…' : 'Save Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="admin-modal-overlay" onClick={() => setEditItem(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">Edit Image</span>
              <button className="admin-btn admin-btn--ghost admin-btn--icon admin-btn--sm" onClick={() => setEditItem(null)}><X size={16} /></button>
            </div>
            <img src={editItem.public_url} alt={editItem.title}
              style={{ width: '100%', borderRadius: 10, marginBottom: 20, maxHeight: 180, objectFit: 'cover', background: '#111' }} />
            <div className="admin-form-group">
              <label>Title</label>
              <input className="admin-input" value={editItem.title} onChange={e => setEditItem(i => i && ({ ...i, title: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <input className="admin-input" value={editItem.description} onChange={e => setEditItem(i => i && ({ ...i, description: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="admin-form-group">
                <label>Category</label>
                <select className="admin-input admin-select" value={editItem.category} onChange={e => setEditItem(i => i && ({ ...i, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label>Display Order</label>
                <input type="number" className="admin-input" value={editItem.display_order}
                  onChange={e => setEditItem(i => i && ({ ...i, display_order: Number(e.target.value) }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
              <label className="admin-toggle">
                <div className={`admin-toggle__track${editItem.is_featured ? ' admin-toggle__track--on' : ''}`} onClick={() => setEditItem(i => i && ({ ...i, is_featured: !i.is_featured }))}>
                  <div className="admin-toggle__thumb" />
                </div>
                <span className="admin-toggle__label">Featured</span>
              </label>
              <label className="admin-toggle">
                <div className={`admin-toggle__track${editItem.is_active ? ' admin-toggle__track--on' : ''}`} onClick={() => setEditItem(i => i && ({ ...i, is_active: !i.is_active }))}>
                  <div className="admin-toggle__thumb" />
                </div>
                <span className="admin-toggle__label">Active</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn--ghost" onClick={() => setEditItem(null)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleUpdate}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Replace Modal */}
      {replaceItem && (
        <div className="admin-modal-overlay" onClick={() => setReplaceItem(null)}>
          <div className="admin-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">Replace Image</span>
              <button className="admin-btn admin-btn--ghost admin-btn--icon admin-btn--sm" onClick={() => setReplaceItem(null)}><X size={16} /></button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--a-text3)', marginBottom: 16 }}>
              Select a new image to replace "<strong style={{ color: 'var(--a-text)' }}>{replaceItem.title}</strong>".
            </p>
            <div className="admin-form-group">
              <label>New Image</label>
              <ImageUploader
                category={replaceItem.category}
                currentUrl={replaceItem.public_url}
                onUploaded={r => { replaceResultRef.current = r; }}
                onError={msg => showToast(msg, 'error')}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="admin-btn admin-btn--ghost" onClick={() => setReplaceItem(null)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleReplace}>Replace Image</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteItem && (
        <div className="admin-modal-overlay" onClick={() => setDeleteItem(null)}>
          <div className="admin-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">Delete Image</span>
              <button className="admin-btn admin-btn--ghost admin-btn--icon admin-btn--sm" onClick={() => setDeleteItem(null)}><X size={16} /></button>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
              <img src={deleteItem.public_url} alt={deleteItem.title}
                style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 10, marginBottom: 16, background: '#111' }} />
              <p style={{ color: 'var(--a-text2)', fontSize: 14, marginBottom: 6 }}>
                Delete "<strong>{deleteItem.title}</strong>"?
              </p>
              <p style={{ color: 'var(--a-text3)', fontSize: 12 }}>
                This will remove the image from Supabase Storage and the database. This cannot be undone.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteItem(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={handleDelete}><Trash2 size={14} /> Delete Image</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
