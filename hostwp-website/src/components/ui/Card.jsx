import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
  padding = 'default',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-xl transition-all duration-300';
  
  const variants = {
    default: 'shadow-lg hover:shadow-xl',
    elevated: 'shadow-xl hover:shadow-2xl',
    bordered: 'border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md',
    flat: 'shadow-none border border-gray-100',
    gradient: 'bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const hoverEffect = hover ? 'transform hover:-translate-y-1' : '';
  const clickable = onClick ? 'cursor-pointer' : '';

  const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${hoverEffect} ${clickable} ${className}`;

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: hover ? {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    } : {}
  };

  return (
    <motion.div
      className={classes}
      onClick={onClick}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Card Header component
export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

// Card Body component
export const CardBody = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

// Card Footer component
export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

// Card Title component
export const CardTitle = ({ children, size = 'default', className = '' }) => {
  const sizes = {
    sm: 'text-lg font-semibold',
    default: 'text-xl font-bold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold'
  };

  return (
    <h3 className={`text-gray-900 ${sizes[size]} ${className}`}>
      {children}
    </h3>
  );
};

// Card Description component
export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-600 ${className}`}>
    {children}
  </p>
);

export default Card;