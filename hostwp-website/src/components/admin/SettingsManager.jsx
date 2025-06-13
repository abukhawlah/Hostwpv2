import React, { useState } from 'react';
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
import { useSiteSettings } from '../../hooks/useSiteSettings.jsx';
import Card from '../ui/Card';
import Button from '../ui/Button';

const SettingsManager = () => {
  const { settings, updateSettings, loading, error: settingsError } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [faviconFile, setFaviconFile] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  const handleInputChange = (field, value) => {
    updateSettings({ [field]: value });
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
      };
      reader.readAsDataURL(file);
      
      setMessage({ type: '', text: '' });
    }
  };

  const removeFavicon = () => {
    setFaviconFile(null);
    setFaviconPreview(null);
    updateSettings({ favicon_url: null, favicon_enabled: false });
    setMessage({ type: 'info', text: 'Favicon removed and disabled.' });
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      // Prepare the settings to save
      const settingsToSave = {
        favicon_enabled: settings.favicon_enabled,
        favicon_url: faviconPreview || settings.favicon_url,
        site_title: settings.site_title,
        site_description: settings.site_description,
        meta_keywords: settings.meta_keywords,
        contact_email: settings.contact_email,
        support_phone: settings.support_phone
      };

      // Save to Supabase using the global hook
      const result = await updateSettings(settingsToSave);

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
        </div>
        <Button 
          onClick={saveSettings}
          disabled={saving}
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
              onClick={() => handleInputChange('favicon_enabled', !settings.favicon_enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.favicon_enabled ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.favicon_enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Current Favicon Preview */}
          {(faviconPreview || settings.favicon_url) && (
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                <img
                  src={faviconPreview || settings.favicon_url}
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
                <p className="text-sm font-medium text-gray-900">Current Favicon</p>
                <p className="text-xs text-gray-500">
                  {faviconFile ? 'New file selected' : 'Currently active'}
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
                  accept=".ico,.png,.svg"
                  onChange={handleFaviconUpload}
                  className="hidden"
                />
              </label>
              {faviconFile && (
                <span className="text-sm text-gray-600">{faviconFile.name}</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: ICO, PNG, SVG. Maximum size: 1MB. Recommended size: 32x32px
            </p>
          </div>
        </div>
      </Card>

      {/* General Site Settings */}
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <Globe className="w-6 h-6 mr-3 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Site Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Site Title
            </label>
            <input
              type="text"
              value={settings.site_title}
              onChange={(e) => handleInputChange('site_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter site title"
            />
            <p className="text-xs text-gray-500 mt-1">
              This appears in browser tabs and search engine results
            </p>
          </div>

          {/* Site Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Site Description
            </label>
            <textarea
              value={settings.site_description}
              onChange={(e) => handleInputChange('site_description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter site description"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used in meta descriptions for SEO
            </p>
          </div>

          {/* Meta Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Meta Keywords
            </label>
            <input
              type="text"
              value={settings.meta_keywords}
              onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter keywords separated by commas"
            />
            <p className="text-xs text-gray-500 mt-1">
              Comma-separated keywords for SEO
            </p>
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => handleInputChange('contact_email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter contact email"
            />
          </div>

          {/* Support Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Support Phone
            </label>
            <input
              type="tel"
              value={settings.support_phone}
              onChange={(e) => handleInputChange('support_phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter support phone number"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsManager; 