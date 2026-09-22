import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Music, CheckCircle, AlertCircle, Search, ListMusic, Play } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { getAllTracks, getAllPlaylists, addTrack, updateTrack, deleteTrack, createPlaylist, fetchYouTubeVideoInfo } from '../../services/musicService';
import type { MusicTrackDB, MusicPlaylist } from '../../types';

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`admin-toast admin-toast--${type}`}>
      {type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
      <span>{msg}</span>
    </div>
  );
}

const EMPTY_TRACK = { youtube_video_id: '', title: '', channel_name: '', thumbnail_url: '', duration: '', category: 'general', playlist_id: null as string | null, display_order: 1, is_active: true, description: '' };

export default function AdminMusic() {
  const [tracks, setTracks] = useState<MusicTrackDB[]>([]);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);
  const [editTrack, setEditTrack] = useState<MusicTrackDB | null>(null);
  const [deleteTrackItem, setDeleteTrackItem] = useState<MusicTrackDB | null>(null);
  const [form, setForm] = useState({ ...EMPTY_TRACK });
  const [videoInput, setVideoInput] = useState('');
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [search, setSearch] = useState('');
  const [playlistFilter, setPlaylistFilter] = useState('all');

  const showToast = (msg: string, type: 'success' | 'error') => setToast({ msg, type });

  const load = async () => {
    setLoading(true);
    try {
      const [t, p] = await Promise.all([getAllTracks(), getAllPlaylists()]);
      setTracks(t); setPlaylists(p);
    } catch { showToast('Failed to load music data.', 'error'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const extractVideoId = (input: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const p of patterns) { const m = input.match(p); if (m) return m[1]; }
    return input.trim();
  };

  const handleFetchInfo = async () => {
    const vid = extractVideoId(videoInput);
    if (!vid) { showToast('Enter a valid YouTube URL or video ID.', 'error'); return; }
    setFetchingInfo(true);
    try {
      const info = await fetchYouTubeVideoInfo(vid);
      setForm(f => ({ ...f, youtube_video_id: vid, title: info.title, channel_name: info.channel, thumbnail_url: info.thumbnail, duration: info.duration }));
      showToast('Video info fetched!', 'success');
    } catch { showToast('Could not fetch video info. Check the URL or API key.', 'error'); }
    setFetchingInfo(false);
  };

  const handleAddTrack = async () => {
    if (!form.youtube_video_id || !form.title) { showToast('Video ID and title are required.', 'error'); return; }
    try {
      await addTrack({ ...form, display_order: tracks.length + 1 });
      showToast('Track added!', 'success');
      setShowAddTrack(false); setForm({ ...EMPTY_TRACK }); setVideoInput('');
      await load();
    } catch { showToast('Failed to add track.', 'error'); }
  };

  const handleUpdateTrack = async () => {
    if (!editTrack) return;
    try {
      await updateTrack(editTrack.id, editTrack);
      showToast('Track updated.', 'success');
      setEditTrack(null); await load();
    } catch { showToast('Update failed.', 'error'); }
  };

  const handleDeleteTrack = async () => {
    if (!deleteTrackItem) return;
    try {
      await deleteTrack(deleteTrackItem.id);
      showToast('Track deleted.', 'success');
      setDeleteTrackItem(null); await load();
    } catch { showToast('Delete failed.', 'error'); }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) { showToast('Playlist name required.', 'error'); return; }
    try {
      await createPlaylist({ name: newPlaylistName, description: newPlaylistDesc, cover_image: '', is_active: true, display_order: playlists.length + 1 });
      showToast('Playlist created!', 'success');
      setShowAddPlaylist(false); setNewPlaylistName(''); setNewPlaylistDesc('');
      await load();
    } catch { showToast('Failed to create playlist.', 'error'); }
  };

  const filtered = tracks
    .filter(t => playlistFilter === 'all' || t.playlist_id === playlistFilter)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.channel_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Music Management">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Playlists */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-section-header">
          <h3><ListMusic size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />Playlists</h3>
          <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setShowAddPlaylist(true)}>
            <Plus size={13} /> New Playlist
          </button>
        </div>
        {playlists.length === 0 ? (
          <p style={{ color: 'var(--a-text3)', fontSize: 13 }}>No playlists yet. Create one to organise your tracks.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {playlists.map(p => (
              <button
                key={p.id}
                className={`admin-filter-tab${playlistFilter === p.id ? ' admin-filter-tab--active' : ''}`}
                onClick={() => setPlaylistFilter(playlistFilter === p.id ? 'all' : p.id)}
              >
                <Music size={11} style={{ display: 'inline', marginRight: 4 }} />
                {p.name}
                <span style={{ marginLeft: 6, opacity: 0.6, fontSize: 11 }}>
                  {tracks.filter(t => t.playlist_id === p.id).length}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tracks header */}
      <div className="admin-page-header">
        <div>
          <h2>Tracks</h2>
          <p style={{ fontSize: 13, color: 'var(--a-text3)', marginTop: 2 }}>{filtered.length} track{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="admin-search-bar" style={{ minWidth: 200 }}>
            <Search size={14} style={{ color: 'var(--a-text3)', flexShrink: 0 }} />
            <input placeholder="Search tracks…" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button style={{ background: 'none', border: 'none', color: 'var(--a-text3)', cursor: 'pointer', padding: 2 }} onClick={() => setSearch('')}><X size={13} /></button>}
          </div>
          <button className="admin-btn admin-btn--primary" onClick={() => setShowAddTrack(true)}>
            <Plus size={15} /> Add Track
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon"><Music size={28} /></div>
          <h3>No tracks found</h3>
          <p>{search ? 'Try a different search.' : 'Add your first YouTube track to get started.'}</p>
          {!search && <button className="admin-btn admin-btn--primary" onClick={() => setShowAddTrack(true)} style={{ marginTop: 8 }}><Plus size={15} /> Add Track</button>}
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Track</th>
                  <th>Channel</th>
                  <th>Duration</th>
                  <th>Playlist</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <img src={t.thumbnail_url} alt={t.title}
                            style={{ width: 72, height: 54, borderRadius: 8, objectFit: 'cover', background: 'var(--a-surface2)', display: 'block' }}
                            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/72x54/111/333?text=♪'; }} />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 8, opacity: 0 }}
                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0'; }}>
                            <Play size={16} style={{ color: '#fff' }} fill="#fff" />
                          </div>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ color: 'var(--a-text)', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{t.title}</div>
                          <div style={{ color: 'var(--a-text3)', fontSize: 11, marginTop: 2, fontFamily: 'monospace' }}>{t.youtube_video_id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{t.channel_name || '—'}</td>
                    <td style={{ fontSize: 13 }}>{t.duration || '—'}</td>
                    <td style={{ fontSize: 13 }}>
                      {playlists.find(p => p.id === t.playlist_id)?.name
                        ? <span className="admin-badge admin-badge--blue">{playlists.find(p => p.id === t.playlist_id)?.name}</span>
                        : <span style={{ color: 'var(--a-text3)' }}>—</span>}
                    </td>
                    <td>
                      <span className={`admin-badge ${t.is_active ? 'admin-badge--green' : 'admin-badge--gray'}`}>
                        {t.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="admin-btn admin-btn--ghost admin-btn--sm admin-btn--icon" onClick={() => setEditTrack({ ...t })} title="Edit"><Edit2 size={13} /></button>
                        <button className="admin-btn admin-btn--danger admin-btn--sm admin-btn--icon" onClick={() => setDeleteTrackItem(t)} title="Delete"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Track Modal */}
      {showAddTrack && (
        <div className="admin-modal-overlay" onClick={() => setShowAddTrack(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">Add YouTube Track</span>
              <button className="admin-btn admin-btn--ghost admin-btn--icon admin-btn--sm" onClick={() => setShowAddTrack(false)}><X size={16} /></button>
            </div>
            <div className="admin-form-group">
              <label>YouTube URL or Video ID</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="admin-input" style={{ flex: 1 }} value={videoInput}
                  onChange={e => setVideoInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleFetchInfo()}
                  placeholder="https://youtube.com/watch?v=... or video ID" />
                <button className="admin-btn admin-btn--ghost" onClick={handleFetchInfo} disabled={fetchingInfo} style={{ flexShrink: 0 }}>
                  {fetchingInfo ? <span className="admin-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Fetch Info'}
                </button>
              </div>
            </div>
            {form.thumbnail_url && (
              <div style={{ marginBottom: 16, borderRadius: 10, overflow: 'hidden', background: 'var(--a-surface2)' }}>
                <img src={form.thumbnail_url} alt="thumb" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', display: 'block' }} />
              </div>
            )}
            <div className="admin-form-group">
              <label>Title *</label>
              <input className="admin-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Track title" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="admin-form-group">
                <label>Channel</label>
                <input className="admin-input" value={form.channel_name} onChange={e => setForm(f => ({ ...f, channel_name: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label>Duration</label>
                <input className="admin-input" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="4:30" />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Playlist</label>
              <select className="admin-input admin-select" value={form.playlist_id ?? ''} onChange={e => setForm(f => ({ ...f, playlist_id: e.target.value || null }))}>
                <option value="">No playlist</option>
                {playlists.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <label className="admin-toggle" style={{ marginBottom: 20 }}>
              <div className={`admin-toggle__track${form.is_active ? ' admin-toggle__track--on' : ''}`} onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}>
                <div className="admin-toggle__thumb" />
              </div>
              <span className="admin-toggle__label">Active (visible on website)</span>
            </label>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn--ghost" onClick={() => setShowAddTrack(false)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleAddTrack}>Add Track</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Track Modal */}
      {editTrack && (
        <div className="admin-modal-overlay" onClick={() => setEditTrack(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">Edit Track</span>
              <button className="admin-btn admin-btn--ghost admin-btn--icon admin-btn--sm" onClick={() => setEditTrack(null)}><X size={16} /></button>
            </div>
            {editTrack.thumbnail_url && (
              <div style={{ marginBottom: 16, borderRadius: 10, overflow: 'hidden' }}>
                <img src={editTrack.thumbnail_url} alt="thumb" style={{ width: '100%', maxHeight: 140, objectFit: 'cover', display: 'block' }} />
              </div>
            )}
            <div className="admin-form-group">
              <label>Title</label>
              <input className="admin-input" value={editTrack.title} onChange={e => setEditTrack(t => t && ({ ...t, title: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="admin-form-group">
                <label>Channel</label>
                <input className="admin-input" value={editTrack.channel_name} onChange={e => setEditTrack(t => t && ({ ...t, channel_name: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label>Duration</label>
                <input className="admin-input" value={editTrack.duration} onChange={e => setEditTrack(t => t && ({ ...t, duration: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="admin-form-group">
                <label>Playlist</label>
                <select className="admin-input admin-select" value={editTrack.playlist_id ?? ''} onChange={e => setEditTrack(t => t && ({ ...t, playlist_id: e.target.value || null }))}>
                  <option value="">No playlist</option>
                  {playlists.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label>Display Order</label>
                <input type="number" className="admin-input" value={editTrack.display_order} onChange={e => setEditTrack(t => t && ({ ...t, display_order: Number(e.target.value) }))} />
              </div>
            </div>
            <label className="admin-toggle" style={{ marginBottom: 20 }}>
              <div className={`admin-toggle__track${editTrack.is_active ? ' admin-toggle__track--on' : ''}`} onClick={() => setEditTrack(t => t && ({ ...t, is_active: !t.is_active }))}>
                <div className="admin-toggle__thumb" />
              </div>
              <span className="admin-toggle__label">Active</span>
            </label>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn--ghost" onClick={() => setEditTrack(null)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleUpdateTrack}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTrackItem && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTrackItem(null)}>
          <div className="admin-modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">Delete Track</span>
              <button className="admin-btn admin-btn--ghost admin-btn--icon admin-btn--sm" onClick={() => setDeleteTrackItem(null)}><X size={16} /></button>
            </div>
            <p style={{ color: 'var(--a-text2)', marginBottom: 20, fontSize: 14 }}>
              Delete "<strong style={{ color: 'var(--a-text)' }}>{deleteTrackItem.title}</strong>"?
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteTrackItem(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={handleDeleteTrack}><Trash2 size={14} /> Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Playlist Modal */}
      {showAddPlaylist && (
        <div className="admin-modal-overlay" onClick={() => setShowAddPlaylist(false)}>
          <div className="admin-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">New Playlist</span>
              <button className="admin-btn admin-btn--ghost admin-btn--icon admin-btn--sm" onClick={() => setShowAddPlaylist(false)}><X size={16} /></button>
            </div>
            <div className="admin-form-group">
              <label>Playlist Name *</label>
              <input className="admin-input" value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} placeholder="e.g. Track Driver Music" />
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <input className="admin-input" value={newPlaylistDesc} onChange={e => setNewPlaylistDesc(e.target.value)} placeholder="Optional description" />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="admin-btn admin-btn--ghost" onClick={() => setShowAddPlaylist(false)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleCreatePlaylist}>Create Playlist</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
