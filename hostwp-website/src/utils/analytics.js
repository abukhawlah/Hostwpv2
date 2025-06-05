// Analytics and tracking utilities
export const trackEvent = (eventName, parameters = {}) => {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      event_category: parameters.category || 'engagement',
      event_label: parameters.label,
      value: parameters.value,
      custom_parameter_1: parameters.custom1,
      custom_parameter_2: parameters.custom2,
      ...parameters
    });
  }

  // Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('track', eventName, parameters);
  }

  // Custom Analytics / Data Layer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    timestamp: new Date().toISOString(),
    ...parameters
  });

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, parameters);
  }
};

// Track product views
export const trackProductView = (product) => {
  trackEvent('view_item', {
    currency: 'USD',
    value: product.price,
    items: [{
      item_id: product.id || product.name,
      item_name: product.name,
      item_category: product.category,
      item_variant: product.variant,
      price: product.price,
      quantity: 1
    }],
    category: 'ecommerce'
  });
};

// Track purchase intent (before Upmind redirect)
export const trackPurchaseIntent = (product) => {
  trackEvent('begin_checkout', {
    currency: 'USD',
    value: product.price,
    items: [{
      item_id: product.id || product.name,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: 1
    }],
    category: 'ecommerce'
  });
};

// Track form interactions
export const trackFormInteraction = (formName, action, field = null) => {
  trackEvent('form_interaction', {
    form_name: formName,
    action: action, // 'start', 'complete', 'abandon', 'field_focus'
    field: field,
    category: 'form'
  });
};

// Track scroll depth
export const trackScrollDepth = (percentage) => {
  trackEvent('scroll_depth', {
    scroll_percentage: percentage,
    category: 'engagement'
  });
};

// Track button clicks
export const trackButtonClick = (buttonText, location, destination = null) => {
  trackEvent('button_click', {
    button_text: buttonText,
    location: location,
    destination: destination,
    category: 'engagement'
  });
};

// Track page views with timing
export const trackPageView = (pageName, loadTime = null) => {
  trackEvent('page_view', {
    page_name: pageName,
    load_time: loadTime,
    category: 'navigation'
  });
};

// Performance tracking
export const trackPerformance = (metric, value) => {
  trackEvent('performance_metric', {
    metric_name: metric,
    metric_value: value,
    category: 'performance'
  });
};

// Initialize scroll depth tracking
export const initScrollTracking = () => {
  let scrollDepthMarks = [25, 50, 75, 100];
  let trackedDepths = new Set();

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    scrollDepthMarks.forEach(mark => {
      if (scrollPercent >= mark && !trackedDepths.has(mark)) {
        trackedDepths.add(mark);
        trackScrollDepth(mark);
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

// Initialize performance tracking
export const initPerformanceTracking = () => {
  // Track Core Web Vitals
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      trackPerformance('LCP', Math.round(lastEntry.startTime));
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        trackPerformance('FID', Math.round(entry.processingStart - entry.startTime));
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      trackPerformance('CLS', Math.round(clsValue * 1000));
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Track page load time
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        trackPerformance('page_load_time', Math.round(navigation.loadEventEnd - navigation.fetchStart));
      }
    }, 0);
  });
};