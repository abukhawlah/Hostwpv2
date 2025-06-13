import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Save,
  X,
  CheckCircle,
  Shield,
  Wrench,
  Headphones,
  Brain,
  Zap,
  Clock,
  Users,
  ArrowUp,
  ArrowDown,
  Star
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

const iconOptions = {
  CheckCircle: { component: CheckCircle, label: 'Check Circle', color: 'text-green-500' },
  Shield: { component: Shield, label: 'Shield', color: 'text-blue-500' },
  Wrench: { component: Wrench, label: 'Wrench', color: 'text-orange-500' },
  Headphones: { component: Headphones, label: 'Headphones', color: 'text-purple-500' },
  Brain: { component: Brain, label: 'Brain', color: 'text-indigo-500' },
  Zap: { component: Zap, label: 'Zap', color: 'text-yellow-500' },
  Clock: { component: Clock, label: 'Clock', color: 'text-gray-500' },
  Users: { component: Users, label: 'Users', color: 'text-pink-500' }
};

const FeaturesManager = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'CheckCircle',
    sort_order: 1,
    is_active: true
  });

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('website_features')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
      alert('Failed to fetch website features');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feature) => {
    setEditingFeature(feature);
    setFormData({
      title: feature.title || '',
      description: feature.description || '',
      icon: feature.icon || 'CheckCircle',
      sort_order: feature.sort_order || 1,
      is_active: feature.is_active !== false
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingFeature(null);
    setFormData({
      title: '',
      description: '',
      icon: 'CheckCircle',
      sort_order: features.length + 1,
      is_active: true
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let error;
      if (editingFeature) {
        const { error: updateError } = await supabase
          .from('website_features')
          .update(formData)
          .eq('id', editingFeature.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('website_features')
          .insert([formData]);
        error = insertError;
      }

      if (error) throw error;

      alert(`Feature ${editingFeature ? 'updated' : 'created'} successfully`);
      setShowModal(false);
      fetchFeatures();
    } catch (error) {
      console.error('Error saving feature:', error);
      alert(`Failed to ${editingFeature ? 'update' : 'create'} feature`);
    }
  };

  const handleDelete = async (feature) => {
    if (!window.confirm(`Are you sure you want to delete "${feature.title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('website_features')
        .delete()
        .eq('id', feature.id);

      if (error) throw error;

      alert('Feature deleted successfully');
      fetchFeatures();
    } catch (error) {
      console.error('Error deleting feature:', error);
      alert('Failed to delete feature');
    }
  };

  const handleToggleStatus = async (feature) => {
    try {
      const { error } = await supabase
        .from('website_features')
        .update({ is_active: !feature.is_active })
        .eq('id', feature.id);

      if (error) throw error;
      fetchFeatures();
    } catch (error) {
      console.error('Error updating feature status:', error);
      alert('Failed to update feature status');
    }
  };

  const handleReorder = async (feature, direction) => {
    const currentOrder = feature.sort_order;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    // Find the feature to swap with
    const swapFeature = features.find(f => f.sort_order === newOrder);
    if (!swapFeature) return;

    try {
      // Update both features
      await Promise.all([
        supabase.from('website_features').update({ sort_order: newOrder }).eq('id', feature.id),
        supabase.from('website_features').update({ sort_order: currentOrder }).eq('id', swapFeature.id)
      ]);

      fetchFeatures();
    } catch (error) {
      console.error('Error reordering features:', error);
      alert('Failed to reorder features');
    }
  };

  const filteredFeatures = features.filter(feature =>
    feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Website Features</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Website Features</h1>
          <p className="text-gray-600">Manage your website feature highlights</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search features..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => {
          const IconComponent = iconOptions[feature.icon]?.component || CheckCircle;
          const iconColor = iconOptions[feature.icon]?.color || 'text-gray-500';
          
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <IconComponent className={`w-6 h-6 ${iconColor} mr-3 mt-1 flex-shrink-0`} />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(feature, 'up')}
                        disabled={feature.sort_order === 1}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(feature, 'down')}
                        disabled={feature.sort_order === features.length}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      feature.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {feature.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Order: {feature.sort_order}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(feature)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(feature)}
                      className={feature.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                    >
                      {feature.is_active ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(feature)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredFeatures.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Star className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No features found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : 'Get started by creating your first website feature'
            }
          </p>
          {!searchTerm && (
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          )}
        </Card>
      )}

      {/* Feature Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingFeature ? 'Edit Feature' : 'Add New Feature'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feature Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Lightning Fast Performance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Feature description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(iconOptions).map(([iconKey, iconData]) => {
                    const IconComponent = iconData.component;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon: iconKey }))}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.icon === iconKey
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className={`w-6 h-6 mx-auto ${iconData.color}`} />
                        <span className="text-xs mt-1 block">{iconData.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="1"
                />
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
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editingFeature ? 'Update' : 'Create'} Feature
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturesManager; 