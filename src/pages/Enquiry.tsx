import EnquiryForm from '../components/EnquiryForm';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import './Enquiry.css';

export default function Enquiry() {
  useScrollRevealAll();
  return (
    <main className="page-content">
      <section className="section">
        <div className="container">
          <div className="enquiry-page">
            <div className="enquiry-page__header reveal">
              <span className="section-label">Contact Us</span>
              <h1>Send an Enquiry</h1>
              <p>Fill in the form below and we'll get back to you with pricing and availability.</p>
            </div>
            <div className="enquiry-page__form reveal reveal-delay-2">
              <div className="card" style={{ padding: '32px' }}>
                <EnquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
