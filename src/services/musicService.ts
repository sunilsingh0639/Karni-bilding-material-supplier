import { supabase } from './supabaseClient';
import type { MusicTrackDB, MusicPlaylist } from '../types';

export async function getPlaylists(): Promise<MusicPlaylist[]> {
  const { data, error } = await supabase
    .from('music_playlists')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getAllPlaylists(): Promise<MusicPlaylist[]> {
  const { data, error } = await supabase
    .from('music_playlists')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getTracksByPlaylist(playlistId: string): Promise<MusicTrackDB[]> {
  const { data, error } = await supabase
    .from('music_tracks')
    .select('*')
    .eq('playlist_id', playlistId)
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getAllTracks(): Promise<MusicTrackDB[]> {
  const { data, error } = await supabase
    .from('music_tracks')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addTrack(track: Omit<MusicTrackDB, 'id' | 'created_at' | 'updated_at'>): Promise<MusicTrackDB> {
  const { data, error } = await supabase
    .from('music_tracks')
    .insert(track)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTrack(id: string, updates: Partial<MusicTrackDB>): Promise<void> {
  const { error } = await supabase
    .from('music_tracks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteTrack(id: string): Promise<void> {
  const { error } = await supabase.from('music_tracks').delete().eq('id', id);
  if (error) throw error;
}

export async function createPlaylist(playlist: Omit<MusicPlaylist, 'id' | 'created_at' | 'updated_at'>): Promise<MusicPlaylist> {
  const { data, error } = await supabase
    .from('music_playlists')
    .insert(playlist)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePlaylist(id: string, updates: Partial<MusicPlaylist>): Promise<void> {
  const { error } = await supabase
    .from('music_playlists')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deletePlaylist(id: string): Promise<void> {
  const { error } = await supabase.from('music_playlists').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchYouTubeVideoInfo(videoId: string): Promise<{ title: string; channel: string; thumbnail: string; duration: string }> {
  const res = await fetch(`/.netlify/functions/youtube-search?videoId=${encodeURIComponent(videoId)}`);
  if (!res.ok) throw new Error('Failed to fetch video info');
  const data = await res.json();
  return data;
}
