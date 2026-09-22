import { useRef, useState } from 'react';
import { Upload, X, ImageIcon, RefreshCw } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB = 10;
const BUCKET = 'business-media';

export interface UploadResult {
  publicUrl: string;
  storagePath: string;
  fileName: string;
}

interface Props {
  category?: string;
  currentUrl?: string;
  onUploaded: (result: UploadResult) => void;
  onError?: (msg: string) => void;
  compact?: boolean;
}

interface FileInfo {
  file: File;
  preview: string;
  width?: number;
  height?: number;
}

export default function ImageUploader({ category = 'gallery', currentUrl, onUploaded, onError, compact }: Props) {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const err = (msg: string) => { onError?.(msg); };

  const processFile = (file: File) => {
    if (!ALLOWED.includes(file.type)) {
      err('Please select a JPG, PNG or WebP image.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      err(`Image is too large. Maximum size is ${MAX_MB}MB.`);
      return;
    }
    const preview = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setFileInfo({ file, preview, width: img.naturalWidth, height: img.naturalHeight });
    img.src = preview;
    setDone(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleUpload = async () => {
    if (!fileInfo) return;
    setUploading(true); setProgress(10);

    try {
      const ext = fileInfo.file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `${category}/${safeName}`;

      setProgress(30);
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, fileInfo.file, { cacheControl: '3600', upsert: false });

      if (upErr) throw upErr;
      setProgress(80);

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setProgress(100);
      setDone(true);

      onUploaded({ publicUrl: urlData.publicUrl, storagePath: path, fileName: safeName });
    } catch (e) {
      err(e instanceof Error ? e.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clear = () => {
    if (fileInfo?.preview) URL.revokeObjectURL(fileInfo.preview);
    setFileInfo(null); setProgress(0); setDone(false);
  };

  const fmtSize = (b: number) => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;

  if (fileInfo) {
    return (
      <div className="iu-preview-wrap">
        <div className="iu-preview">
          <img src={fileInfo.preview} alt="Preview" className="iu-preview__img" />
          {!uploading && !done && (
            <button className="iu-preview__remove" onClick={clear} title="Remove">
              <X size={14} />
            </button>
          )}
          {done && <div className="iu-preview__done">✓ Uploaded</div>}
        </div>
        <div className="iu-preview__meta">
          <div className="iu-preview__name">{fileInfo.file.name}</div>
          <div className="iu-preview__info">
            {fmtSize(fileInfo.file.size)}
            {fileInfo.width && fileInfo.height && ` · ${fileInfo.width}×${fileInfo.height}`}
          </div>
        </div>
        {uploading && (
          <div className="iu-progress">
            <div className="iu-progress__bar" style={{ width: `${progress}%` }} />
            <span className="iu-progress__label">Uploading… {progress}%</span>
          </div>
        )}
        {!done && (
          <div className="iu-preview__actions">
            <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={clear} disabled={uploading}>
              <RefreshCw size={13} /> Change
            </button>
            <button className="admin-btn admin-btn--primary admin-btn--sm" onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Uploading…' : <><Upload size={13} /> Upload to Cloud</>}
            </button>
          </div>
        )}
        {done && (
          <div className="iu-preview__actions">
            <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={clear}>
              <RefreshCw size={13} /> Replace
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`iu-drop${dragOver ? ' iu-drop--over' : ''}${compact ? ' iu-drop--compact' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => fileRef.current?.click()}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
    >
      <input
        ref={fileRef} type="file"
        accept="image/jpeg,image/png,image/webp"
        capture={undefined}
        style={{ display: 'none' }}
        onChange={e => e.target.files?.[0] && processFile(e.target.files[0])}
      />
      {currentUrl && !compact && (
        <img src={currentUrl} alt="Current" className="iu-drop__current" />
      )}
      <div className="iu-drop__icon">
        <ImageIcon size={compact ? 20 : 28} />
      </div>
      <div className="iu-drop__text">
        {dragOver ? 'Drop image here' : compact ? 'Choose image' : 'Drag & drop or click to choose'}
      </div>
      {!compact && <div className="iu-drop__hint">JPG, PNG, WebP · Max {MAX_MB}MB</div>}
    </div>
  );
}
