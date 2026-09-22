import { supabase } from './supabaseClient';
import type { Enquiry } from '../types';

export async function submitEnquiry(data: Omit<Enquiry, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<void> {
  const { error } = await supabase.from('enquiries').insert({ ...data, status: 'new' });
  if (error) throw error;
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateEnquiryStatus(id: string, status: Enquiry['status']): Promise<void> {
  const { error } = await supabase
    .from('enquiries')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}
