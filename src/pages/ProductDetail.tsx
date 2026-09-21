import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import { products } from '../data/products';
import { business } from '../data/business';
import EnquiryModal from '../components/EnquiryModal';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const [modal, setModal] = useState(false);

  if (!product) return (
    <main className="page-content">
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Products</Link>
      </div>
    </main>
  );

  const waMsg = encodeURIComponent(`Hello ${business.name}, I am interested in ${product.name}. Please share price and availability.`);

  return (
    <main className="page-content">
      <section className="section">
        <div className="container">
          <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="product-detail__grid">
            <div className="product-detail__img">
              <img src={product.image} alt={product.name} />
              <span className={`badge ${product.available ? 'badge-green' : 'badge-amber'} product-detail__badge`}>
                {product.available ? 'Available' : 'On Request'}
              </span>
            </div>
            <div className="product-detail__info">
              <span className="section-label">{product.category}</span>
              <h1>{product.name}</h1>
              <p className="product-detail__desc">{product.description}</p>
              <div className="product-detail__unit">Unit: <strong>{product.unit}</strong></div>

              <div className="product-detail__features">
                <h4>Key Features</h4>
                <ul>
                  {product.features.map(f => (
                    <li key={f}><CheckCircle size={16} color="var(--accent)" /> {f}</li>
                  ))}
                </ul>
              </div>

              <div className="product-detail__actions">
                <button className="btn btn-accent btn-lg" onClick={() => setModal(true)}>Enquire Now</button>
                <a href={`https://wa.me/${business.whatsapp}?text=${waMsg}`} className="btn btn-whatsapp btn-lg" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a href={`tel:${business.phone}`} className="btn btn-call btn-lg">
                  <Phone size={18} /> Call Now
                </a>
              </div>
            </div>
          </div>

          {/* Related */}
          <div className="product-detail__related">
            <h3>Other Products</h3>
            <div className="product-detail__related-grid">
              {products.filter(p => p.id !== id).slice(0, 4).map(p => (
                <Link key={p.id} to={`/products/${p.id}`} className="related-card card">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  <div className="related-card__body">
                    <span>{p.name}</span>
                    <span className="related-card__cat">{p.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <EnquiryModal isOpen={modal} onClose={() => setModal(false)} defaultProduct={product.name} />
    </main>
  );
}
