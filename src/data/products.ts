export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  image: string;
  available: boolean;
  unit: string;
}

// Replace image src values with actual business photos.
// Add photos to /public/assets/images/ and update paths.
export const products: Product[] = [
  {
    id: 'rodi',
    name: 'Rodi (Stone Aggregate)',
    category: 'Aggregate',
    description: 'Premium quality crushed stone Rodi for concrete, RCC work, foundations and road construction. Available in multiple sizes.',
    features: ['Multiple sizes: 6mm, 10mm, 20mm', 'High compressive strength', 'Clean & washed', 'Bulk truck supply available'],
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
    available: true,
    unit: 'Cubic Feet / Tractor / Truck',
  },
  {
    id: 'bajri',
    name: 'Bajri (Fine Gravel)',
    category: 'Aggregate',
    description: 'Clean, well-graded Bajri for concrete mixing, plastering base and road sub-base. Sourced locally from Rajasthan.',
    features: ['Well graded', 'Low silt content', 'Suitable for all construction', 'Bulk supply available'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    available: true,
    unit: 'Cubic Feet / Tractor / Truck',
  },
  {
    id: 'sand',
    name: 'Sand (Reti / Baalu)',
    category: 'Aggregate',
    description: 'Clean river sand ideal for plastering, masonry and concrete work. Low silt content for better bonding.',
    features: ['Washed & graded', 'Low silt content', 'Suitable for plastering & concrete', 'Bulk supply available'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    available: true,
    unit: 'Cubic Feet / Tractor',
  },
  {
    id: 'stone',
    name: 'Stone (Pathar)',
    category: 'Aggregate',
    description: 'Natural and crushed stone for foundations, flooring and construction. Rajasthan stone available.',
    features: ['Multiple sizes', 'High durability', 'Locally sourced', 'Rajasthan stone available'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    available: true,
    unit: 'Cubic Feet / Tractor',
  },
  {
    id: 'cement',
    name: 'Cement',
    category: 'Binding Materials',
    description: 'Premium quality cement for residential and commercial construction. Multiple brands and grades available.',
    features: ['High compressive strength', 'Fast setting', 'Weather resistant', 'Multiple grades available'],
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
    available: true,
    unit: 'Bag / Tonne',
  },
  {
    id: 'bricks',
    name: 'Bricks (Eent)',
    category: 'Masonry',
    description: 'High-quality fired clay bricks for walls, foundations and structural masonry work.',
    features: ['Uniform size', 'High compressive strength', 'Low water absorption', 'Bulk orders accepted'],
    image: 'https://images.unsplash.com/photo-1587582345426-bf07f534b9c4?w=600&q=80',
    available: true,
    unit: 'Per 1000 Pieces',
  },
  {
    id: 'tmt-steel',
    name: 'TMT Steel Bars',
    category: 'Steel',
    description: 'High-strength TMT steel bars for RCC construction, columns, beams and slabs.',
    features: ['Fe 500/550 grade', 'Earthquake resistant', 'Corrosion resistant', 'Multiple diameters'],
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    available: true,
    unit: 'Kg / Tonne',
  },
  {
    id: 'tiles',
    name: 'Tiles',
    category: 'Flooring',
    description: 'Premium ceramic and vitrified tiles for flooring, walls and exterior cladding.',
    features: ['Multiple designs', 'Anti-skid options', 'Easy maintenance', 'Bulk discounts'],
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600&q=80',
    available: true,
    unit: 'Per Box / Sq. Ft.',
  },
];
