import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import { useNavigation } from '../../hooks/useContent';
import { trackButtonClick } from '../../utils/analytics';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const { navigation, loading } = useNavigation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleMobileMenuToggle = () => {
    setIsOpen(!isOpen);
    trackButtonClick('Mobile Menu Toggle', 'header', isOpen ? 'close' : 'open');
  };

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleGetStartedClick = () => {
    trackButtonClick('Get Started', 'header', '/products');
    // Navigate to products page
    window.location.href = '/products';
  };

  if (loading || !navigation) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            onClick={() => trackButtonClick('Logo', 'header', '/')}
          >
            <motion.div
              className="text-2xl lg:text-3xl font-bold text-gradient"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              HostWP
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.main?.map((item, index) => (
              <div key={index} className="relative group">
                {item.dropdown ? (
                  <div className="relative">
                    <button
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                      onMouseEnter={() => setActiveDropdown(index)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === index && (
                        <motion.div
                          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          onMouseEnter={() => setActiveDropdown(index)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          {item.dropdown.map((dropdownItem, dropdownIndex) => (
                            <Link
                              key={dropdownIndex}
                              to={dropdownItem.path}
                              className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                              onClick={() => trackButtonClick(dropdownItem.label, 'header_dropdown', dropdownItem.path)}
                            >
                              <div className="font-medium">{dropdownItem.label}</div>
                              {dropdownItem.description && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {dropdownItem.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 relative ${
                      location.pathname === item.path ? 'text-primary-600' : ''
                    }`}
                    onClick={() => trackButtonClick(item.label, 'header', item.path)}
                  >
                    {item.label}
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600"
                        layoutId="activeTab"
                      />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button
              variant="primary"
              onClick={handleGetStartedClick}
              trackingLabel="Get Started"
              trackingLocation="header_cta"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden border-t border-gray-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="py-4 space-y-2">
                {navigation.main?.map((item, index) => (
                  <div key={index}>
                    {item.dropdown ? (
                      <div>
                        <button
                          className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                          onClick={() => handleDropdownToggle(index)}
                        >
                          <span className="font-medium">{item.label}</span>
                          <motion.div
                            animate={{ rotate: activeDropdown === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {activeDropdown === index && (
                            <motion.div
                              className="bg-gray-50"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.dropdown.map((dropdownItem, dropdownIndex) => (
                                <Link
                                  key={dropdownIndex}
                                  to={dropdownItem.path}
                                  className="block px-8 py-3 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                                  onClick={() => trackButtonClick(dropdownItem.label, 'mobile_dropdown', dropdownItem.path)}
                                >
                                  {dropdownItem.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={`block px-4 py-3 font-medium transition-colors duration-200 ${
                          location.pathname === item.path
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                        }`}
                        onClick={() => trackButtonClick(item.label, 'mobile_menu', item.path)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Mobile CTA */}
                <div className="px-4 pt-4">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleGetStartedClick}
                    trackingLabel="Get Started"
                    trackingLocation="mobile_header_cta"
                  >
                    Get Started
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;