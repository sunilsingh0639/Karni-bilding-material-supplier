import { supabase } from './supabaseClient';
import type { Product } from '../types';
import { products as staticProducts } from '../data/products';

function mapStatic(): Product[] {
  return staticProducts.map((p, i) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    features: p.features,
    image_url: p.image,
    is_active: p.available,
    display_order: i + 1,
    unit: p.unit,
    created_at: '',
    updated_at: '',
  }));
}

export async function getActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) {
    console.warn('getActiveProducts error:', error.message);
    return mapStatic().filter(p => p.is_active);
  }
  if (!data || data.length === 0) return mapStatic().filter(p => p.is_active);
  return data;
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.warn('getAllProducts error:', error.message);
    return mapStatic();
  }
  if (!data || data.length === 0) return mapStatic();
  return data;
}

export async function upsertProduct(product: Partial<Product> & { id?: string }): Promise<void> {
  if (product.id) {
    const { error } = await supabase
      .from('products')
      .update({ ...product, updated_at: new Date().toISOString() })
      .eq('id', product.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('products').insert(product);
    if (error) throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
