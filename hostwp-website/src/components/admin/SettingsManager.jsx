import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Upload,
  X,
  Image,
  Globe,
  Eye,
  EyeOff,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Card from '../ui/Card';
import Button from '../ui/Button';

const SettingsManager = () => {
  const { settings: globalSettings, updateSettings, loading, error: settingsError } = useSiteSettings();
  
  // Local form state - separate from global settings until saved
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [faviconFile, setFaviconFile] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  // Initialize form data when global settings load
  useEffect(() => {
    if (globalSettings && !loading) {
      const newFormData = {
        favicon_enabled: globalSettings.favicon_enabled,
        favicon_url: globalSettings.favicon_url,
        site_title: globalSettings.site_title,
        site_description: globalSettings.site_description,
        meta_keywords: globalSettings.meta_keywords,
        contact_email: globalSettings.contact_email,
        support_phone: globalSettings.support_phone
      };
      setFormData(newFormData);
    }
  }, [globalSettings, loading]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFaviconUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(png|ico|svg\+xml|x-icon)$/)) {
        setMessage({ type: 'error', text: 'Please upload a PNG, ICO, or SVG file' });
        return;
      }

      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 1MB' });
        return;
      }

      setFaviconFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFaviconPreview(e.target.result);
        // Update form data with new favicon
        setFormData(prev => ({
          ...prev,
          favicon_url: e.target.result,
          favicon_enabled: true
        }));
      };
      reader.readAsDataURL(file);
      
      setMessage({ type: '', text: '' });
    }
  };

  const removeFavicon = () => {
    setFaviconFile(null);
    setFaviconPreview(null);
    setFormData(prev => ({
      ...prev,
      favicon_url: null,
      favicon_enabled: false
    }));
    setMessage({ type: 'info', text: 'Favicon removed. Click Save to apply changes.' });
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      // Save to Supabase using the global hook
      const result = await updateSettings(formData);

      if (result.success) {
        setFaviconFile(null);
        setFaviconPreview(null);
        setMessage({ type: 'success', text: 'Settings saved successfully to database!' });
        
        // Clear success message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        console.error('Supabase error:', result.error);
        setMessage({ 
          type: 'error', 
          text: `Failed to save to database: ${result.error?.message || 'Unknown error'}` 
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      favicon_enabled: globalSettings.favicon_enabled,
      favicon_url: globalSettings.favicon_url,
      site_title: globalSettings.site_title,
      site_description: globalSettings.site_description,
      meta_keywords: globalSettings.meta_keywords,
      contact_email: globalSettings.contact_email,
      support_phone: globalSettings.support_phone
    });
    setFaviconFile(null);
    setFaviconPreview(null);
    setMessage({ type: 'info', text: 'Form reset to last saved values.' });
  };

  // Check if form has unsaved changes
  const hasUnsavedChanges = () => {
    if (!globalSettings || !formData) {
      return false;
    }
    
    const changes = Object.keys(formData).some(key => 
      formData[key] !== globalSettings[key]
    ) || faviconPreview !== null;
    
    return changes;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-600">Manage your website configuration and branding</p>
          {hasUnsavedChanges() && (
            <p className="text-orange-600 text-sm mt-1">• You have unsaved changes</p>
          )}
        </div>
        <div className="flex space-x-3">
          {hasUnsavedChanges() && (
            <Button 
              onClick={resetForm}
              variant="outline"
              disabled={saving}
            >
              <X className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
          <Button 
            onClick={saveSettings}
            disabled={saving || !hasUnsavedChanges()}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Messages */}
      {settingsError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border bg-red-50 border-red-200 text-red-800 flex items-center"
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          Database Connection Error: {settingsError}
        </motion.div>
      )}
      
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {message.text}
        </motion.div>
      )}

      {/* Favicon Settings */}
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <Image className="w-6 h-6 mr-3 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Favicon Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Enable/Disable Favicon */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Enable Favicon</h3>
              <p className="text-sm text-gray-500">Show a favicon icon in browser tabs</p>
            </div>
            <button
              onClick={() => handleInputChange('favicon_enabled', !formData.favicon_enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.favicon_enabled ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.favicon_enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Current Favicon Preview */}
          {(faviconPreview || formData.favicon_url) && (
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                <img
                  src={faviconPreview || formData.favicon_url}
                  alt="Favicon preview"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden text-gray-400 text-xs">Invalid</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {faviconPreview ? 'New Favicon' : 'Current Favicon'}
                </p>
                <p className="text-xs text-gray-500">
                  {faviconFile ? 'Ready to save' : 'Currently active'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={removeFavicon}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          )}

          {/* Upload New Favicon */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Upload New Favicon
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-700">Choose File</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".ico,.png,.svg"
                  onChange={handleFaviconUpload}
                />
              </label>
              {faviconFile && (
                <span className="text-sm text-gray-600">
                  {faviconFile.name} ({Math.round(faviconFile.size / 1024)}KB)
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: ICO, PNG, SVG (Max 1MB)
            </p>
          </div>
        </div>
      </Card>

      {/* General Settings */}
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <Globe className="w-6 h-6 mr-3 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Site Title
            </label>
            <input
              type="text"
              value={formData.site_title || ''}
              onChange={(e) => handleInputChange('site_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Your website title"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contact_email || ''}
              onChange={(e) => handleInputChange('contact_email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="contact@yoursite.com"
            />
          </div>

          {/* Site Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Site Description
            </label>
            <textarea
              value={formData.site_description || ''}
              onChange={(e) => handleInputChange('site_description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Brief description of your website"
            />
          </div>

          {/* Meta Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Meta Keywords
            </label>
            <input
              type="text"
              value={formData.meta_keywords || ''}
              onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          {/* Support Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Support Phone
            </label>
            <input
              type="tel"
              value={formData.support_phone || ''}
              onChange={(e) => handleInputChange('support_phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="1-800-SUPPORT"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsManager; 