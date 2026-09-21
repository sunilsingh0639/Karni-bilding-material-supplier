import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import EnquiryModal from '../components/EnquiryModal';
import { products } from '../data/products';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import './Products.css';

const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

export default function Products() {
  const [cat, setCat] = useState('All');
  const [modal, setModal] = useState(false);
  const [defaultProduct, setDefaultProduct] = useState('');
  useScrollRevealAll();

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
