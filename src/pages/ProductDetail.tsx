import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import { getActiveProducts } from '../services/productService';
import { products as staticProducts } from '../data/products';
import { useSiteSettings } from '../context/SiteSettingsContext';
import EnquiryModal from '../components/EnquiryModal';
import './ProductDetail.css';

interface DisplayProduct {
  id: string; name: string; category: string; description: string;
  features: string[]; image: string; available: boolean; unit: string;
}

function toDisplay(p: { id: string; name: string; category: string; description: string; features: string[]; image_url?: string; image?: string; is_active?: boolean; available?: boolean; unit: string; }): DisplayProduct {
  return {
    id: p.id, name: p.name, category: p.category, description: p.description,
    features: p.features ?? [],
    image: p.image_url ?? (p as { image?: string }).image ?? '',
    available: p.is_active ?? (p as { available?: boolean }).available ?? true,
    unit: p.unit,
  };
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const settings = useSiteSettings();
  const [product, setProduct] = useState<DisplayProduct | null>(null);
  const [allProducts, setAllProducts] = useState<DisplayProduct[]>(staticProducts.map(toDisplay));
  const [modal, setModal] = useState(false);

  useEffect(() => {
    getActiveProducts().then(data => {
      if (data.length > 0) {
        const mapped = data.map(toDisplay);
        setAllProducts(mapped);
        const found = mapped.find(p => p.id === id);
        setProduct(found ?? null);
      } else {
        const found = staticProducts.map(toDisplay).find(p => p.id === id);
        setProduct(found ?? null);
      }
    }).catch(() => {
      const found = staticProducts.map(toDisplay).find(p => p.id === id);
      setProduct(found ?? null);
    });
  }, [id]);

  // Also set from static while loading
  useEffect(() => {
    if (product === null) {
      const found = staticProducts.map(toDisplay).find(p => p.id === id);
      if (found) setProduct(found);
    }
  }, [id, product]);

  if (!product) return (
    <main className="page-content">
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Products</Link>
      </div>
    </main>
  );

  const waMsg = encodeURIComponent(`Hello ${settings.business_name}, I am interested in ${product.name}. Please share price and availability.`);

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

              {product.features.length > 0 && (
                <div className="product-detail__features">
                  <h4>Key Features</h4>
                  <ul>
                    {product.features.map(f => (
                      <li key={f}><CheckCircle size={16} color="var(--accent)" /> {f}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="product-detail__actions">
                <button className="btn btn-accent btn-lg" onClick={() => setModal(true)}>Enquire Now</button>
                <a href={`https://wa.me/${settings.whatsapp}?text=${waMsg}`} className="btn btn-whatsapp btn-lg" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a href={`tel:${settings.phone}`} className="btn btn-call btn-lg">
                  <Phone size={18} /> Call Now
                </a>
              </div>
            </div>
          </div>

          {/* Related */}
          <div className="product-detail__related">
            <h3>Other Products</h3>
            <div className="product-detail__related-grid">
              {allProducts.filter(p => p.id !== id).slice(0, 4).map(p => (
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
