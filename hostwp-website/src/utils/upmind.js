import { trackPurchaseIntent, trackButtonClick } from './analytics';

// Upmind integration utilities
const UPMIND_BASE_URL = 'https://my.hostwp.co/store/';
const UPMIND_SHOP_URL = 'https://my.hostwp.co/order/shop';
const WORDPRESS_CATEGORY_ID = '15196e02-e513-6d42-628f-0429807875d3';

// Build Upmind product URL with tracking parameters
export const buildUpmindUrl = (product, source = 'website') => {
  const { category, upmindUrl } = product;
  
  if (!upmindUrl) {
    console.error('Product missing upmindUrl:', product);
    return '#';
  }

  const baseUrl = `${UPMIND_BASE_URL}${upmindUrl}`;
  
  // Add tracking and cart parameters
  const params = new URLSearchParams({
    'add-to-cart': 'true',
    'quantity': '1',
    'utm_source': 'hostwp_website',
    'utm_medium': 'cta_button',
    'utm_campaign': 'product_purchase',
    'utm_content': product.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown',
    'utm_term': category || 'hosting',
    'ref': source
  });

  return `${baseUrl}?${params.toString()}`;
};

// Build direct shop URL for WordPress hosting
export const buildShopUrl = (product, source = 'website') => {
  const params = new URLSearchParams({
    'catid': WORDPRESS_CATEGORY_ID,
    'utm_source': 'hostwp_website',
    'utm_medium': 'cta_button',
    'utm_campaign': 'product_purchase',
    'utm_content': product.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown',
    'utm_term': product.category || 'hosting',
    'ref': source
  });

  return `${UPMIND_SHOP_URL}?${params.toString()}`;
};

// Handle direct shop redirect (new approach)
export const redirectToShop = (product, buttonLocation = 'unknown') => {
  try {
    // Track purchase intent before redirect
    trackPurchaseIntent(product);
    
    // Track button click
    trackButtonClick(
      'Buy Now',
      buttonLocation,
      'upmind_shop'
    );

    // Build the shop URL
    const shopUrl = buildShopUrl(product, buttonLocation);
    
    // Add a small delay to ensure tracking fires
    setTimeout(() => {
      window.location.href = shopUrl;
    }, 100);

    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Redirecting to UpMind Shop:', shopUrl);
      console.log('Product:', product);
    }

  } catch (error) {
    console.error('Error redirecting to UpMind Shop:', error);
    
    // Fallback - redirect to shop page without parameters
    window.location.href = `${UPMIND_SHOP_URL}?catid=${WORDPRESS_CATEGORY_ID}`;
  }
};

// Handle product purchase redirect
export const redirectToUpmind = (product, buttonLocation = 'unknown') => {
  try {
    // Track purchase intent before redirect
    trackPurchaseIntent(product);
    
    // Track button click
    trackButtonClick(
      'Buy Now',
      buttonLocation,
      'upmind_checkout'
    );

    // Build the Upmind URL
    const upmindUrl = buildUpmindUrl(product, buttonLocation);
    
    // Add a small delay to ensure tracking fires
    setTimeout(() => {
      window.location.href = upmindUrl;
    }, 100);

    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Redirecting to Upmind:', upmindUrl);
      console.log('Product:', product);
    }

  } catch (error) {
    console.error('Error redirecting to Upmind:', error);
    
    // Fallback - still try to redirect
    const fallbackUrl = `${UPMIND_BASE_URL}${product.upmindUrl || ''}`;
    window.location.href = fallbackUrl;
  }
};

// Handle domain search redirect
export const redirectToDomainSearch = (domain = '', source = 'domain_page') => {
  const domainUrl = `${UPMIND_BASE_URL}domains`;
  
  const params = new URLSearchParams({
    'search': domain,
    'utm_source': 'hostwp_website',
    'utm_medium': 'domain_search',
    'utm_campaign': 'domain_registration',
    'ref': source
  });

  const fullUrl = `${domainUrl}?${params.toString()}`;
  
  // Track domain search
  trackButtonClick(
    'Search Domain',
    source,
    'upmind_domains'
  );

  window.location.href = fullUrl;
};

// Get product category URL mapping
export const getProductCategoryUrl = (categoryId) => {
  const categoryMap = {
    'wordpress': 'fast-wordpress-hosting',
    'cloud': 'cloud-hosting',
    'dedicated': 'dedicated-hosting'
  };

  return categoryMap[categoryId] || categoryId;
};

// Validate product data before redirect
export const validateProduct = (product) => {
  const required = ['name', 'price', 'upmindUrl'];
  const missing = required.filter(field => !product[field]);
  
  if (missing.length > 0) {
    console.warn('Product missing required fields:', missing, product);
    return false;
  }
  
  return true;
};

// Handle contact form redirect to Upmind support
export const redirectToSupport = (type = 'general', source = 'contact_page') => {
  const supportUrl = `${UPMIND_BASE_URL}support`;
  
  const params = new URLSearchParams({
    'type': type,
    'utm_source': 'hostwp_website',
    'utm_medium': 'contact_form',
    'utm_campaign': 'support_request',
    'ref': source
  });

  const fullUrl = `${supportUrl}?${params.toString()}`;
  
  trackButtonClick(
    'Contact Support',
    source,
    'upmind_support'
  );

  window.location.href = fullUrl;
};

// Create product object for tracking
export const createProductForTracking = (plan, category) => {
  return {
    id: `${category}_${plan.name?.toLowerCase().replace(/\s+/g, '_')}`,
    name: plan.name,
    category: category,
    price: plan.price,
    period: plan.period || 'month',
    upmindUrl: plan.upmindUrl,
    variant: plan.period || 'monthly'
  };
};

// Handle plan comparison tracking
export const trackPlanComparison = (plans, category) => {
  trackButtonClick(
    'Compare Plans',
    `${category}_plans`,
    'plan_comparison'
  );
};

// Handle plan selection tracking
export const trackPlanSelection = (plan, category, position) => {
  const product = createProductForTracking(plan, category);
  
  trackButtonClick(
    `Select ${plan.name}`,
    `${category}_plan_${position}`,
    'plan_selection'
  );
  
  return product;
};

export default {
  buildUpmindUrl,
  buildShopUrl,
  redirectToUpmind,
  redirectToShop,
  redirectToDomainSearch,
  redirectToSupport,
  validateProduct,
  createProductForTracking,
  trackPlanComparison,
  trackPlanSelection
};