import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tabs = ({
  children,
  defaultTab = 0,
  onChange,
  variant = 'default',
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef([]);

  const variants = {
    default: {
      container: 'border-b border-gray-200',
      tab: 'px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700',
      activeTab: 'text-primary-600',
      underline: 'bg-primary-600'
    },
    pills: {
      container: 'bg-gray-100 rounded-lg p-1',
      tab: 'px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none rounded-md transition-colors duration-200',
      activeTab: 'bg-white text-gray-900 shadow-sm',
      underline: 'hidden'
    },
    underline: {
      container: '',
      tab: 'px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700',
      activeTab: 'text-primary-600',
      underline: 'bg-primary-600'
    }
  };

  const currentVariant = variants[variant];

  useEffect(() => {
    if (variant !== 'pills' && tabsRef.current[activeTab]) {
      setTabUnderlineLeft(tabsRef.current[activeTab].offsetLeft);
      setTabUnderlineWidth(tabsRef.current[activeTab].getBoundingClientRect().width);
    }
  }, [activeTab, variant]);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabClick(index);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      handleTabClick(index - 1);
      tabsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < React.Children.count(children) - 1) {
      e.preventDefault();
      handleTabClick(index + 1);
      tabsRef.current[index + 1]?.focus();
    }
  };

  const tabVariants = {
    inactive: { opacity: 0.7 },
    active: { opacity: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className={className} {...props}>
      {/* Tab Headers */}
      <div className={`relative ${currentVariant.container}`}>
        <div className="flex space-x-1">
          {React.Children.map(children, (child, index) => (
            <button
              key={index}
              ref={(el) => (tabsRef.current[index] = el)}
              className={`${currentVariant.tab} ${
                activeTab === index ? currentVariant.activeTab : ''
              }`}
              onClick={() => handleTabClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              role="tab"
              aria-selected={activeTab === index}
              aria-controls={`tabpanel-${index}`}
              tabIndex={activeTab === index ? 0 : -1}
            >
              <motion.span
                variants={tabVariants}
                animate={activeTab === index ? 'active' : 'inactive'}
              >
                {child.props.label}
              </motion.span>
            </button>
          ))}
        </div>

        {/* Animated Underline */}
        {variant !== 'pills' && (
          <motion.div
            className={`absolute bottom-0 h-0.5 ${currentVariant.underline}`}
            animate={{
              left: tabUnderlineLeft,
              width: tabUnderlineWidth,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {React.Children.toArray(children)[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Tab Panel component
export const TabPanel = ({ children, label, ...props }) => (
  <div {...props}>
    {children}
  </div>
);

export default Tabs; 