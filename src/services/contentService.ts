import { supabase } from './supabaseClient';
import type { SiteSettings } from '../types';
import { business } from '../data/business';

const DEFAULT_SETTINGS: SiteSettings = {
  id: 'default',
  business_name: business.name,
  owner_name: business.owner,
  phone: business.phone,
  whatsapp: business.whatsapp,
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
    .single();
  if (error || !data) return DEFAULT_SETTINGS;
  return data;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const { data: existing } = await supabase.from('site_settings').select('id').limit(1).single();
  if (existing) {
    const { error } = await supabase
      .from('site_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('site_settings')
      .insert({ ...DEFAULT_SETTINGS, ...settings, updated_at: new Date().toISOString() });
    if (error) throw error;
  }
}

export { DEFAULT_SETTINGS };
