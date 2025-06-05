import React from 'react';
import { motion } from 'framer-motion';
import { trackButtonClick } from '../../utils/analytics';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  disabled = false,
  loading = false,
  className = '',
  trackingLabel,
  trackingLocation,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 hover:scale-105 hover:shadow-lg',
    secondary: 'bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 focus:ring-primary-500 hover:scale-105',
    ghost: 'bg-transparent hover:bg-primary-50 text-primary-600 focus:ring-primary-500',
    outline: 'bg-transparent hover:bg-primary-600 text-primary-600 hover:text-white border-2 border-primary-600 focus:ring-primary-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 hover:scale-105 hover:shadow-lg',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 hover:scale-105 hover:shadow-lg'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }

    // Track button click
    if (trackingLabel && trackingLocation) {
      trackButtonClick(trackingLabel, trackingLocation, href);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const buttonContent = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className="w-5 h-5 mr-2" />
      )}
      
      <span>{children}</span>
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className="w-5 h-5 ml-2" />
      )}
    </>
  );

  const MotionComponent = motion.button;

  if (href && !disabled) {
    return (
      <motion.a
        href={href}
        className={classes}
        onClick={handleClick}
        whileHover={{ scale: variant === 'ghost' ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <MotionComponent
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading || variant === 'ghost' ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      {...props}
    >
      {buttonContent}
    </MotionComponent>
  );
};

export default Button;