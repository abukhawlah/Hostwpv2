import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const Hero = ({
  headline,
  subheadline,
  description,
  primaryCta,
  secondaryCta,
  onPrimaryClick,
  onSecondaryClick,
  backgroundImage,
  backgroundVideo,
  overlay = true,
  centered = true,
  size = 'large',
  children,
  className = ''
}) => {
  const sizeClasses = {
    small: 'py-16 md:py-20',
    medium: 'py-20 md:py-28',
    large: 'py-24 md:py-32 lg:py-40',
    xl: 'py-32 md:py-40 lg:py-48'
  };

  const textAlignment = centered ? 'text-center' : 'text-left';
  const containerAlignment = centered ? 'items-center' : 'items-start';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className={`relative overflow-hidden ${sizeClasses[size]} ${className}`}>
      {/* Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Background Video */}
      {backgroundVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      {overlay && (backgroundImage || backgroundVideo) && (
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      )}

      {/* Content */}
      <div className="relative z-10">
        <div className="container-custom">
          <motion.div
            className={`flex flex-col ${containerAlignment} ${textAlignment} max-w-5xl ${centered ? 'mx-auto' : ''}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Headline */}
            {headline && (
              <motion.h1
                className={`hero-text mb-6 ${backgroundImage || backgroundVideo ? 'text-white' : 'text-gray-900'}`}
                variants={itemVariants}
              >
                {headline}
              </motion.h1>
            )}

            {/* Subheadline */}
            {subheadline && (
              <motion.p
                className={`text-xl md:text-2xl mb-6 max-w-3xl ${backgroundImage || backgroundVideo ? 'text-gray-200' : 'text-gray-600'} ${centered ? 'mx-auto' : ''}`}
                variants={itemVariants}
              >
                {subheadline}
              </motion.p>
            )}

            {/* Description */}
            {description && (
              <motion.p
                className={`text-lg md:text-xl mb-8 max-w-4xl ${backgroundImage || backgroundVideo ? 'text-gray-300' : 'text-gray-700'} ${centered ? 'mx-auto' : ''}`}
                variants={itemVariants}
              >
                {description}
              </motion.p>
            )}

            {/* CTAs */}
            {(primaryCta || secondaryCta) && (
              <motion.div
                className={`flex flex-col sm:flex-row gap-4 ${centered ? 'justify-center' : 'justify-start'}`}
                variants={itemVariants}
              >
                {primaryCta && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onPrimaryClick}
                    trackingLabel={primaryCta}
                    trackingLocation="hero_primary_cta"
                  >
                    {primaryCta}
                  </Button>
                )}
                
                {secondaryCta && (
                  <Button
                    variant={backgroundImage || backgroundVideo ? "outline" : "secondary"}
                    size="lg"
                    onClick={onSecondaryClick}
                    trackingLabel={secondaryCta}
                    trackingLocation="hero_secondary_cta"
                  >
                    {secondaryCta}
                  </Button>
                )}
              </motion.div>
            )}

            {/* Custom children content */}
            {children && (
              <motion.div
                className="mt-8"
                variants={itemVariants}
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="currentColor"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;