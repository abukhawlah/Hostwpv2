import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook } from 'lucide-react';
import { useNavigation } from '../../hooks/useContent';
import { trackButtonClick } from '../../utils/analytics';

const Footer = () => {
  const { navigation, loading } = useNavigation();

  const handleSocialClick = (platform, url) => {
    trackButtonClick(`${platform} Social`, 'footer', url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLinkClick = (label, path) => {
    trackButtonClick(label, 'footer', path);
  };

  const socialIcons = {
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading || !navigation) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="container-custom py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="w-24 h-6 bg-gray-700 rounded animate-pulse" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <motion.div
          className="py-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <Link 
                to="/" 
                className="inline-block mb-6"
                onClick={() => handleLinkClick('Footer Logo', '/')}
              >
                <motion.div
                  className="text-3xl font-bold text-white"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  HostWP
                </motion.div>
              </Link>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Ultra-fast, reliable WordPress hosting with 99.9% uptime guarantee. 
                Get your website online in minutes with our optimized hosting solutions.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Mail className="w-5 h-5 mr-3 text-primary-400" />
                  <a 
                    href="mailto:hello@hostwp.co" 
                    className="hover:text-white transition-colors duration-200"
                    onClick={() => handleLinkClick('Email Contact', 'mailto:hello@hostwp.co')}
                  >
                    hello@hostwp.co
                  </a>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="w-5 h-5 mr-3 text-primary-400" />
                  <a 
                    href="tel:+27875502924" 
                    className="hover:text-white transition-colors duration-200"
                    onClick={() => handleLinkClick('Phone Contact', 'tel:+27875502924')}
                  >
                    +27 87 550 2924
                  </a>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 text-primary-400" />
                  <span>Cape Town, South Africa</span>
                </div>
              </div>
            </motion.div>

            {/* Company Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                {navigation.footer?.company?.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                      onClick={() => handleLinkClick(item.label, item.path)}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Products Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-6">Products</h3>
              <ul className="space-y-3">
                {navigation.footer?.products?.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                      onClick={() => handleLinkClick(item.label, item.path)}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-6">Legal</h3>
              <ul className="space-y-3">
                {navigation.footer?.legal?.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                      onClick={() => handleLinkClick(item.label, item.path)}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Links */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold mb-4 text-gray-400 uppercase tracking-wider">
                  Follow Us
                </h4>
                <div className="flex space-x-4">
                  {navigation.footer?.social?.map((item, index) => {
                    const IconComponent = socialIcons[item.icon];
                    return (
                      <motion.button
                        key={index}
                        className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                        onClick={() => handleSocialClick(item.label, item.url)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5" />}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-800 py-8"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} HostWP. All rights reserved. | v3.1 - {new Date().toISOString().slice(0, 16)}
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>All systems operational</span>
              </div>
              
              <div className="hidden md:block">
                <span>99.9% Uptime SLA</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trust Badges */}
      <motion.div
        className="bg-gray-800 py-6"
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container-custom">
          <div className="flex flex-wrap justify-center items-center space-x-8 opacity-60">
            <div className="text-sm text-gray-400">Trusted by 50,000+ websites</div>
            <div className="text-sm text-gray-400">•</div>
            <div className="text-sm text-gray-400">SSL Secured</div>
            <div className="text-sm text-gray-400">•</div>
            <div className="text-sm text-gray-400">24/7 Support</div>
            <div className="text-sm text-gray-400">•</div>
            <div className="text-sm text-gray-400">Money-back Guarantee</div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;