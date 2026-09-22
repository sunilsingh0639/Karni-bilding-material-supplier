import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import EnquiryModal from '../components/EnquiryModal';
import { getActiveProducts } from '../services/productService';
import { products as staticProducts } from '../data/products';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import './Products.css';

interface DisplayProduct {
  id: string; name: string; category: string; description: string;
  image: string; available: boolean; unit: string;
}

function toDisplay(p: { id: string; name: string; category: string; description: string; image_url?: string; image?: string; is_active?: boolean; available?: boolean; unit: string; }): DisplayProduct {
  return {
    id: p.id, name: p.name, category: p.category, description: p.description,
    image: p.image_url ?? (p as { image?: string }).image ?? '',
    available: p.is_active ?? (p as { available?: boolean }).available ?? true,
    unit: p.unit,
  };
}

export default function Products() {
  const [cat, setCat] = useState('All');
  const [modal, setModal] = useState(false);
  const [defaultProduct, setDefaultProduct] = useState('');
  const [products, setProducts] = useState<DisplayProduct[]>(staticProducts.map(toDisplay));
  const [categories, setCategories] = useState<string[]>(['All', ...Array.from(new Set(staticProducts.map(p => p.category)))]);
  useScrollRevealAll();

  useEffect(() => {
    getActiveProducts().then(data => {
      if (data.length > 0) {
        setProducts(data.map(toDisplay));
        setCategories(['All', ...Array.from(new Set(data.map(p => p.category)))]);
      }
    }).catch(() => {/* keep static fallback */});
  }, []);

  const filtered = cat === 'All' ? products : products.filter(p => p.category === cat);
  const openEnquiry = (name = '') => { setDefaultProduct(name); setModal(true); };

  return (
    <main className="page-content">
      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Our Products</span>
            <h1>Building Materials</h1>
            <p>Premium quality construction materials for every project need.</p>
          </div>

          <div className="products-filter reveal">
            {categories.map(c => (
              <button key={c} className={`filter-btn${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>

          <div className="grid-4">
            {filtered.map((p, i) => (
              <div key={p.id} className={`reveal reveal-delay-${(i % 4) + 1}`}>
                <ProductCard product={p} onEnquire={openEnquiry} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <EnquiryModal isOpen={modal} onClose={() => setModal(false)} defaultProduct={defaultProduct} />
    </main>
  );
}
