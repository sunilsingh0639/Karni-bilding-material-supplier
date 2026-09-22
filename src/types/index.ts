export interface MediaItem {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  title: string;
  description: string;
  category: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface MusicTrackDB {
  id: string;
  youtube_video_id: string;
  title: string;
  channel_name: string;
  thumbnail_url: string;
  duration: string;
  category: string;
  playlist_id: string | null;
  display_order: number;
  is_active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description: string;
  cover_image: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  image_url: string;
  is_active: boolean;
  display_order: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  mobile: string;
  whatsapp: string;
  email: string;
  product: string;
  quantity: string;
  location: string;
  delivery_date: string;
  message: string;
  status: 'new' | 'contacted' | 'completed' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  contact_text: string;
  footer_text: string;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
}
