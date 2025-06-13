import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Accordion = ({
  children,
  allowMultiple = false,
  defaultOpen = [],
  className = '',
  variant = 'default',
  ...props
}) => {
  const [openItems, setOpenItems] = useState(
    Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen].filter(Boolean)
  );

  const variants = {
    default: {
      container: 'border border-gray-200 rounded-lg divide-y divide-gray-200',
      item: '',
      header: 'px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200',
      content: 'px-6 py-4 bg-white'
    },
    minimal: {
      container: 'space-y-2',
      item: 'border-b border-gray-200 last:border-b-0',
      header: 'py-4 hover:bg-gray-50 transition-colors duration-200',
      content: 'pb-4'
    },
    card: {
      container: 'space-y-4',
      item: 'border border-gray-200 rounded-lg shadow-sm',
      header: 'px-6 py-4 bg-white hover:bg-gray-50 transition-colors duration-200',
      content: 'px-6 py-4 bg-gray-50'
    }
  };

  const currentVariant = variants[variant];

  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems(prev => 
        prev.includes(index) ? [] : [index]
      );
    }
  };

  const isOpen = (index) => openItems.includes(index);

  return (
    <div className={`${currentVariant.container} ${className}`} {...props}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className={currentVariant.item}>
          {React.cloneElement(child, {
            isOpen: isOpen(index),
            onToggle: () => toggleItem(index),
            variant: currentVariant,
            index
          })}
        </div>
      ))}
    </div>
  );
};

const AccordionItem = ({
  children,
  title,
  icon: Icon,
  isOpen,
  onToggle,
  variant,
  index,
  disabled = false,
  ...props
}) => {
  const headerVariants = {
    closed: { backgroundColor: 'transparent' },
    open: { backgroundColor: 'rgba(0, 0, 0, 0.02)' }
  };

  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 }
  };

  const contentVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: {
          duration: 0.3,
          ease: "easeInOut"
        },
        opacity: {
          duration: 0.2,
          ease: "easeInOut"
        }
      }
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: {
          duration: 0.3,
          ease: "easeInOut"
        },
        opacity: {
          duration: 0.3,
          delay: 0.1,
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <div {...props}>
      {/* Header */}
      <motion.button
        className={`w-full text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset ${variant.header} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={disabled ? undefined : onToggle}
        variants={headerVariants}
        animate={isOpen ? 'open' : 'closed'}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${index}`}
      >
        <div className="flex items-center">
          {Icon && (
            <Icon className="w-5 h-5 mr-3 text-gray-500" />
          )}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        
        <motion.div
          variants={iconVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </motion.button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
            id={`accordion-content-${index}`}
          >
            <div className={variant.content}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { AccordionItem };
export default Accordion; 