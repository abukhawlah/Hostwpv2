/**
 * useActiveApiConfig Hook & Context
 * 
 * This module provides React context and hooks for managing API configurations
 * across the HostWP dashboard. It handles loading, switching, and updating
 * API configurations with real-time synchronization and error handling.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getActiveApiConfig, validateApiConfig } from '../services/upmind';
import upmindService from '../services/upmind';

// Create the API Configuration Context
const ApiConfigContext = createContext(null);

// Context Provider Component
export const ApiConfigProvider = ({ children }) => {
  const [activeConfig, setActiveConfig] = useState(null);
  const [allConfigs, setAllConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // Load configurations from localStorage
  const loadConfigurations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all configurations
      const configsData = localStorage.getItem('hostwp_api_configs');
      const activeConfigId = localStorage.getItem('hostwp_active_api_config');
      
      if (configsData) {
        const parsedConfigs = JSON.parse(configsData);
        setAllConfigs(parsedConfigs);
        
        // Find and set active configuration
        if (activeConfigId) {
          const active = parsedConfigs.find(config => config.id === activeConfigId);
          if (active) {
            setActiveConfig(active);
            
            // Validate the active configuration
            try {
              validateApiConfig(active);
              // Configure the Upmind service with the active config
              upmindService.configure(active);
              setIsValid(true);
            } catch (validationError) {
              console.warn('Active API configuration is invalid:', validationError.message);
              setIsValid(false);
              setError(validationError.message);
            }
          } else {
            setError('Active configuration not found in saved configurations');
            setIsValid(false);
          }
        } else {
          setError('No active API configuration selected');
          setIsValid(false);
        }
      } else {
        setAllConfigs([]);
        setError('No API configurations found. Please add one in Settings.');
        setIsValid(false);
      }
    } catch (err) {
      console.error('Error loading API configurations:', err);
      setError(`Failed to load configurations: ${err.message}`);
      setIsValid(false);
      setAllConfigs([]);
      setActiveConfig(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Switch to a different configuration
  const switchConfiguration = useCallback(async (configId) => {
    try {
      setLoading(true);
      setError(null);

      const config = allConfigs.find(c => c.id === configId);
      if (!config) {
        throw new Error('Configuration not found');
      }

      // Validate the configuration before switching
      validateApiConfig(config);

      // Configure the Upmind service with the new config
      upmindService.configure(config);

      // Save as active configuration
      localStorage.setItem('hostwp_active_api_config', configId);
      setActiveConfig(config);
      setIsValid(true);
      
      return { success: true };
    } catch (err) {
      console.error('Error switching configuration:', err);
      setError(`Failed to switch configuration: ${err.message}`);
      setIsValid(false);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [allConfigs]);

  // Add a new configuration
  const addConfiguration = useCallback(async (newConfig) => {
    try {
      setError(null);

      // Validate the new configuration
      validateApiConfig(newConfig);

      // Generate ID if not provided
      const configWithId = {
        ...newConfig,
        id: newConfig.id || `config_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to configurations list
      const updatedConfigs = [...allConfigs, configWithId];
      setAllConfigs(updatedConfigs);
      
      // Save to localStorage
      localStorage.setItem('hostwp_api_configs', JSON.stringify(updatedConfigs));

      // If this is the first configuration, make it active
      if (allConfigs.length === 0) {
        localStorage.setItem('hostwp_active_api_config', configWithId.id);
        // Configure the Upmind service with the new config
        upmindService.configure(configWithId);
        setActiveConfig(configWithId);
        setIsValid(true);
      }

      return { success: true, config: configWithId };
    } catch (err) {
      console.error('Error adding configuration:', err);
      setError(`Failed to add configuration: ${err.message}`);
      return { success: false, error: err.message };
    }
  }, [allConfigs]);

  // Update an existing configuration
  const updateConfiguration = useCallback(async (configId, updates) => {
    try {
      setError(null);

      const configIndex = allConfigs.findIndex(c => c.id === configId);
      if (configIndex === -1) {
        throw new Error('Configuration not found');
      }

      // Create updated configuration
      const updatedConfig = {
        ...allConfigs[configIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Validate the updated configuration
      validateApiConfig(updatedConfig);

      // Update configurations list
      const updatedConfigs = [...allConfigs];
      updatedConfigs[configIndex] = updatedConfig;
      setAllConfigs(updatedConfigs);
      
      // Save to localStorage
      localStorage.setItem('hostwp_api_configs', JSON.stringify(updatedConfigs));

      // Update active config if it's the one being updated
      if (activeConfig && activeConfig.id === configId) {
        // Configure the Upmind service with the updated config
        upmindService.configure(updatedConfig);
        setActiveConfig(updatedConfig);
        setIsValid(true);
      }

      return { success: true, config: updatedConfig };
    } catch (err) {
      console.error('Error updating configuration:', err);
      setError(`Failed to update configuration: ${err.message}`);
      
      // If active config validation fails, mark as invalid
      if (activeConfig && activeConfig.id === configId) {
        setIsValid(false);
      }
      
      return { success: false, error: err.message };
    }
  }, [allConfigs, activeConfig]);

  // Delete a configuration
  const deleteConfiguration = useCallback(async (configId) => {
    try {
      setError(null);

      const configIndex = allConfigs.findIndex(c => c.id === configId);
      if (configIndex === -1) {
        throw new Error('Configuration not found');
      }

      // Remove from configurations list
      const updatedConfigs = allConfigs.filter(c => c.id !== configId);
      setAllConfigs(updatedConfigs);
      
      // Save to localStorage
      localStorage.setItem('hostwp_api_configs', JSON.stringify(updatedConfigs));

      // Handle active configuration
      if (activeConfig && activeConfig.id === configId) {
        if (updatedConfigs.length > 0) {
          // Switch to the first available configuration
          const newActiveConfig = updatedConfigs[0];
          localStorage.setItem('hostwp_active_api_config', newActiveConfig.id);
          setActiveConfig(newActiveConfig);
          
          try {
            validateApiConfig(newActiveConfig);
            setIsValid(true);
          } catch (validationError) {
            setIsValid(false);
            setError(validationError.message);
          }
        } else {
          // No configurations left
          localStorage.removeItem('hostwp_active_api_config');
          setActiveConfig(null);
          setIsValid(false);
          setError('No API configurations available. Please add one in Settings.');
        }
      }

      return { success: true };
    } catch (err) {
      console.error('Error deleting configuration:', err);
      setError(`Failed to delete configuration: ${err.message}`);
      return { success: false, error: err.message };
    }
  }, [allConfigs, activeConfig]);

  // Test a configuration connection
  const testConfiguration = useCallback(async (config) => {
    try {
      setError(null);

      // Validate configuration format first
      validateApiConfig(config);

      // Test the connection by making a simple API call
      // This is a mock test - in real implementation, you'd make an actual API call
      const testUrl = `${config.baseUrl.replace(/\/$/, '')}/health`;
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Accept': 'application/json',
          'X-Brand-ID': config.brandId
        }
      });

      if (response.ok) {
        return { success: true, message: 'Connection successful' };
      } else {
        return { 
          success: false, 
          error: `Connection failed: ${response.status} ${response.statusText}` 
        };
      }
    } catch (err) {
      console.error('Error testing configuration:', err);
      return { 
        success: false, 
        error: `Connection test failed: ${err.message}` 
      };
    }
  }, []);

  // Refresh configurations (useful for real-time updates)
  const refreshConfigurations = useCallback(() => {
    loadConfigurations();
  }, [loadConfigurations]);

  // Clear all configurations (useful for reset/logout)
  const clearAllConfigurations = useCallback(() => {
    localStorage.removeItem('hostwp_api_configs');
    localStorage.removeItem('hostwp_active_api_config');
    setAllConfigs([]);
    setActiveConfig(null);
    setIsValid(false);
    setError('All configurations cleared');
  }, []);

  // Load configurations on mount
  useEffect(() => {
    loadConfigurations();
  }, [loadConfigurations]);

  // Listen for localStorage changes (for cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'hostwp_api_configs' || e.key === 'hostwp_active_api_config') {
        console.log('API configuration changed in another tab, reloading...');
        loadConfigurations();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadConfigurations]);

  // Context value
  const value = {
    // State
    activeConfig,
    allConfigs,
    loading,
    error,
    isValid,
    
    // Actions
    switchConfiguration,
    addConfiguration,
    updateConfiguration,
    deleteConfiguration,
    testConfiguration,
    refreshConfigurations,
    clearAllConfigurations,
    
    // Utilities
    hasConfigurations: allConfigs.length > 0,
    hasActiveConfig: !!activeConfig,
    configCount: allConfigs.length
  };

  return (
    <ApiConfigContext.Provider value={value}>
      {children}
    </ApiConfigContext.Provider>
  );
};

// Custom hook to use the API Configuration context
export const useActiveApiConfig = () => {
  const context = useContext(ApiConfigContext);
  
  if (!context) {
    throw new Error('useActiveApiConfig must be used within an ApiConfigProvider');
  }
  
  return context;
};

// Utility hook for checking if API is ready
export const useApiReady = () => {
  const { activeConfig, isValid, loading } = useActiveApiConfig();
  
  return {
    isReady: !loading && !!activeConfig && isValid,
    isLoading: loading,
    hasConfig: !!activeConfig,
    isConfigValid: isValid
  };
};

// Utility hook for configuration statistics
export const useConfigStats = () => {
  const { allConfigs, activeConfig } = useActiveApiConfig();
  
  return {
    total: allConfigs.length,
    hasActive: !!activeConfig,
    activeLabel: activeConfig?.label || 'None',
    configNames: allConfigs.map(c => c.label)
  };
};

// Higher-order component for requiring valid API configuration
export const withApiConfig = (Component) => {
  return function WithApiConfigComponent(props) {
    const { isReady, isLoading } = useApiReady();
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading API configuration...</span>
        </div>
      );
    }
    
    if (!isReady) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 m-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                API Configuration Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Please configure your Upmind API credentials in Settings to use this feature.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

export default useActiveApiConfig; 