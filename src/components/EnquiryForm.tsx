import { useState } from 'react';
import { X, CheckCircle, Loader, MessageCircle } from 'lucide-react';
import { products } from '../data/products';
import { business } from '../data/business';
import './EnquiryForm.css';

interface EnquiryFormProps {
  isModal?: boolean;
  onClose?: () => void;
  defaultProduct?: string;
}

interface FormData {
  name: string; mobile: string; whatsapp: string; email: string;
  product: string; quantity: string; location: string; deliveryDate: string; message: string;
}

const initial: FormData = { name: '', mobile: '', whatsapp: '', email: '', product: '', quantity: '', location: '', deliveryDate: '', message: '' };

function validate(data: FormData) {
  const errors: Partial<FormData> = {};
  if (!data.name.trim()) errors.name = 'Name is required';
  if (!data.mobile.trim()) errors.mobile = 'Mobile number is required';
  else if (!/^[6-9]\d{9}$/.test(data.mobile.replace(/\s/g, ''))) errors.mobile = 'Enter a valid 10-digit mobile number';
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter a valid email address';
  if (!data.product) errors.product = 'Please select a product';
  if (!data.location.trim()) errors.location = 'Location is required';
  return errors;
}

export default function EnquiryForm({ isModal, onClose, defaultProduct = '' }: EnquiryFormProps) {
  const [form, setForm] = useState<FormData>({ ...initial, product: defaultProduct });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(er => ({ ...er, [k]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus('loading');
    await new Promise(r => setTimeout(r, 1500));
    setStatus('success');
  };

  const handleReset = () => { setForm({ ...initial, product: defaultProduct }); setErrors({}); setStatus('idle'); };

  if (status === 'success') return (
    <div className="enquiry-success">
      {isModal && onClose && <button className="enquiry-close" onClick={onClose}><X size={20} /></button>}
      <CheckCircle size={56} color="var(--accent)" />
      <h3>Enquiry Submitted!</h3>
      <p>Thank you! {business.owner} will contact you shortly on <strong>{business.phone}</strong>.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={handleReset}>Submit Another</button>
        <a href={`https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(business.whatsappMessage)}`}
          className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
          <MessageCircle size={16} /> WhatsApp Now
        </a>
      </div>
    </div>
  );

  return (
    <div className={`enquiry-form-wrap${isModal ? ' enquiry-form-wrap--modal' : ''}`}>
      {isModal && onClose && <button className="enquiry-close" onClick={onClose} aria-label="Close"><X size={20} /></button>}
      <div className="enquiry-form-header">
        <h3>Send Enquiry to {business.owner}</h3>
        <p>Fill in the details and {business.owner} will contact you shortly.</p>
      </div>
      <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="eq-name">Full Name *</label>
            <input id="eq-name" type="text" placeholder="Your name" value={form.name} onChange={set('name')} className={errors.name ? 'error' : ''} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="eq-mobile">Mobile Number *</label>
            <input id="eq-mobile" type="tel" placeholder="10-digit mobile" value={form.mobile} onChange={set('mobile')} className={errors.mobile ? 'error' : ''} maxLength={10} />
            {errors.mobile && <span className="form-error">{errors.mobile}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="eq-whatsapp">WhatsApp Number</label>
            <input id="eq-whatsapp" type="tel" placeholder="WhatsApp number" value={form.whatsapp} onChange={set('whatsapp')} maxLength={10} />
          </div>
          <div className="form-group">
            <label htmlFor="eq-email">Email Address</label>
            <input id="eq-email" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} className={errors.email ? 'error' : ''} />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="eq-product">Product *</label>
            <select id="eq-product" value={form.product} onChange={set('product')} className={errors.product ? 'error' : ''}>
              <option value="">Select product</option>
              {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              <option value="Other">Other</option>
            </select>
            {errors.product && <span className="form-error">{errors.product}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="eq-qty">Quantity</label>
            <input id="eq-qty" type="text" placeholder="e.g. 100 bags, 5 tonne" value={form.quantity} onChange={set('quantity')} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="eq-location">Delivery Location *</label>
            <input id="eq-location" type="text" placeholder="City / Village / Area" value={form.location} onChange={set('location')} className={errors.location ? 'error' : ''} />
            {errors.location && <span className="form-error">{errors.location}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="eq-date">Required Delivery Date</label>
            <input id="eq-date" type="date" value={form.deliveryDate} onChange={set('deliveryDate')} min={new Date().toISOString().split('T')[0]} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="eq-msg">Message</label>
          <textarea id="eq-msg" rows={3} placeholder="Any specific requirements..." value={form.message} onChange={set('message')} />
        </div>
        <button type="submit" className="btn btn-accent btn-lg enquiry-submit" disabled={status === 'loading'}>
          {status === 'loading' ? <><Loader size={18} className="spin" /> Submitting...</> : 'Submit Enquiry'}
        </button>
        {status === 'error' && <p className="form-error" style={{ textAlign: 'center', marginTop: 8 }}>Something went wrong. Please try again.</p>}
      </form>
    </div>
  );
}
