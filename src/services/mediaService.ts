import { supabase } from './supabaseClient';
import type { MediaItem } from '../types';

const BUCKET = 'business-media';

export async function getActiveImages(category?: string): Promise<MediaItem[]> {
  let q = supabase
    .from('media')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (category) q = q.eq('category', category);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getAllImages(): Promise<MediaItem[]> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getHeroImages(): Promise<MediaItem[]> {
  return getActiveImages('hero');
}

export async function getGalleryImages(): Promise<MediaItem[]> {
  return getActiveImages('gallery');
}

export async function getFeaturedImages(): Promise<MediaItem[]> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function uploadImage(
  file: File,
  category: string,
  title: string,
  description: string,
  isFeatured: boolean,
  displayOrder: number
): Promise<MediaItem> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `${category}/${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  const { data, error } = await supabase
    .from('media')
    .insert({
      file_name: safeName,
      storage_path: path,
      public_url: publicUrl,
      title,
      description,
      category,
      is_featured: isFeatured,
      is_active: true,
      display_order: displayOrder,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateImage(id: string, updates: Partial<MediaItem>): Promise<void> {
  const { error } = await supabase
    .from('media')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteImage(id: string, storagePath: string): Promise<void> {
  const { error: storageError } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (storageError) console.warn('Storage delete error:', storageError);
  const { error } = await supabase.from('media').delete().eq('id', id);
  if (error) throw error;
}

export async function replaceImageFile(
  id: string,
  oldPath: string,
  newFile: File,
  category: string
): Promise<void> {
  const ext = newFile.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `${category}/${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, newFile, { cacheControl: '3600', upsert: false });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { error } = await supabase
    .from('media')
    .update({
      file_name: safeName,
      storage_path: path,
      public_url: urlData.publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;

  // Remove old file (best-effort)
  await supabase.storage.from(BUCKET).remove([oldPath]).catch(() => {});
}

export async function updateImageOrder(id: string, displayOrder: number): Promise<void> {
  const { error } = await supabase
    .from('media')
    .update({ display_order: displayOrder, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}
