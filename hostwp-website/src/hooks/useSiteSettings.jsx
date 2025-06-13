import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, dbHelpers } from '../lib/supabase';

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
  const [error, setError] = useState(null);

  // Load settings from Supabase on mount
  useEffect(() => {
    loadSettings();
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

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await dbHelpers.getSiteSettings();

      if (error) {
        console.error('Error loading settings from Supabase:', error);
        setError('Failed to load settings');
        // Fall back to default settings
        setSettings(DEFAULT_SETTINGS);
      } else if (data) {
        // Merge with defaults to ensure all properties exist
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      } else {
        // No settings found, create default settings
        const { data: newData, error: createError } = await dbHelpers.updateSiteSettings(DEFAULT_SETTINGS);
        if (createError) {
          console.error('Error creating default settings:', createError);
          setSettings(DEFAULT_SETTINGS);
        } else {
          setSettings({ ...DEFAULT_SETTINGS, ...newData });
        }
      }
    } catch (error) {
      console.error('Error in loadSettings:', error);
      setError('Failed to load settings');
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  // Update settings function
  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      // Optimistically update local state first for immediate UI feedback
      setSettings(updatedSettings);

      // Save to Supabase
      const { data, error } = await dbHelpers.updateSiteSettings(updatedSettings);

      if (error) {
        console.error('Error saving settings to Supabase:', error);
        // Revert optimistic update on error
        setSettings(settings);
        setError('Failed to save settings');
        return { success: false, error };
      }

      // Update with the data returned from Supabase
      if (data) {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      }

      setError(null);
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateSettings:', error);
      // Revert optimistic update on error
      setSettings(settings);
      setError('Failed to save settings');
      return { success: false, error };
    }
  };

  // Update favicon in document
  const updateFavicon = (enabled, url) => {
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(link => link.remove());

    if (enabled && url) {
      // Add new favicon link with cache busting
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      link.href = url + '?v=' + Date.now(); // Cache busting
      document.head.appendChild(link);
    } else {
      // Add empty data URL to disable favicon with cache busting
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = 'data:,?v=' + Date.now(); // Cache busting
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
    error,
    refreshSettings: loadSettings,
    resetToDefaults: async () => {
      const { success } = await updateSettings(DEFAULT_SETTINGS);
      return success;
    }
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export default useSiteSettings; 