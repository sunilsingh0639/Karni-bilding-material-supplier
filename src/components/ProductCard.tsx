import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import './ProductCard.css';

interface ProductDisplay {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  available: boolean;
  unit: string;
}

interface Props { product: ProductDisplay; onEnquire: (name: string) => void; }

export default function ProductCard({ product, onEnquire }: Props) {
  const settings = useSiteSettings();
  const waMsg = encodeURIComponent(`Hello ${settings.business_name}, I am interested in ${product.name}. Please share price and availability.`);

  return (
    <article className="product-card card">
      <Link to={`/products/${product.id}`} className="product-card__img-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className={`badge ${product.available ? 'badge-green' : 'badge-amber'} product-card__badge`}>
          {product.available ? 'Available' : 'On Request'}
        </span>
      </Link>
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-card__desc">{product.description}</p>
        <div className="product-card__unit">Unit: {product.unit}</div>
        <div className="product-card__actions">
          <button className="btn btn-primary btn-sm" onClick={() => onEnquire(product.name)}>
            Enquire Now
          </button>
          <a href={`https://wa.me/${settings.whatsapp}?text=${waMsg}`} className="btn btn-whatsapp btn-sm" target="_blank" rel="noopener noreferrer">
            <MessageCircle size={14} />
          </a>
          <Link to={`/products/${product.id}`} className="btn btn-ghost btn-sm product-card__detail-btn">
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
