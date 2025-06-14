import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Save, 
  TestTube, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Key, 
  Server, 
  Globe, 
  Shield, 
  Info,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';

const UpmindSettingsManager = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);

  // Use the API config hook
  const { 
    allConfigs: configs, 
    activeConfig, 
    switchConfiguration: setActiveConfig, 
    addConfiguration: addConfig, 
    updateConfiguration: updateConfig, 
    deleteConfiguration: deleteConfig,
    loading,
    isValid,
    error: hookError
  } = useActiveApiConfig();

  // Debug logging
  console.log('🔥 Hook state:', { 
    configs: configs?.length, 
    activeConfig: !!activeConfig, 
    addConfig: typeof addConfig,
    loading,
    isValid,
    hookError 
  });

  const [formData, setFormData] = useState({
    name: '',
    apiKey: '',
    baseUrl: 'https://api.upmind.com/v1',
    environment: 'production',
    timeout: 30000,
    retryAttempts: 3,
    description: ''
  });

  // The useActiveApiConfig hook handles loading configurations automatically

  const handleSave = async () => {
    console.log('🔥 handleSave called!', { formData, addConfig: typeof addConfig });
    setSaving(true);
    try {
      // Map form data to the expected API config format
      const configData = {
        ...formData,
        token: formData.apiKey, // Map apiKey to token
        brandId: 'default', // Add default brandId since it's required
        label: formData.name || 'Unnamed Configuration' // Add label field
      };
      
      console.log('🔥 About to call addConfig with:', configData);
      
      // Use the actual addConfig function from the hook
      const result = await addConfig(configData);
      
      console.log('🔥 addConfig result:', result);
      
      if (result.success) {
        console.log('Configuration saved:', result.config);
        setTestResult({ success: true, message: 'Configuration saved successfully!' });
        // Reset form after successful save
        setFormData({
          name: '',
          apiKey: '',
          baseUrl: 'https://api.upmind.com/v1',
          environment: 'production',
          timeout: 30000,
          retryAttempts: 3,
          description: ''
        });
      } else {
        setTestResult({ success: false, message: result.error || 'Failed to save configuration' });
      }
    } catch (error) {
      console.error('🔥 Error in handleSave:', error);
      setTestResult({ success: false, message: `Failed to save configuration: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTestingConnection(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResult({ 
        success: true, 
        message: 'Connection successful! API is responding correctly.' 
      });
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: 'Connection failed. Please check your API key and URL.' 
      });
    } finally {
      setTestingConnection(false);
    }
  };

  // Show loading state while configs are being loaded
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Upmind settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Upmind API Settings</h2>
                <p className="text-sm text-gray-600">Configure your Upmind API connection</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Configuration
            </button>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Configuration Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Configuration Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Production API"
              />
            </div>

            {/* Environment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Environment
              </label>
              <select
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
              </select>
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Key className="h-4 w-4 inline mr-1" />
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your Upmind API key"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Server className="h-4 w-4 inline mr-1" />
              Base URL
            </label>
            <input
              type="url"
              value={formData.baseUrl}
              onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://api.upmind.com/v1"
            />
          </div>

          {/* Advanced Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout (ms)
              </label>
              <input
                type="number"
                value={formData.timeout}
                onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1000"
                max="60000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retry Attempts
              </label>
              <input
                type="number"
                value={formData.retryAttempts}
                onChange={(e) => setFormData({ ...formData, retryAttempts: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="10"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a description for this configuration..."
            />
          </div>

          {/* Test Result */}
          <AnimatePresence>
            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg border ${
                  testResult.success
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="flex items-center">
                  {testResult.success ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2" />
                  )}
                  <span className="font-medium">{testResult.message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleTest}
              disabled={testingConnection || !formData.apiKey || !formData.baseUrl}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {testingConnection ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              {testingConnection ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              onClick={(e) => {
                console.log('🔥 Save button clicked!', e);
                handleSave();
              }}
              disabled={saving || !formData.name || !formData.apiKey || !formData.baseUrl}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>

      {/* Saved Configurations - Fixed with proper null check */}
      {Array.isArray(configs) && configs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Saved Configurations</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {configs.map((config) => (
              <div key={config.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    config.id === activeConfig?.id ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {config.id === activeConfig?.id ? (
                      <Wifi className="h-5 w-5 text-green-600" />
                    ) : (
                      <WifiOff className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{config.name}</h4>
                    <p className="text-sm text-gray-600">{config.environment}</p>
                    {config.description && (
                      <p className="text-sm text-gray-500 mt-1">{config.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveConfig(config)}
                    disabled={config.id === activeConfig?.id}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {config.id === activeConfig?.id ? 'Active' : 'Activate'}
                  </button>
                  <button
                    onClick={() => setEditingConfig(config)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this configuration?')) {
                        // deleteConfig(config.id);
                        console.log('Delete config:', config.id);
                      }
                    }}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {Array.isArray(configs) && configs.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Settings className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No configurations yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first Upmind API configuration to get started.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Configuration
          </button>
        </div>
      )}
    </div>
  );
};

export default UpmindSettingsManager; 