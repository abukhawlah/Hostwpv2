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
import { useActiveApiConfig } from '../../hooks/useActiveApiConfig.jsx';

const UpmindSettingsManager = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);

  const { 
    allConfigs: configs, 
    activeConfig, 
    switchConfiguration, 
    addConfiguration: addConfig, 
    updateConfiguration: updateConfig, 
    deleteConfiguration: deleteConfig,
    isValid,
    loading
  } = useActiveApiConfig();
  
  const isReady = !loading && !!activeConfig && isValid;

  const [formData, setFormData] = useState({
    name: '',
    apiKey: '',
    brandId: '',
    baseUrl: 'https://my.hostwp.co/api/v1',
    environment: 'production',
    timeout: 30000,
    retryAttempts: 3,
    enableLogging: true,
    webhookSecret: '',
    description: ''
  });

  useEffect(() => {
    if (activeConfig) {
      setFormData({
        name: activeConfig.name || '',
        apiKey: activeConfig.apiKey || activeConfig.token || '',
        brandId: activeConfig.brandId || '',
        baseUrl: activeConfig.baseUrl || 'https://my.hostwp.co/api/v1',
        environment: activeConfig.environment || 'production',
        timeout: activeConfig.timeout || 30000,
        retryAttempts: activeConfig.retryAttempts || 3,
        enableLogging: activeConfig.enableLogging !== false,
        webhookSecret: activeConfig.webhookSecret || '',
        description: activeConfig.description || ''
      });
    }
  }, [activeConfig]);

  const handleSave = async () => {
    console.log('🔄 Save button clicked, form data:', formData);
    
    // Validate required fields
    if (!formData.name || !formData.apiKey || !formData.baseUrl) {
      setTestResult({
        success: false,
        message: 'Please fill in all required fields (Name, API Key, Base URL)'
      });
      return;
    }
    
    setSaving(true);
    try {
      // Map form data to the expected API config format
      const configData = {
        name: formData.name,
        baseUrl: formData.baseUrl,
        token: formData.apiKey, // Map apiKey to token (required by validation)
        brandId: formData.brandId || 'default', // Add brandId (required by validation)
        label: formData.name, // Add label field
        environment: formData.environment,
        timeout: formData.timeout,
        retryAttempts: formData.retryAttempts,
        enableLogging: formData.enableLogging,
        webhookSecret: formData.webhookSecret,
        description: formData.description
      };
      
      console.log('💾 Saving config data:', configData);

      let result;
      if (editingConfig) {
        console.log('📝 Updating existing config (editing mode):', editingConfig.id);
        result = await updateConfig(editingConfig.id, configData);
        setEditingConfig(null);
      } else if (activeConfig) {
        console.log('📝 Updating active config:', activeConfig.id);
        result = await updateConfig(activeConfig.id, configData);
      } else {
        console.log('➕ Adding new config');
        result = await addConfig(configData);
        
        // If this is a new configuration, automatically activate it
        if (result && result.success && result.config) {
          console.log('✅ Activating new config:', result.config.id);
          await switchConfiguration(result.config.id);
        }
      }
      
      console.log('💾 Save result:', result);
      
      if (result && result.success) {
        // Show success message
        setTestResult({
          success: true,
          message: 'Configuration saved and activated successfully!'
        });
        
        setTimeout(() => setTestResult(null), 3000);
      } else {
        setTestResult({
          success: false,
          message: result?.error || 'Failed to save configuration'
        });
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      setTestResult({
        success: false,
        message: 'Failed to save configuration: ' + error.message
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!formData.apiKey || !formData.baseUrl) {
      setTestResult({
        success: false,
        message: 'Please provide API key and base URL'
      });
      return;
    }

    setTestingConnection(true);
    setTestResult(null);

    try {
      console.log('🧪 Testing connection to:', formData.baseUrl);
      
      // Create a temporary config for testing
      const testConfig = {
        baseUrl: formData.baseUrl,
        token: formData.apiKey,
        brandId: formData.brandId || 'default'
      };

      // Test 1: Basic connectivity
      console.log('🔍 Step 1: Testing basic connectivity...');
      const connectivityStart = Date.now();
      
      try {
        const testUrl = formData.baseUrl.replace(/\/api\/v1$/, '');
        const response = await fetch(testUrl, { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        console.log('✅ Basic connectivity test passed');
      } catch (error) {
        console.log('⚠️ Basic connectivity test failed, but continuing...');
      }

      // Test 2: API Authentication
      console.log('🔍 Step 2: Testing API authentication...');
      const authTestUrl = `${formData.baseUrl}/auth/test`;
      
      let authResponse;
      try {
        authResponse = await fetch(authTestUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${formData.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Brand-ID': formData.brandId || 'default'
          }
        });
        console.log('🔐 Auth test response status:', authResponse.status);
      } catch (error) {
        console.log('⚠️ Auth test failed, trying alternative endpoints...');
      }

      // Test 3: Try to fetch products (real API test)
      console.log('🔍 Step 3: Testing API endpoints...');
      const productTestUrls = [
        `${formData.baseUrl}/products`,
        `${formData.baseUrl}/services`,
        `${formData.baseUrl}/hosting-plans`,
        `${formData.baseUrl}/plans`
      ];

      let apiWorking = false;
      let apiResponse = null;
      let workingEndpoint = null;

      for (const testUrl of productTestUrls) {
        try {
          console.log(`🔍 Testing endpoint: ${testUrl}`);
          const response = await fetch(testUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${formData.apiKey}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Brand-ID': formData.brandId || 'default'
            }
          });

          console.log(`📊 ${testUrl} response:`, response.status, response.statusText);

          if (response.ok) {
            try {
              const data = await response.json();
              console.log(`✅ ${testUrl} returned data:`, data);
              apiWorking = true;
              apiResponse = data;
              workingEndpoint = testUrl;
              break;
            } catch (jsonError) {
              console.log(`⚠️ ${testUrl} returned non-JSON response`);
            }
          } else if (response.status === 401) {
            throw new Error('Authentication failed. Please check your API key.');
          } else if (response.status === 403) {
            throw new Error('Access forbidden. Please check your API permissions.');
          }
        } catch (error) {
          console.log(`❌ ${testUrl} failed:`, error.message);
          if (error.message.includes('Authentication') || error.message.includes('Access forbidden')) {
            throw error; // Re-throw auth errors immediately
          }
        }
      }

      const responseTime = Date.now() - connectivityStart;

      if (apiWorking) {
        // Success - API is working
        const productCount = Array.isArray(apiResponse) ? apiResponse.length : 
                           apiResponse?.data?.length || 
                           apiResponse?.products?.length || 
                           apiResponse?.services?.length || 0;

        setTestResult({
          success: true,
          message: 'Connection successful! API is responding correctly.',
          details: {
            responseTime: `${responseTime}ms`,
            workingEndpoint: workingEndpoint.replace(formData.baseUrl, ''),
            dataFound: `${productCount} items found`,
            authStatus: 'Valid',
            apiVersion: apiResponse?.version || 'Unknown'
          }
        });
      } else if (authResponse && (authResponse.status === 200 || authResponse.status === 401)) {
        // API is reachable but no data endpoints work
        setTestResult({
          success: false,
          message: 'API is reachable but no product endpoints are working. This might be a configuration issue.',
          details: {
            responseTime: `${responseTime}ms`,
            authStatus: authResponse.status === 200 ? 'Valid' : 'Invalid',
            issue: 'No working data endpoints found'
          }
        });
      } else {
        // Complete failure
        throw new Error('API is not responding or all endpoints failed');
      }

    } catch (error) {
      console.error('❌ Connection test failed:', error);
      setTestResult({
        success: false,
        message: `Connection failed: ${error.message}`,
        details: {
          error: error.name,
          suggestion: error.message.includes('Authentication') ? 
            'Check your API key in the Upmind dashboard' :
            error.message.includes('Access forbidden') ?
            'Verify your API permissions and brand ID' :
            'Check your base URL and network connection'
        }
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleAddConfig = async (configData) => {
    try {
      await addConfig(configData);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding configuration:', error);
    }
  };

  const handleDeleteConfig = async (configId) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      try {
        await deleteConfig(configId);
      } catch (error) {
        console.error('Error deleting configuration:', error);
      }
    }
  };

  const getEnvironmentBadge = (environment) => {
    const config = {
      production: { color: 'bg-green-100 text-green-800', label: 'Production' },
      staging: { color: 'bg-yellow-100 text-yellow-800', label: 'Staging' },
      development: { color: 'bg-blue-100 text-blue-800', label: 'Development' }
    };

    const envConfig = config[environment] || config.production;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${envConfig.color}`}>
        {envConfig.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upmind API Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure and manage your Upmind API connections
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Configuration
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {isReady ? (
                <Wifi className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500 mr-2" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {isReady ? 'API Connected' : 'No Active Configuration'}
              </span>
            </div>
            {activeConfig && (
              <div className="text-sm text-gray-500">
                Active: {activeConfig.name}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {testResult && (
              <div className={`text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                {testResult.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Configurations */}
      {Array.isArray(configs) && configs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Saved Configurations</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {configs.map((config) => (
              <div key={config.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium text-gray-900">{config.name}</h4>
                      {getEnvironmentBadge(config.environment)}
                      {activeConfig?.id === config.id && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{config.description}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>URL: {config.baseUrl}</span>
                      <span>Timeout: {config.timeout}ms</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {activeConfig?.id !== config.id && (
                      <button
                        onClick={() => switchConfiguration(config.id)}
                        className="btn-secondary text-sm"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingConfig(config);
                        setFormData({
                          name: config.name || '',
                          apiKey: config.token || '',
                          brandId: config.brandId || '',
                          baseUrl: config.baseUrl || 'https://my.hostwp.co/api/v1',
                          environment: config.environment || 'production',
                          timeout: config.timeout || 30000,
                          retryAttempts: config.retryAttempts || 3,
                          enableLogging: config.enableLogging !== false,
                          webhookSecret: config.webhookSecret || '',
                          description: config.description || ''
                        });
                      }}
                      className="btn-secondary text-sm flex items-center"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteConfig(config.id)}
                      className="btn-danger text-sm flex items-center"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {editingConfig ? 'Edit Configuration' : 'Add New Configuration'}
          </h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Configuration Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Production API"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Environment
                </label>
                <select
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description for this configuration"
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* API Credentials */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              API Credentials
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key *
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="Your Upmind API key"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand ID
                </label>
                <input
                  type="text"
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  placeholder="default"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook Secret
                </label>
                <input
                  type="password"
                  value={formData.webhookSecret}
                  onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                  placeholder="Optional webhook secret for secure callbacks"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Connection Settings */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Server className="w-5 h-5 mr-2" />
              Connection Settings
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base URL *
                </label>
                <input
                  type="url"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                  placeholder="https://my.hostwp.co/api/v1"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timeout (ms)
                </label>
                <input
                  type="number"
                  value={formData.timeout}
                  onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
                  min="1000"
                  max="120000"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Retry Attempts
                </label>
                <input
                  type="number"
                  value={formData.retryAttempts}
                  onChange={(e) => setFormData({ ...formData, retryAttempts: parseInt(e.target.value) })}
                  min="0"
                  max="10"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableLogging"
                  checked={formData.enableLogging}
                  onChange={(e) => setFormData({ ...formData, enableLogging: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="enableLogging" className="ml-2 block text-sm text-gray-700">
                  Enable API logging
                </label>
              </div>
            </div>
          </div>

          {/* Test Results */}
          {testResult && (
            <div className={`rounded-md p-4 ${
              testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {testResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    testResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                  </h3>
                  <div className={`mt-2 text-sm ${
                    testResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    <p>{testResult.message}</p>
                    {testResult.details && (
                      <div className="mt-2 space-y-1">
                        {Object.entries(testResult.details).map(([key, value]) => (
                          <p key={key}>
                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {value}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={handleTestConnection}
                disabled={testingConnection || !formData.apiKey || !formData.baseUrl}
                className="btn-secondary flex items-center"
              >
                {testingConnection ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <TestTube className="w-4 h-4 mr-2" />
                )}
                {testingConnection ? 'Testing...' : 'Test Connection'}
              </button>
              
              {editingConfig && (
                <button
                  onClick={() => {
                    setEditingConfig(null);
                    setFormData({
                      name: '',
                      apiKey: '',
                      brandId: '',
                      baseUrl: 'https://my.hostwp.co/api/v1',
                      environment: 'production',
                      timeout: 30000,
                      retryAttempts: 3,
                      enableLogging: true,
                      webhookSecret: '',
                      description: ''
                    });
                  }}
                  className="btn-secondary"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving || !formData.name || !formData.apiKey || !formData.baseUrl}
              className="btn-primary flex items-center"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : (editingConfig ? 'Update Configuration' : 'Save Configuration')}
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Need help with Upmind API setup?
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Get your API key from your Upmind dashboard under Settings → API</li>
                <li>Use the production URL for live environments: https://my.hostwp.co/api/v1</li>
                <li>Test your connection before saving to ensure everything works correctly</li>
                <li>Enable logging for debugging during development</li>
                <li>The test connection will verify authentication and check available endpoints</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add Configuration Modal */}
      <AnimatePresence>
        {showAddModal && (
          <ConfigurationModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddConfig}
            title="Add New Configuration"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Configuration Modal Component
const ConfigurationModal = ({ isOpen, onClose, onSubmit, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    apiKey: '',
    baseUrl: 'https://my.hostwp.co/api/v1',
    environment: 'production',
    timeout: 30000,
    retryAttempts: 3,
    enableLogging: true,
    webhookSecret: '',
    description: ''
  });

  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      apiKey: '',
      baseUrl: 'https://my.hostwp.co/api/v1',
      environment: 'production',
      timeout: 30000,
      retryAttempts: 3,
      enableLogging: true,
      webhookSecret: '',
      description: ''
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Configuration Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Production API"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Environment
              </label>
              <select
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key *
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                required
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="Enter your Upmind API key"
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base URL *
            </label>
            <input
              type="url"
              required
              value={formData.baseUrl}
              onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Optional description for this configuration"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Add Configuration
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UpmindSettingsManager; 