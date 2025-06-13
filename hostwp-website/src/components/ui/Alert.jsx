import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const Alert = ({
  children,
  variant = 'info',
  dismissible = false,
  onDismiss,
  className = '',
  icon: CustomIcon,
  title,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-400',
      iconComponent: Info
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-400',
      iconComponent: CheckCircle
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-400',
      iconComponent: AlertTriangle
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-400',
      iconComponent: XCircle
    }
  };

  const currentVariant = variants[variant];
  const IconComponent = CustomIcon || currentVariant.iconComponent;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const alertVariants = {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`border rounded-lg p-4 ${currentVariant.container} ${className}`}
          variants={alertVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          {...props}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <IconComponent className={`h-5 w-5 ${currentVariant.icon}`} />
            </div>
            <div className="ml-3 flex-1">
              {title && (
                <h3 className="text-sm font-medium mb-1">
                  {title}
                </h3>
              )}
              <div className="text-sm">
                {children}
              </div>
            </div>
            {dismissible && (
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-opacity-20 hover:bg-gray-600 ${currentVariant.icon}`}
                    onClick={handleDismiss}
                  >
                    <span className="sr-only">Dismiss</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert; 