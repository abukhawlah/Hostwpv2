import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { initScrollTracking, initPerformanceTracking, trackPageView } from '../../utils/analytics';

const Layout = ({ children }) => {
  const location = useLocation();

  // Initialize analytics and tracking
  useEffect(() => {
    // Initialize scroll depth tracking
    const cleanupScrollTracking = initScrollTracking();
    
    // Initialize performance tracking
    initPerformanceTracking();

    return cleanupScrollTracking;
  }, []);

  // Track page views
  useEffect(() => {
    const pageName = location.pathname === '/' ? 'home' : location.pathname.slice(1);
    trackPageView(pageName);
  }, [location]);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: -20
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16 lg:pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;