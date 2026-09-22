-- ============================================================
-- KARNI BUILDING MATERIAL SUPPLIER - Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (admin role management)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT DEFAULT 'Karni Building Material Supplier',
  owner_name TEXT DEFAULT 'Ganveer Singh',
  phone TEXT DEFAULT '8003293523',
  whatsapp TEXT DEFAULT '8003293523',
  address TEXT DEFAULT 'Gaav Parsneu, Churu, Rajasthan - 331802',
  hero_title TEXT DEFAULT 'Karni Building Material Supplier',
  hero_subtitle TEXT DEFAULT 'Quality Rodi, Bajri & Building Materials Delivered to Your Location',
  about_text TEXT DEFAULT 'Karni Building Material Supplier is committed to providing premium quality Rodi, Bajri and construction materials.',
  contact_text TEXT DEFAULT 'Contact us for quick pricing and delivery to your site.',
  footer_text TEXT DEFAULT '© 2025 Karni Building Material Supplier. All rights reserved.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update site settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO site_settings (business_name, owner_name, phone, whatsapp, address)
VALUES ('Karni Building Material Supplier', 'Ganveer Singh', '8003293523', '8003293523', 'Gaav Parsneu, Churu, Rajasthan - 331802')
ON CONFLICT DO NOTHING;

-- ============================================================
-- MEDIA (images)
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'gallery',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);
CREATE INDEX IF NOT EXISTS idx_media_active ON media(is_active);
CREATE INDEX IF NOT EXISTS idx_media_order ON media(display_order);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active media" ON media
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage media" ON media
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  features JSONB DEFAULT '[]',
  image_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  unit TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_order ON products(display_order);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- MUSIC PLAYLISTS
-- ============================================================
CREATE TABLE IF NOT EXISTS music_playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE music_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active playlists" ON music_playlists
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage playlists" ON music_playlists
  FOR ALL USING (auth.role() = 'authenticated');

-- Seed default playlists
INSERT INTO music_playlists (name, description, display_order)
VALUES
  ('Track Driver Music', 'Music for the road — Rajasthani and folk songs for truck drivers', 1),
  ('Ghasi Bhojpuri', 'Bhojpuri hits and folk songs', 2)
ON CONFLICT DO NOTHING;

-- ============================================================
-- MUSIC TRACKS
-- ============================================================
CREATE TABLE IF NOT EXISTS music_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  channel_name TEXT DEFAULT '',
  thumbnail_url TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  category TEXT DEFAULT 'general',
  playlist_id UUID REFERENCES music_playlists(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracks_playlist ON music_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_active ON music_tracks(is_active);
CREATE INDEX IF NOT EXISTS idx_tracks_order ON music_tracks(display_order);

ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active tracks" ON music_tracks
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage tracks" ON music_tracks
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- ENQUIRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  whatsapp TEXT DEFAULT '',
  email TEXT DEFAULT '',
  product TEXT NOT NULL,
  quantity TEXT DEFAULT '',
  location TEXT NOT NULL,
  delivery_date TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert enquiries" ON enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read and manage enquiries" ON enquiries
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET SETUP (run separately or via Supabase dashboard)
-- ============================================================
-- Create bucket: business-media (public)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('business-media', 'business-media', true);

-- Storage policies (run in SQL editor):
-- CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'business-media');
-- CREATE POLICY "Auth upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'business-media' AND auth.role() = 'authenticated');
-- CREATE POLICY "Auth update" ON storage.objects FOR UPDATE USING (bucket_id = 'business-media' AND auth.role() = 'authenticated');
-- CREATE POLICY "Auth delete" ON storage.objects FOR DELETE USING (bucket_id = 'business-media' AND auth.role() = 'authenticated');
