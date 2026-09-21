export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

// Replace these with actual business photos.
// Add real photos to /public/assets/images/ and update src paths.
// Example: src: '/assets/images/rodi-pile-1.jpg'
export const galleryImages: GalleryImage[] = [
  { id: 'g1',  src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80', alt: 'Rodi aggregate pile at yard', category: 'Rodi' },
  { id: 'g2',  src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', alt: 'Bajri fine aggregate supply', category: 'Bajri' },
  { id: 'g3',  src: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80', alt: 'Truck loaded with Rodi material', category: 'Truck' },
  { id: 'g4',  src: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80', alt: 'Truck unloading material at site', category: 'Delivery' },
  { id: 'g5',  src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: 'Stone aggregate Rodi close-up', category: 'Rodi' },
  { id: 'g6',  src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80', alt: 'Bajri gravel material pile', category: 'Bajri' },
  { id: 'g7',  src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80', alt: 'Construction site material delivery', category: 'Delivery' },
  { id: 'g8',  src: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80', alt: 'Material storage yard', category: 'Material' },
  { id: 'g9',  src: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80', alt: 'Construction material yard Rajasthan', category: 'Material' },
  { id: 'g10', src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', alt: 'Building construction site', category: 'Construction Site' },
  { id: 'g11', src: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80', alt: 'Heavy truck at supplier yard', category: 'Truck' },
  { id: 'g12', src: 'https://images.unsplash.com/photo-1587582345426-bf07f534b9c4?w=800&q=80', alt: 'Construction material loading', category: 'Delivery' },
];

export const galleryCategories = ['All', 'Rodi', 'Bajri', 'Truck', 'Delivery', 'Material', 'Construction Site'];
