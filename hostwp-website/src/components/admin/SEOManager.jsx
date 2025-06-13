import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save,
  Search,
  Globe,
  Tag,
  FileText,
  Image,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Eye,
  Edit
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

const SEOManager = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    page_name: '',
    title: '',
    description: '',
    keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    is_active: true
  });

  const defaultPages = [
    { name: 'home', label: 'Home Page', description: 'Main landing page' },
    { name: 'products', label: 'Products', description: 'Hosting plans and services' },
    { name: 'domains', label: 'Domains', description: 'Domain registration page' },
    { name: 'about', label: 'Our Story', description: 'About the company' },
    { name: 'support', label: 'White Glove Support', description: 'Support services' },
    { name: 'contact', label: 'Contact', description: 'Contact information' }
  ];

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  const fetchSEOSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_seo_settings')
        .select('*')
        .order('page_name', { ascending: true });

      if (error) throw error;
      
      // Create default pages if they don't exist
      const existingPages = data?.map(item => item.page_name) || [];
      const missingPages = defaultPages.filter(page => !existingPages.includes(page.name));
      
      if (missingPages.length > 0) {
        const defaultSEOData = missingPages.map(page => ({
          page_name: page.name,
          title: `${page.label} | HostWP`,
          description: page.description,
          keywords: 'hosting, wordpress, domains, web hosting',
          is_active: true
        }));

        const { error: insertError } = await supabase
          .from('page_seo_settings')
          .insert(defaultSEOData);

        if (!insertError) {
          // Fetch again to get the complete data
          const { data: updatedData } = await supabase
            .from('page_seo_settings')
            .select('*')
            .order('page_name', { ascending: true });
          setSettings(updatedData || []);
        } else {
          setSettings(data || []);
        }
      } else {
        setSettings(data || []);
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
      alert('Failed to fetch SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (setting) => {
    setEditingPage(setting);
    setFormData({
      page_name: setting.page_name || '',
      title: setting.title || '',
      description: setting.description || '',
      keywords: setting.keywords || '',
      og_title: setting.og_title || '',
      og_description: setting.og_description || '',
      og_image: setting.og_image || '',
      canonical_url: setting.canonical_url || '',
      is_active: setting.is_active !== false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('page_seo_settings')
        .update(formData)
        .eq('id', editingPage.id);

      if (error) throw error;

      alert('SEO settings updated successfully');
      setEditingPage(null);
      fetchSEOSettings();
    } catch (error) {
      console.error('Error updating SEO settings:', error);
      alert('Failed to update SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const getPageLabel = (pageName) => {
    const page = defaultPages.find(p => p.name === pageName);
    return page ? page.label : pageName.charAt(0).toUpperCase() + pageName.slice(1);
  };

  const getSEOScore = (setting) => {
    let score = 0;
    if (setting.title && setting.title.length >= 30 && setting.title.length <= 60) score += 25;
    if (setting.description && setting.description.length >= 120 && setting.description.length <= 160) score += 25;
    if (setting.keywords && setting.keywords.trim()) score += 20;
    if (setting.og_title && setting.og_description) score += 20;
    if (setting.canonical_url) score += 10;
    return score;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SEO Settings</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Settings</h1>
          <p className="text-gray-600">Optimize your website for search engines</p>
        </div>
      </div>

      {/* SEO Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {Math.round(settings.reduce((acc, setting) => acc + getSEOScore(setting), 0) / settings.length || 0)}%
              </h3>
              <p className="text-sm text-gray-600">Average SEO Score</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {settings.filter(s => s.is_active).length}
              </h3>
              <p className="text-sm text-gray-600">Active Pages</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {settings.filter(s => s.og_title && s.og_description).length}
              </h3>
              <p className="text-sm text-gray-600">Social Ready</p>
            </div>
          </div>
        </Card>
      </div>

      {/* SEO Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((setting) => {
          const score = getSEOScore(setting);
          const scoreColor = getScoreColor(score);
          
          return (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {getPageLabel(setting.page_name)}
                    </h3>
                    <p className="text-sm text-gray-500">/{setting.page_name}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${scoreColor}`}>
                      {score}%
                    </div>
                    <p className="text-xs text-gray-500">SEO Score</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Meta Title
                    </label>
                    <p className="text-sm text-gray-900 truncate">
                      {setting.title || 'Not set'}
                    </p>
                    {setting.title && (
                      <p className={`text-xs ${
                        setting.title.length >= 30 && setting.title.length <= 60 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {setting.title.length} characters
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Meta Description
                    </label>
                    <p className="text-sm text-gray-900 truncate">
                      {setting.description || 'Not set'}
                    </p>
                    {setting.description && (
                      <p className={`text-xs ${
                        setting.description.length >= 120 && setting.description.length <= 160 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {setting.description.length} characters
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Keywords
                      </label>
                      <p className="text-sm text-gray-900">
                        {setting.keywords ? '✓' : '✗'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Social Media
                      </label>
                      <p className="text-sm text-gray-900">
                        {setting.og_title && setting.og_description ? '✓' : '✗'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    setting.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {setting.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(setting)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Edit SEO Settings - {getPageLabel(editingPage.page_name)}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingPage(null)}
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Page Title | HostWP"
                />
                <p className={`text-xs mt-1 ${
                  formData.title.length >= 30 && formData.title.length <= 60 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formData.title.length}/60 characters (recommended: 30-60)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Page description for search results..."
                />
                <p className={`text-xs mt-1 ${
                  formData.description.length >= 120 && formData.description.length <= 160 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formData.description.length}/160 characters (recommended: 120-160)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="hosting, wordpress, domains"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma-separated keywords relevant to this page
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Title
                  </label>
                  <input
                    type="text"
                    value={formData.og_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Social media title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.og_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Open Graph Description
                </label>
                <textarea
                  rows={2}
                  value={formData.og_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Description for social media sharing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={formData.canonical_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://hostwp.com/page"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Canonical URL to prevent duplicate content issues
                </p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="mr-2"
                  />
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingPage(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOManager; 