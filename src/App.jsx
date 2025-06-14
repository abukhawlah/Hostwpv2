import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ApiConfigProvider } from './hooks/useActiveApiConfig.jsx';

// Import pages
import Home from './pages/Home';
import Products from './pages/Products';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import WhiteGloveSupport from './pages/WhiteGloveSupport';

// Import admin components
import AdminLayout from './components/admin/AdminLayout';
import OrdersManager from './components/admin/OrdersManager';
import CustomersManager from './components/admin/CustomersManager';
import InvoicesManager from './components/admin/InvoicesManager';
import UpmindSettingsManager from './components/admin/UpmindSettingsManager';

// Import other components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Debug route to test basic functionality */}
            <Route path="/debug" element={
              <div style={{padding: '20px', backgroundColor: 'lightgreen'}}>
                <h1>DEBUG MODE</h1>
                <p>If you see this, React Router is working!</p>
                <p>Time: {new Date().toLocaleString()}</p>
                <a href="/test" style={{color: 'blue'}}>Go to /test</a><br/>
                <a href="/admin/upmind-settings" style={{color: 'blue'}}>Go to /admin/upmind-settings</a>
              </div>
            } />
            
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
              <Route index element={<div className="p-6"><h1>Admin Dashboard</h1><p>Welcome to the admin panel</p></div>} />
              <Route path="orders" element={<OrdersManager />} />
              <Route path="customers" element={<CustomersManager />} />
              <Route path="invoices" element={<InvoicesManager />} />
              <Route path="settings" element={<UpmindSettingsManager />} />
            </Route>
            
            {/* Direct test route bypassing AdminLayout */}
            <Route path="/admin/upmind-settings" element={<UpmindSettingsManager />} />
            
            {/* Ultra basic test route */}
            <Route path="/test" element={<div style={{padding: '20px', backgroundColor: 'yellow'}}><h1>Ultra Basic Test</h1><p>This is just a div with no imports</p></div>} />
          </Routes>
        </div>
      </Router>
  );
}

export default App; 