import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Eye,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Home,
  Globe,
  Phone,
  User
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ContentManager = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    section_key: '',
    title: '',
    content: {}
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('website_sections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({
      section_key: section.section_key || '',
      title: section.title || '',
      content: section.content || {}
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingSection(null);
    setFormData({
      section_key: '',
      title: '',
      content: {}
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let contentData;
      try {
        contentData = typeof formData.content === 'string' 
          ? JSON.parse(formData.content) 
          : formData.content;
      } catch (err) {
        alert('Invalid JSON format in content field');
        return;
      }

      const sectionData = {
        section_key: formData.section_key,
        title: formData.title,
        content: contentData,
        is_active: true
      };

      let error;
      if (editingSection) {
        const { error: updateError } = await supabase
          .from('website_sections')
          .update(sectionData)
          .eq('id', editingSection.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('website_sections')
          .insert([sectionData]);
        error = insertError;
      }

      if (error) throw error;

      alert(`Section ${editingSection ? 'updated' : 'created'} successfully`);
      setShowModal(false);
      fetchSections();
    } catch (error) {
      console.error('Error saving section:', error);
      alert(`Failed to ${editingSection ? 'update' : 'create'} section`);
    }
  };

  const handleDelete = async (section) => {
    if (!window.confirm(`Are you sure you want to delete "${section.title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('website_sections')
        .delete()
        .eq('id', section.id);

      if (error) throw error;

      alert('Section deleted successfully');
      fetchSections();
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section');
    }
  };

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.section_key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSectionIcon = (sectionKey) => {
    if (sectionKey.includes('home')) return Home;
    if (sectionKey.includes('contact')) return Phone;
    if (sectionKey.includes('story')) return User;
    return Globe;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Website Content</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Website Content</h1>
          <p className="text-gray-600">Manage your website's page content sections</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search sections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSections.map((section) => {
          const IconComponent = getSectionIcon(section.section_key);
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <IconComponent className="w-5 h-5 text-primary-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {section.title}
                      </h3>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      section.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {section.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    Key: <code className="bg-gray-100 px-1 rounded">{section.section_key}</code>
                  </p>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    {Object.keys(section.content || {}).length} content fields
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(section)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(section)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredSections.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Filter className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sections found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : 'Get started by creating your first content section'
            }
          </p>
          {!searchTerm && (
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          )}
        </Card>
      )}

      {/* Section Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSection ? 'Edit Section' : 'Add New Section'}
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
                  Section Key *
                </label>
                <input
                  type="text"
                  required
                  value={formData.section_key}
                  onChange={(e) => setFormData(prev => ({ ...prev, section_key: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., home_hero, contact_info"
                  disabled={!!editingSection}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unique identifier for this section (cannot be changed after creation)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter section title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (JSON) *
                </label>
                <textarea
                  rows={10}
                  required
                  value={typeof formData.content === 'string' ? formData.content : JSON.stringify(formData.content, null, 2)}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                  placeholder='{"headline": "Your headline", "description": "Your description"}'
                />
                <p className="text-xs text-gray-500 mt-1">
                  Content data in JSON format
                </p>
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
                  {editingSection ? 'Update' : 'Create'} Section
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager; 