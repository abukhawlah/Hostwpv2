import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { trackPageView } from './utils/analytics';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const OurStory = lazy(() => import('./pages/OurStory'));
const Domains = lazy(() => import('./pages/Domains'));
const Contact = lazy(() => import('./pages/Contact'));
const WhiteGloveSupport = lazy(() => import('./pages/WhiteGloveSupport'));

// Legal pages
const Terms = lazy(() => import('./pages/legal/Terms'));
const Privacy = lazy(() => import('./pages/legal/Privacy'));
const FAQ = lazy(() => import('./pages/legal/FAQ'));
const AUP = lazy(() => import('./pages/legal/AUP'));

// Example pages
const SupabaseExample = lazy(() => import('./components/examples/SupabaseExample'));

// Admin Components
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const ServicesManager = lazy(() => import('./components/admin/ServicesManager'));
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="loading-spinner mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// 404 Not Found component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="btn-primary"
        onClick={() => trackPageView('404_to_home')}
      >
        Go Home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Admin Routes - Outside of main layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="projects" element={<div className="p-8 text-center text-gray-500">Projects Manager - Coming Soon</div>} />
            <Route path="case-studies" element={<div className="p-8 text-center text-gray-500">Case Studies Manager - Coming Soon</div>} />
            <Route path="team" element={<div className="p-8 text-center text-gray-500">Team Manager - Coming Soon</div>} />
            <Route path="images" element={<div className="p-8 text-center text-gray-500">Image Manager - Coming Soon</div>} />
            <Route path="products" element={<div className="p-8 text-center text-gray-500">Products Manager - Coming Soon</div>} />
            <Route path="seo" element={<div className="p-8 text-center text-gray-500">SEO Settings - Coming Soon</div>} />
          </Route>

          {/* Public Routes - With main layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                {/* Main pages */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/our-story" element={<OurStory />} />
                <Route path="/domains" element={<Domains />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/white-glove-support" element={<WhiteGloveSupport />} />
                
                {/* Legal pages */}
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/aup" element={<AUP />} />
                
                {/* Example pages */}
                <Route path="/supabase-example" element={<SupabaseExample />} />
                
                {/* 404 catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;