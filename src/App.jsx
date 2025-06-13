import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ActiveApiConfigProvider } from './hooks/useActiveApiConfig.jsx';

// Import pages
import Home from './pages/Home';
import Products from './pages/Products';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import WhiteGloveSupport from './pages/WhiteGloveSupport';

// Import admin components
import AdminLayout from './components/admin/AdminLayout';
import HostingPlansManager from './components/admin/HostingPlansManager';
import DomainsManager from './components/admin/DomainsManager';
import OrdersManager from './components/admin/OrdersManager';
import CustomersManager from './components/admin/CustomersManager';
import InvoicesManager from './components/admin/InvoicesManager';
import UpmindSettingsManager from './components/admin/UpmindSettingsManager';

// Import other components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <ActiveApiConfigProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            } />
            <Route path="/products" element={
              <>
                <Navbar />
                <Products />
                <Footer />
              </>
            } />
            <Route path="/pricing" element={
              <>
                <Navbar />
                <Pricing />
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Navbar />
                <About />
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navbar />
                <Contact />
                <Footer />
              </>
            } />
            <Route path="/white-glove-support" element={
              <>
                <Navbar />
                <WhiteGloveSupport />
                <Footer />
              </>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<HostingPlansManager />} />
              <Route path="hosting-plans" element={<HostingPlansManager />} />
              <Route path="domains" element={<DomainsManager />} />
              <Route path="orders" element={<OrdersManager />} />
              <Route path="customers" element={<CustomersManager />} />
              <Route path="invoices" element={<InvoicesManager />} />
              <Route path="settings" element={<UpmindSettingsManager />} />
              <Route path="upmind-settings" element={<UpmindSettingsManager />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ActiveApiConfigProvider>
  );
}

export default App; 