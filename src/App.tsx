import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import ProtectedRoute from './admin/components/ProtectedRoute';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import './styles/globals.css';

// Public pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const About = lazy(() => import('./pages/About'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Videos = lazy(() => import('./pages/Videos'));
const Enquiry = lazy(() => import('./pages/Enquiry'));
const TrackDriverMusic = lazy(() => import('./pages/TrackDriverMusic'));
const Bhojpuri = lazy(() => import('./pages/GhasiBhojpuri'));

// Admin pages
const AdminLogin = lazy(() => import('./admin/Login/Login'));
const AdminDashboard = lazy(() => import('./admin/Dashboard/Dashboard'));
const AdminImages = lazy(() => import('./admin/Images/Images'));
const AdminMusic = lazy(() => import('./admin/Music/Music'));
const AdminContent = lazy(() => import('./admin/Content/Content'));
const AdminProducts = lazy(() => import('./admin/Products/Products'));
const AdminEnquiries = lazy(() => import('./admin/Enquiries/Enquiries'));
const AdminSettings = lazy(() => import('./admin/Settings/Settings'));

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

function AdminLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #222', borderTopColor: '#d4a017', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteSettingsProvider>
        <Routes>
          {/* Admin routes — no public header/footer */}
        <Route path="/admin/login" element={<Suspense fallback={<AdminLoader />}><AdminLogin /></Suspense>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><AdminDashboard /></Suspense></ProtectedRoute>} />
        <Route path="/admin/images" element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><AdminImages /></Suspense></ProtectedRoute>} />
        <Route path="/admin/music" element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><AdminMusic /></Suspense></ProtectedRoute>} />
        <Route path="/admin/content" element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><AdminContent /></Suspense></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><AdminProducts /></Suspense></ProtectedRoute>} />
        <Route path="/admin/enquiries" element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><AdminEnquiries /></Suspense></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><Suspense fallback={<AdminLoader />}><AdminSettings /></Suspense></ProtectedRoute>} />

        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/videos" element={<PublicLayout><Videos /></PublicLayout>} />
        <Route path="/enquiry" element={<PublicLayout><Enquiry /></PublicLayout>} />
        <Route path="/track-driver-music" element={<PublicLayout><TrackDriverMusic /></PublicLayout>} />
        <Route path="/ghasi-bhojpuri" element={<PublicLayout><Bhojpuri /></PublicLayout>} />
        <Route path="*" element={
          <PublicLayout>
            <main className="page-content">
              <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
                <h2>Page Not Found</h2>
                <a href="/" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>Go Home</a>
              </div>
            </main>
          </PublicLayout>
        } />
        </Routes>
      </SiteSettingsProvider>
    </BrowserRouter>
  );
}
