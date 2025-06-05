import { useState, useEffect } from 'react';
import contentData from '../data/content.json';

export const useContent = (pageKey) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (contentData[pageKey]) {
        setContent(contentData[pageKey]);
      } else {
        setError(`Content not found for page: ${pageKey}`);
      }
    } catch (err) {
      setError(`Error loading content: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  return { content, loading, error };
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