import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Hook for fetching dynamic website content from Supabase
export const useContent = (sectionKey) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('website_sections')
          .select('content')
          .eq('section_key', sectionKey)
          .eq('is_active', true)
          .single();

        if (error) throw error;
        
        setContent(data?.content || null);
      } catch (err) {
        console.error(`Error loading content for ${sectionKey}:`, err);
        setError(`Error loading content: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (sectionKey) {
      fetchContent();
    }
  }, [sectionKey]);

  return { content, loading, error };
};

// Hook for fetching static content from content.json
export const useStaticContent = (sectionKey) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    import('../data/content.json')
      .then(module => {
        const data = sectionKey ? module.default[sectionKey] : module.default;
        setContent(data || null);
        setLoading(false);
      })
      .catch(err => {
        console.error(`Error loading static content for ${sectionKey}:`, err);
        setError(`Error loading static content: ${err.message}`);
        setLoading(false);
      });
  }, [sectionKey]);

  return { content, loading, error };
};

// Hook for fetching hosting plans
export const useHostingPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('hosting_plans')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        
        setPlans(data || []);
      } catch (err) {
        console.error('Error loading hosting plans:', err);
        setError(`Error loading hosting plans: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
};

// Hook for fetching website features
export const useWebsiteFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('website_features')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        
        setFeatures(data || []);
      } catch (err) {
        console.error('Error loading website features:', err);
        setError(`Error loading website features: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  return { features, loading, error };
};

export const useNavigation = () => {
  const [navigation, setNavigation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../data/navigation.json')
      .then(module => {
        setNavigation(module.default);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading navigation:', err);
        setLoading(false);
      });
  }, []);

  return { navigation, loading };
};

export default useContent;