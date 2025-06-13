import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mnozsjiwtzbtwhekrtum.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ub3pzaml3dHpidHdoZWtydHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDIyMTAsImV4cCI6MjA2NDExODIxMH0.LkHJmR9DtBJIAQ-FmugApXaHSdDXeU8MfFSGUC0pQHo';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database table names for easy reference
export const TABLES = {
  SERVICES: 'services',
  SERVICE_CATEGORIES: 'service_categories',
  PROJECTS: 'projects',
  CASE_STUDIES: 'case_studies',
  IMAGES: 'images',
  IMAGE_CATEGORIES: 'image_categories',
  TEAM_MEMBERS: 'team_members',
  SEO_SETTINGS: 'seo_settings',
  SITE_SETTINGS: 'site_settings',
  ADMIN_USERS: 'admin_users',
  ECOMMERCE_PRODUCTS: 'ecommerce_products',
  ECOMMERCE_CATEGORIES: 'ecommerce_categories',
  ECOMMERCE_USERS: 'ecommerce_users',
  ECOMMERCE_CART: 'ecommerce_cart',
  ECOMMERCE_ORDERS: 'ecommerce_orders',
  ECOMMERCE_ORDER_ITEMS: 'ecommerce_order_items'
};

// Helper functions for common database operations
export const dbHelpers = {
  // Services
  async getServices(options = {}) {
    let query = supabase
      .from(TABLES.SERVICES)
      .select(`
        *,
        service_categories(name),
        images(file_path, alt_text)
      `)
      .eq('is_active', true);

    if (options.featured) {
      query = query.eq('is_featured', true);
    }

    if (options.category) {
      query = query.eq('category_id', options.category);
    }

    return query.order('display_order', { ascending: true });
  },

  // Projects
  async getProjects(options = {}) {
    let query = supabase
      .from(TABLES.PROJECTS)
      .select(`
        *,
        images(file_path, alt_text)
      `)
      .eq('is_active', true);

    if (options.featured) {
      query = query.eq('is_featured', true);
    }

    if (options.category) {
      query = query.eq('category', options.category);
    }

    return query.order('display_order', { ascending: true });
  },

  // Case Studies
  async getCaseStudies(options = {}) {
    let query = supabase
      .from(TABLES.CASE_STUDIES)
      .select(`
        *,
        hero_image:images!case_studies_hero_image_id_fkey(file_path, alt_text)
      `)
      .eq('is_active', true);

    if (options.featured) {
      query = query.eq('is_featured', true);
    }

    return query.order('display_order', { ascending: true });
  },

  // Team Members
  async getTeamMembers() {
    return supabase
      .from(TABLES.TEAM_MEMBERS)
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
  },

  // SEO Settings
  async getSeoSettings() {
    return supabase
      .from(TABLES.SEO_SETTINGS)
      .select('*')
      .single();
  },

  // Site Settings
  async getSiteSettings() {
    const { data, error } = await supabase
      .from(TABLES.SITE_SETTINGS)
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // No settings found, return null to trigger creation of default settings
      return { data: null, error: null };
    }
    
    return { data, error };
  },

  async updateSiteSettings(settings) {
    const { data, error } = await supabase
      .from(TABLES.SITE_SETTINGS)
      .upsert({
        id: 1,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    return { data, error };
  },

  // Images
  async getImages(category = null) {
    let query = supabase
      .from(TABLES.IMAGES)
      .select('*')
      .eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    return query.order('display_order', { ascending: true });
  },

  // E-commerce Products
  async getProducts(options = {}) {
    let query = supabase
      .from(TABLES.ECOMMERCE_PRODUCTS)
      .select(`
        *,
        ecommerce_categories(name, slug)
      `)
      .eq('status', 'active');

    if (options.featured) {
      query = query.eq('featured', true);
    }

    if (options.category) {
      query = query.eq('category_id', options.category);
    }

    return query.order('created_at', { ascending: false });
  }
};

export default supabase; 