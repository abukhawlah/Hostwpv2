import { useState, useEffect, createContext, useContext } from 'react';

// Site Settings Context
const SiteSettingsContext = createContext();

// Default settings
const DEFAULT_SETTINGS = {
  favicon_enabled: false,
  favicon_url: null,
  site_title: 'HostWP - Premium Web Hosting Services',
  site_description: 'Professional WordPress Hosting Solutions',
  meta_keywords: 'wordpress hosting, web hosting, domain registration',
  contact_email: 'support@hostwp.com',
  support_phone: '1-800-HOST-WP'
};

// Settings storage key
const SETTINGS_STORAGE_KEY = 'hostwp_site_settings';

// Hook to use site settings
export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

// Settings Provider Component
export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply settings to document when they change
  useEffect(() => {
    if (!loading) {
      // Update document title
      document.title = settings.site_title || DEFAULT_SETTINGS.site_title;

      // Update favicon
      updateFavicon(settings.favicon_enabled, settings.favicon_url);

      // Update meta description
      updateMetaDescription(settings.site_description);
    }
  }, [settings, loading]);

  // Update settings function
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Save to localStorage
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Update favicon in document
  const updateFavicon = (enabled, url) => {
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(link => link.remove());

    if (enabled && url) {
      // Add new favicon link
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      link.href = url;
      document.head.appendChild(link);
    } else if (!enabled) {
      // Add empty data URL to disable favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = 'data:,';
      document.head.appendChild(link);
    }
  };

  // Update meta description
  const updateMetaDescription = (description) => {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description || DEFAULT_SETTINGS.site_description;
  };

  const value = {
    settings,
    updateSettings,
    loading,
    resetToDefaults: () => {
      setSettings(DEFAULT_SETTINGS);
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    }
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export default useSiteSettings; 