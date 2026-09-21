import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import './styles/globals.css';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const About = lazy(() => import('./pages/About'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Videos = lazy(() => import('./pages/Videos'));
const Enquiry = lazy(() => import('./pages/Enquiry'));
const TrackDriverMusic = lazy(() => import('./pages/TrackDriverMusic'));
const GhasiBhojpuri = lazy(() => import('./pages/GhasiBhojpuri'));

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/track-driver-music" element={<TrackDriverMusic />} />
          <Route path="/ghasi-bhojpuri" element={<GhasiBhojpuri />} />
          <Route path="*" element={
            <main className="page-content">
              <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
                <h2>Page Not Found</h2>
                <a href="/" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>Go Home</a>
              </div>
            </main>
          } />
        </Routes>
      </Suspense>
      <Footer />
      <MobileBottomNav />
    </BrowserRouter>
  );
}
