import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { trackPageView } from './utils/analytics';
import { SiteSettingsProvider } from './hooks/useSiteSettings';
import { ApiConfigProvider } from './hooks/useActiveApiConfig';
import AdminDashboard from './components/admin/AdminDashboard';
import ContentManager from './components/admin/ContentManager';
import HostingPlansManager from './components/admin/HostingPlansManager';
import DomainsManager from './components/admin/DomainsManager';
import OrdersManager from './components/admin/OrdersManager';
import CustomersManager from './components/admin/CustomersManager';
import InvoicesManager from './components/admin/InvoicesManager';
import UpmindSettingsManager from './components/admin/UpmindSettingsManager';
import FeaturesManager from './components/admin/FeaturesManager';
import SEOManager from './components/admin/SEOManager';
import SettingsManager from './components/admin/SettingsManager';

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
    <SiteSettingsProvider>
      <ApiConfigProvider>
        <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="hosting-plans" element={<HostingPlansManager />} />
              <Route path="domains" element={<DomainsManager />} />
              <Route path="orders" element={<OrdersManager />} />
              <Route path="customers" element={<CustomersManager />} />
              <Route path="invoices" element={<InvoicesManager />} />
              <Route path="upmind-settings" element={<UpmindSettingsManager />} />
              <Route path="features" element={<FeaturesManager />} />
              <Route path="seo" element={<SEOManager />} />
              <Route path="settings" element={<SettingsManager />} />
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
      </ApiConfigProvider>
    </SiteSettingsProvider>
  );
}

export default App;