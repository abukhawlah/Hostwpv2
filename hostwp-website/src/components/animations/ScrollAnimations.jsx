import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Fade in animation on scroll
export const FadeInOnScroll = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.6,
  className = '' 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 }
  };

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          duration,
          delay,
          ease: "easeOut"
        }
      });
    }
  }, [isInView, controls, delay, duration]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      animate={controls}
    >
      {children}
    </motion.div>
  );
};

// Stagger children animation
export const StaggerChildren = ({ 
  children, 
  staggerDelay = 0.1, 
  className = '' 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
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
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Counter animation
export const AnimatedCounter = ({ 
  end, 
  duration = 2, 
  suffix = '', 
  prefix = '',
  className = '' 
}) => {
  const ref = useRef(null);
  const [count, setCount] = React.useState(0);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;

      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * end);
        
        setCount(currentCount);

        if (now < endTime) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Parallax component using GSAP
export const ParallaxElement = ({ 
  children, 
  speed = 0.5, 
  direction = 'vertical',
  className = '' 
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    if (direction === 'vertical') {
      tl.fromTo(element, 
        { y: -100 * speed },
        { y: 100 * speed, ease: "none" }
      );
    } else {
      tl.fromTo(element,
        { x: -100 * speed },
        { x: 100 * speed, ease: "none" }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [speed, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

// Scale on scroll
export const ScaleOnScroll = ({ 
  children, 
  scale = 1.1, 
  className = '' 
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    gsap.fromTo(element,
      { scale: 1 },
      {
        scale: scale,
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scale]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

// Reveal text animation
export const RevealText = ({ 
  children, 
  delay = 0, 
  className = '' 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      skewY: 7
    },
    visible: {
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        variants={textVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Progress bar animation
export const ProgressBar = ({ 
  percentage, 
  height = 4, 
  color = 'bg-primary-600',
  className = '' 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div 
      ref={ref} 
      className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
    >
      <motion.div
        className={`h-full ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </div>
  );
};

// Floating animation
export const FloatingElement = ({ 
  children, 
  intensity = 10, 
  duration = 3,
  className = '' 
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-intensity, intensity, -intensity],
        rotate: [-1, 1, -1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default {
  FadeInOnScroll,
  StaggerChildren,
  AnimatedCounter,
  ParallaxElement,
  ScaleOnScroll,
  RevealText,
  ProgressBar,
  FloatingElement
};