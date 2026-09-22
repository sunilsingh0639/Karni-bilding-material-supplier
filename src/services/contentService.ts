import { supabase } from './supabaseClient';
import type { SiteSettings } from '../types';
import { business } from '../data/business';

const DEFAULT_SETTINGS: SiteSettings = {
  id: 'default',
  business_name: business.name,
  owner_name: business.owner,
  phone: business.phone,
  whatsapp: business.whatsapp,
  email: business.email,
  address: business.address,
  hero_title: 'Karni Building\nMaterial Supplier',
  hero_subtitle: business.tagline,
  about_text: `${business.owner} — Karni Building Material Supplier is committed to providing premium quality Rodi, Bajri and construction materials to builders, contractors and homeowners across Churu, Rajasthan.`,
  contact_text: 'Contact us for quick pricing and delivery to your site.',
  footer_text: `© ${new Date().getFullYear()} Karni Building Material Supplier. All rights reserved.`,
  updated_at: new Date().toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) {
    console.warn('getSiteSettings error:', error.message);
    return DEFAULT_SETTINGS;
  }
  if (!data) return DEFAULT_SETTINGS;
  // Merge so any missing columns fall back to defaults
  return { ...DEFAULT_SETTINGS, ...data };
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  // Fetch existing row id (UUID)
  const { data: existing, error: fetchErr } = await supabase
    .from('site_settings')
    .select('id')
    .limit(1)
    .maybeSingle();
  if (fetchErr) throw fetchErr;

  // Strip the local 'default' sentinel id before writing
  const { id: _omit, ...payload } = settings as SiteSettings;
  const ts = { ...payload, updated_at: new Date().toISOString() };

  if (existing?.id) {
    const { error } = await supabase
      .from('site_settings')
      .update(ts)
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    // No row yet — insert without the fake 'default' id so DB generates a UUID
    const { id: _omit2, ...defaults } = DEFAULT_SETTINGS;
    const { error } = await supabase
      .from('site_settings')
      .insert({ ...defaults, ...ts });
    if (error) throw error;
  }
}

export { DEFAULT_SETTINGS };
