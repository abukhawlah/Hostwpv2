import { useState, useEffect } from 'react';
import { supabase, dbHelpers } from '../lib/supabase';

// Custom hook for fetching data from Supabase
export const useSupabaseQuery = (queryFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await queryFn();
        
        if (result.error) {
          throw result.error;
        }
        
        setData(result.data);
      } catch (err) {
        setError(err);
        console.error('Supabase query error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
};

// Hook for services
export const useServices = (options = {}) => {
  return useSupabaseQuery(
    () => dbHelpers.getServices(options),
    [JSON.stringify(options)]
  );
};

// Hook for projects
export const useProjects = (options = {}) => {
  return useSupabaseQuery(
    () => dbHelpers.getProjects(options),
    [JSON.stringify(options)]
  );
};

// Hook for case studies
export const useCaseStudies = (options = {}) => {
  return useSupabaseQuery(
    () => dbHelpers.getCaseStudies(options),
    [JSON.stringify(options)]
  );
};

// Hook for team members
export const useTeamMembers = () => {
  return useSupabaseQuery(() => dbHelpers.getTeamMembers());
};

// Hook for SEO settings
export const useSeoSettings = () => {
  return useSupabaseQuery(() => dbHelpers.getSeoSettings());
};

// Hook for images
export const useImages = (category = null) => {
  return useSupabaseQuery(
    () => dbHelpers.getImages(category),
    [category]
  );
};

// Hook for products
export const useProducts = (options = {}) => {
  return useSupabaseQuery(
    () => dbHelpers.getProducts(options),
    [JSON.stringify(options)]
  );
};

// Hook for real-time subscriptions
export const useSupabaseSubscription = (table, callback, filter = null) => {
  useEffect(() => {
    let subscription = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: table,
          ...(filter && { filter })
        }, 
        callback
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table, callback, filter]);
};

// Hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if available
    const demoUser = localStorage.getItem('demo_user');
    const demoAdmin = localStorage.getItem('demo_admin');
    if (demoUser && demoAdmin) {
      console.log('useAuth - Initializing with demo user from localStorage');
      return JSON.parse(demoUser);
    }
    return null;
  });
  
  const [loading, setLoading] = useState(() => {
    // If we have demo user, we're not loading
    const demoUser = localStorage.getItem('demo_user');
    const demoAdmin = localStorage.getItem('demo_admin');
    return !(demoUser && demoAdmin);
  });
  
  const [isAdmin, setIsAdmin] = useState(() => {
    // Initialize admin status from localStorage if available
    const demoAdmin = localStorage.getItem('demo_admin');
    return !!demoAdmin;
  });

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        // Check for demo user first
        const demoUser = localStorage.getItem('demo_user');
        const demoAdmin = localStorage.getItem('demo_admin');
        
        console.log('Auth initialization - demo user:', demoUser, 'demo admin:', demoAdmin);
        
        if (demoUser && demoAdmin) {
          console.log('Demo user already set from localStorage, skipping initialization');
          return; // Skip Supabase initialization if demo user exists
        }

        // Get initial session from Supabase only if no demo user
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          // Check if user is admin
          const { data: adminUser } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', session.user.email)
            .single();
          
          setIsAdmin(!!adminUser);
          setUser(session.user);
        } else if (isMounted) {
          setUser(null);
          setIsAdmin(false);
        }
        
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes (only for Supabase, not demo user)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        // Don't override demo user
        const demoUser = localStorage.getItem('demo_user');
        if (demoUser) {
          console.log('Demo user exists, ignoring Supabase auth change');
          return;
        }
        
        if (session?.user && isMounted) {
          // Check if user is admin
          const { data: adminUser } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', session.user.email)
            .single();
          
          setIsAdmin(!!adminUser);
          setUser(session.user);
        } else if (isMounted) {
          setUser(null);
          setIsAdmin(false);
        }
        
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    // For demo purposes, allow admin@hostwp.com with password admin123
    if (email === 'admin@hostwp.com' && password === 'admin123') {
      // Create a demo session
      const demoUser = {
        id: 'demo-admin-id',
        email: 'admin@hostwp.com',
        user_metadata: { role: 'admin' },
        created_at: new Date().toISOString()
      };
      
      // Store demo user in localStorage for persistence
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      localStorage.setItem('demo_admin', 'true');
      
      console.log('signIn - Setting demo user and auth state');
      setUser(demoUser);
      setIsAdmin(true);
      setLoading(false);
      
      return { data: { user: demoUser }, error: null };
    }

    // Regular Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (data?.user && !error) {
      // Check if user is admin
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', data.user.email)
        .single();
      
      if (!adminUser) {
        // Sign out if not admin
        await supabase.auth.signOut();
        return { data: null, error: { message: 'Access denied. Admin privileges required.' } };
      }
      
      setIsAdmin(true);
    }

    return { data, error };
  };

  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    // Clear demo user data
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_admin');
    
    // Handle demo user
    if (user?.id === 'demo-admin-id') {
      setUser(null);
      setIsAdmin(false);
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setIsAdmin(false);
    }
    return { error };
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  };

  // Debug logging for auth state
  console.log('useAuth - returning state:', { user: !!user, loading, isAdmin });

  return {
    user,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword
  };
};

export default useSupabaseQuery; 