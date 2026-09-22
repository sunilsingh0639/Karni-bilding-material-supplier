import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Package, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ImageUploader from '../components/ImageUploader';
import type { UploadResult } from '../components/ImageUploader';
import { getAllProducts, upsertProduct, deleteProduct } from '../../services/productService';
import type { Product } from '../../types';
import '../components/ImageUploader.css';

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`admin-toast admin-toast--${type}`}>
      {type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
      <span>{msg}</span>
    </div>
  );
}

const EMPTY: Partial<Product> = { name: '', category: '', description: '', features: [], image_url: '', is_active: true, display_order: 1, unit: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [editItem, setEditItem] = useState<Partial<Product> | null>(null);
  const [deleteItem, setDeleteItem] = useState<Product | null>(null);
  const [featuresInput, setFeaturesInput] = useState('');
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => setToast({ msg, type });

  const load = async () => {
    setLoading(true);
    try { setProducts(await getAllProducts()); } catch { showToast('Failed to load products.', 'error'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (p?: Product) => {
    const item = p ? { ...p } : { ...EMPTY, display_order: products.length + 1 };
    setEditItem(item);
    setFeaturesInput((item.features ?? []).join('\n'));
    setUploadResult(null);
  };

  const handleSave = async () => {
    if (!editItem?.name) { showToast('Product name required.', 'error'); return; }
    const imageUrl = uploadResult?.publicUrl ?? editItem.image_url ?? '';
    try {
      await upsertProduct({
        ...editItem,
        image_url: imageUrl,
        features: featuresInput.split('\n').map(s => s.trim()).filter(Boolean),
      });
      showToast('Product saved!', 'success');
      setEditItem(null); setUploadResult(null); await load();
    } catch { showToast('Save failed.', 'error'); }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await deleteProduct(deleteItem.id);
      showToast('Product deleted.', 'success');
      setDeleteItem(null); await load();
    } catch { showToast('Delete failed.', 'error'); }
  };

  return (
    <AdminLayout title="Products">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="admin-page-header">
        <div>
          <h2>Products</h2>
          <p style={{ fontSize: 13, color: 'var(--a-text3)', marginTop: 2 }}>{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={() => openEdit()}>
          <Plus size={15} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-spinner" /></div>
      ) : products.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon"><Package size={28} /></div>
          <h3>No products yet</h3>
          <p>Add your first product to display it on the website.</p>
          <button className="admin-btn admin-btn--primary" onClick={() => openEdit()} style={{ marginTop: 8 }}>
            <Plus size={15} /> Add Product
          </button>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name}
                            style={{ width: 48, height: 36, borderRadius: 8, objectFit: 'cover', background: 'var(--a-surface2)', flexShrink: 0 }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <div style={{ width: 48, height: 36, borderRadius: 8, background: 'var(--a-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Package size={16} style={{ color: 'var(--a-text3)' }} />
                          </div>
                        )}
                        <div>
                          <div style={{ color: 'var(--a-text)', fontSize: 13.5, fontWeight: 500 }}>{p.name}</div>
                          <div style={{ color: 'var(--a-text3)', fontSize: 11, marginTop: 1 }}>{p.description?.slice(0, 50)}{(p.description?.length ?? 0) > 50 ? '…' : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td>{p.unit}</td>
                    <td>{p.display_order}</td>
                    <td>
                      <span className={`admin-badge ${p.is_active ? 'admin-badge--green' : 'admin-badge--gray'}`}>
                        {p.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="admin-btn admin-btn--ghost admin-btn--sm admin-btn--icon" onClick={() => openEdit(p)} title="Edit"><Edit2 size={13} /></button>
                        <button className="admin-btn admin-btn--danger admin-btn--sm admin-btn--icon" onClick={() => setDeleteItem(p)} title="Delete"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {editItem && (
        <div className="admin-modal-overlay" onClick={() => setEditItem(null)}>
          <div className="admin-modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">{editItem.id ? 'Edit Product' : 'Add Product'}</span>
              <button className="admin-btn admin-btn--ghost admin-btn--icon admin-btn--sm" onClick={() => setEditItem(null)}><X size={16} /></button>
            </div>

            {/* Product Image */}
            <div className="admin-form-group">
              <label>Product Image</label>
              {editItem.image_url && !uploadResult && (
                <img src={editItem.image_url} alt="Current"
                  style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, marginBottom: 8, background: 'var(--a-surface2)' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              <ImageUploader
                category="gallery"
                onUploaded={r => setUploadResult(r)}
                onError={msg => showToast(msg, 'error')}
                compact={!!editItem.image_url && !uploadResult}
              />
              {uploadResult && (
                <p style={{ fontSize: 11, color: 'var(--a-green)', marginTop: 4 }}>✓ New image uploaded — will be saved with product</p>
              )}
            </div>

            <div className="admin-form-group">
              <label>Name *</label>
              <input className="admin-input" value={editItem.name ?? ''} onChange={e => setEditItem(i => i && ({ ...i, name: e.target.value }))} placeholder="Product name" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="admin-form-group">
                <label>Category</label>
                <input className="admin-input" value={editItem.category ?? ''} onChange={e => setEditItem(i => i && ({ ...i, category: e.target.value }))} placeholder="e.g. Aggregate" />
              </div>
              <div className="admin-form-group">
                <label>Unit</label>
                <input className="admin-input" value={editItem.unit ?? ''} onChange={e => setEditItem(i => i && ({ ...i, unit: e.target.value }))} placeholder="Bag / Tonne" />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <textarea className="admin-input admin-textarea" rows={3} value={editItem.description ?? ''} onChange={e => setEditItem(i => i && ({ ...i, description: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label>Features (one per line)</label>
              <textarea className="admin-input admin-textarea" rows={4} value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="admin-form-group">
                <label>Display Order</label>
                <input type="number" className="admin-input" value={editItem.display_order ?? 1} onChange={e => setEditItem(i => i && ({ ...i, display_order: Number(e.target.value) }))} />
              </div>
            </div>
            <label className="admin-toggle" style={{ marginBottom: 20 }}>
              <div className={`admin-toggle__track${editItem.is_active ? ' admin-toggle__track--on' : ''}`} onClick={() => setEditItem(i => i && ({ ...i, is_active: !i.is_active }))}>
                <div className="admin-toggle__thumb" />
              </div>
              <span className="admin-toggle__label">Active (visible on website)</span>
            </label>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn--ghost" onClick={() => setEditItem(null)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave}>
                <Upload size={14} /> Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteItem && (
        <div className="admin-modal-overlay" onClick={() => setDeleteItem(null)}>
          <div className="admin-modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">Delete Product</span>
              <button className="admin-btn admin-btn--ghost admin-btn--icon admin-btn--sm" onClick={() => setDeleteItem(null)}><X size={16} /></button>
            </div>
            <p style={{ color: 'var(--a-text2)', marginBottom: 20, fontSize: 14 }}>
              Delete "<strong style={{ color: 'var(--a-text)' }}>{deleteItem.name}</strong>"? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteItem(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={handleDelete}><Trash2 size={14} /> Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
