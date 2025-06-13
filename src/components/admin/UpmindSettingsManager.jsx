import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Key,
  Globe,
  User,
  Building
} from 'lucide-react';
import { useActiveApiConfig } from '../../hooks/useActiveApiConfig.jsx';

const UpmindSettingsManager = () => {
  const { 
    activeConfig, 
    allConfigs, 
    loading, 
    error, 
    isValid,
    switchConfiguration,
    addConfiguration,
    updateConfiguration,
    deleteConfiguration,
    testConfiguration
  } = useActiveApiConfig();

  // Local state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [testingConfigs, setTestingConfigs] = useState({});
  const [formData, setFormData] = useState({
    label: '',
    baseUrl: '',
    token: '',
    brandId: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Reset form
  const resetForm = () => {
    setFormData({
      label: '',
      baseUrl: '',
      token: '',
      brandId: ''
    });
    setFormErrors({});
    setShowAddForm(false);
    setEditingConfig(null);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.label.trim()) {
      errors.label = 'Label is required';
    }
    
    if (!formData.baseUrl.trim()) {
      errors.baseUrl = 'Base URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.baseUrl)) {
      errors.baseUrl = 'Please enter a valid URL (http:// or https://)';
    }
    
    if (!formData.token.trim()) {
      errors.token = 'API Token is required';
    }
    
    if (!formData.brandId.trim()) {
      errors.brandId = 'Brand ID is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editingConfig) {
        await updateConfiguration(editingConfig.id, formData);
      } else {
        await addConfiguration(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  // Handle edit
  const handleEdit = (config) => {
    setFormData({
      label: config.label,
      baseUrl: config.baseUrl,
      token: config.token,
      brandId: config.brandId
    });
    setEditingConfig(config);
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (configId) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      try {
        await deleteConfiguration(configId);
      } catch (error) {
        console.error('Error deleting configuration:', error);
      }
    }
  };

  // Handle test connection
  const handleTestConnection = async (config) => {
    setTestingConfigs(prev => ({ ...prev, [config.id]: true }));
    
    try {
      const result = await testConfiguration(config.id);
      // Result is handled by the context
    } catch (error) {
      console.error('Error testing connection:', error);
    } finally {
      setTestingConfigs(prev => ({ ...prev, [config.id]: false }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (configId) => {
    setShowPasswords(prev => ({
      ...prev,
      [configId]: !prev[configId]
    }));
  };

  // Mask token for display
  const maskToken = (token) => {
    if (!token) return '';
    return token.length > 8 ? token.substring(0, 8) + '...' : token;
  };

  const ConfigurationForm = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingConfig ? 'Edit Configuration' : 'Add New Configuration'}
        </h3>
        <button
          onClick={resetForm}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Configuration Label *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              placeholder="e.g., Production API"
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.label ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors.label && (
              <p className="mt-1 text-sm text-red-600">{formErrors.label}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base URL *
            </label>
            <input
              type="url"
              value={formData.baseUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
              placeholder="https://api.upmind.com"
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.baseUrl ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors.baseUrl && (
              <p className="mt-1 text-sm text-red-600">{formErrors.baseUrl}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Token *
            </label>
            <input
              type="password"
              value={formData.token}
              onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
              placeholder="Your Upmind API token"
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.token ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors.token && (
              <p className="mt-1 text-sm text-red-600">{formErrors.token}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand ID *
            </label>
            <input
              type="text"
              value={formData.brandId}
              onChange={(e) => setFormData(prev => ({ ...prev, brandId: e.target.value }))}
              placeholder="Your brand identifier"
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.brandId ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors.brandId && (
              <p className="mt-1 text-sm text-red-600">{formErrors.brandId}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
          >
            {editingConfig ? 'Update Configuration' : 'Add Configuration'}
          </button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upmind API Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure and manage your Upmind API connections
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Configuration
        </button>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isValid ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {isValid ? 'API Connected' : 'API Not Connected'}
              </h3>
              <p className="text-sm text-gray-500">
                {activeConfig 
                  ? `Active: ${activeConfig.label}` 
                  : 'No active configuration selected'}
              </p>
            </div>
          </div>
          {activeConfig && (
            <div className="text-right">
              <p className="text-sm text-gray-900">{activeConfig.baseUrl}</p>
              <p className="text-xs text-gray-500">Brand: {activeConfig.brandId}</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAddForm && <ConfigurationForm />}
      </AnimatePresence>

      {/* Configurations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            API Configurations ({allConfigs.length})
          </h2>
        </div>

        {allConfigs.length === 0 ? (
          <div className="p-8 text-center">
            <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No configurations found</h3>
            <p className="text-gray-600 mb-4">
              Add your first Upmind API configuration to get started.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Configuration
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {allConfigs.map((config) => (
              <div key={config.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Key className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {config.label}
                        </h3>
                        {activeConfig?.id === config.id && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          {config.baseUrl}
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {config.brandId}
                        </div>
                        <div className="flex items-center">
                          <Key className="w-4 h-4 mr-1" />
                          {showPasswords[config.id] ? config.token : maskToken(config.token)}
                          <button
                            onClick={() => togglePasswordVisibility(config.id)}
                            className="ml-1 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords[config.id] ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        Created: {new Date(config.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTestConnection(config)}
                      disabled={testingConfigs[config.id]}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 mr-1 ${testingConfigs[config.id] ? 'animate-spin' : ''}`} />
                      Test
                    </button>
                    {activeConfig?.id !== config.id && (
                      <button
                        onClick={() => switchConfiguration(config.id)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(config)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(config.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Getting Started with Upmind API
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p className="mb-2">To configure your Upmind API connection:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Log in to your Upmind admin panel</li>
                <li>Navigate to Settings → API Settings</li>
                <li>Generate a new API token with appropriate permissions</li>
                <li>Copy your Brand ID from the brand settings</li>
                <li>Add the configuration above and test the connection</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpmindSettingsManager; 