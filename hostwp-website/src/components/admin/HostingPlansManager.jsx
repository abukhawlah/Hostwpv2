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
  Server,
  DollarSign,
  Star,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Upload,
  Download,
  RefreshCw as Sync,
  ExternalLink,
  Wifi,
  WifiOff
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useActiveApiConfig } from '../../hooks/useActiveApiConfig.jsx';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../services/upmind';

const HostingPlansManager = () => {
  // API Configuration
  const { activeConfig, isValid: isApiConfigValid } = useActiveApiConfig();
  
  // Core state
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  
  // Upmind sync state
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [syncMessage, setSyncMessage] = useState('');
  const [upmindProducts, setUpmindProducts] = useState([]);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    period: 'month',
    description: '',
    features: [],
    icon_emoji: '🚀',
    is_popular: false,
    is_active: true,
    sort_order: 1,
    upmind_url: '',
    upmind_product_id: '',
    sync_with_upmind: false
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hosting_plans')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      alert('Failed to fetch hosting plans');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || '',
      slug: plan.slug || '',
      price: plan.price || '',
      period: plan.period || 'month',
      description: plan.description || '',
      features: plan.features || [],
      icon_emoji: plan.icon_emoji || '🚀',
      is_popular: plan.is_popular || false,
      is_active: plan.is_active !== false,
      sort_order: plan.sort_order || 1,
      upmind_url: plan.upmind_url || '',
      upmind_product_id: plan.upmind_product_id || '',
      sync_with_upmind: plan.sync_with_upmind || false
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      slug: '',
      price: '',
      period: 'month',
      description: '',
      features: [],
      icon_emoji: '🚀',
      is_popular: false,
      is_active: true,
      sort_order: plans.length + 1,
      upmind_url: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Generate slug from name if not provided
      const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
      
      const planData = {
        ...formData,
        slug,
        price: parseFloat(formData.price).toFixed(2),
        features: Array.isArray(formData.features) ? formData.features : formData.features.split('\n').filter(f => f.trim())
      };

      let error;
      if (editingPlan) {
        const { error: updateError } = await supabase
          .from('hosting_plans')
          .update(planData)
          .eq('id', editingPlan.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('hosting_plans')
          .insert([planData]);
        error = insertError;
      }

      if (error) throw error;

      alert(`Plan ${editingPlan ? 'updated' : 'created'} successfully`);
      setShowModal(false);
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert(`Failed to ${editingPlan ? 'update' : 'create'} plan`);
    }
  };

  const handleDelete = async (plan) => {
    if (!window.confirm(`Are you sure you want to delete "${plan.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('hosting_plans')
        .delete()
        .eq('id', plan.id);

      if (error) throw error;

      alert('Plan deleted successfully');
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan');
    }
  };

  const handleToggleStatus = async (plan) => {
    try {
      const { error } = await supabase
        .from('hosting_plans')
        .update({ is_active: !plan.is_active })
        .eq('id', plan.id);

      if (error) throw error;
      fetchPlans();
    } catch (error) {
      console.error('Error updating plan status:', error);
      alert('Failed to update plan status');
    }
  };

  const handleReorder = async (plan, direction) => {
    const currentOrder = plan.sort_order;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    // Find the plan to swap with
    const swapPlan = plans.find(p => p.sort_order === newOrder);
    if (!swapPlan) return;

    try {
      // Update both plans
      await Promise.all([
        supabase.from('hosting_plans').update({ sort_order: newOrder }).eq('id', plan.id),
        supabase.from('hosting_plans').update({ sort_order: currentOrder }).eq('id', swapPlan.id)
      ]);

      fetchPlans();
    } catch (error) {
      console.error('Error reordering plans:', error);
      alert('Failed to reorder plans');
    }
  };

  // Upmind Sync Functions
  const fetchUpmindProducts = async () => {
    if (!isApiConfigValid) {
      setSyncMessage('API configuration required');
      return [];
    }

    try {
      setSyncStatus('syncing');
      setSyncMessage('Fetching products from Upmind...');
      
      console.log('🔍 Fetching products from Upmind API...');
      const response = await getProducts();
      console.log('📦 Upmind API Response:', response);
      
      if (response.success) {
        console.log('✅ Products fetched successfully:', response.data);
        console.log('📊 Number of products:', response.data?.length || 0);
        
        if (!response.data || response.data.length === 0) {
          setSyncStatus('error');
          setSyncMessage('No products found in Upmind. Please check your Upmind account and ensure you have products configured.');
          return [];
        }
        
        setUpmindProducts(response.data);
        setSyncMessage(`Found ${response.data.length} products in Upmind`);
        return response.data;
      } else {
        console.error('❌ API Error:', response.error);
        console.error('📋 Error Details:', response.details);
        throw new Error(response.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('💥 Error fetching Upmind products:', error);
      setSyncStatus('error');
      setSyncMessage(`Error fetching products: ${error.message}`);
      return [];
    }
  };

  const syncPlanToUpmind = async (plan) => {
    if (!isApiConfigValid) {
      throw new Error('API configuration required');
    }

    try {
      const upmindProductData = {
        name: plan.name,
        description: plan.description,
        price: parseFloat(plan.price),
        billing_cycle: plan.period,
        features: Array.isArray(plan.features) ? plan.features : [],
        status: plan.is_active ? 'active' : 'inactive',
        metadata: {
          hostwp_plan_id: plan.id,
          icon_emoji: plan.icon_emoji,
          is_popular: plan.is_popular,
          sort_order: plan.sort_order
        }
      };

      let response;
      if (plan.upmind_product_id) {
        // Update existing product
        response = await updateProduct(plan.upmind_product_id, upmindProductData);
      } else {
        // Create new product
        response = await createProduct(upmindProductData);
      }

      if (response.success) {
        // Update local plan with Upmind product ID
        if (!plan.upmind_product_id && response.data.id) {
          await supabase
            .from('hosting_plans')
            .update({ 
              upmind_product_id: response.data.id,
              sync_with_upmind: true,
              last_synced_at: new Date().toISOString()
            })
            .eq('id', plan.id);
        }
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to sync to Upmind');
      }
    } catch (error) {
      console.error('Error syncing plan to Upmind:', error);
      throw error;
    }
  };

  const syncPlanFromUpmind = async (upmindProduct, localPlan = null) => {
    try {
      const planData = {
        name: upmindProduct.name,
        description: upmindProduct.description || '',
        price: upmindProduct.price?.toString() || '0',
        period: upmindProduct.billing_cycle || 'month',
        features: upmindProduct.features || [],
        is_active: upmindProduct.status === 'active',
        upmind_product_id: upmindProduct.id,
        sync_with_upmind: true,
        last_synced_at: new Date().toISOString(),
        // Preserve local-only fields
        icon_emoji: localPlan?.icon_emoji || '🚀',
        is_popular: localPlan?.is_popular || false,
        sort_order: localPlan?.sort_order || plans.length + 1,
        slug: localPlan?.slug || upmindProduct.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
      };

      let error;
      if (localPlan) {
        // Update existing plan
        const { error: updateError } = await supabase
          .from('hosting_plans')
          .update(planData)
          .eq('id', localPlan.id);
        error = updateError;
      } else {
        // Create new plan
        const { error: insertError } = await supabase
          .from('hosting_plans')
          .insert([planData]);
        error = insertError;
      }

      if (error) throw error;
      return planData;
    } catch (error) {
      console.error('Error syncing plan from Upmind:', error);
      throw error;
    }
  };

  const handleSyncAllToUpmind = async () => {
    if (!isApiConfigValid) {
      alert('Please configure your Upmind API credentials in Settings first');
      return;
    }

    setSyncStatus('syncing');
    setSyncMessage('Syncing all plans to Upmind...');
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    try {
      for (const plan of plans) {
        try {
          await syncPlanToUpmind(plan);
          successCount++;
          setSyncMessage(`Synced ${successCount}/${plans.length} plans to Upmind...`);
        } catch (error) {
          errorCount++;
          errors.push(`${plan.name}: ${error.message}`);
        }
      }

      setSyncStatus(errorCount === 0 ? 'success' : 'error');
      setSyncMessage(
        errorCount === 0 
          ? `Successfully synced ${successCount} plans to Upmind`
          : `Synced ${successCount} plans, ${errorCount} failed. Errors: ${errors.join(', ')}`
      );
      setLastSyncTime(new Date());
      
      // Refresh plans to show updated sync status
      fetchPlans();
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage(`Sync failed: ${error.message}`);
    }
  };

  const handleSyncAllFromUpmind = async () => {
    if (!isApiConfigValid) {
      alert('Please configure your Upmind API credentials in Settings first');
      return;
    }

    setSyncStatus('syncing');
    setSyncMessage('Fetching plans from Upmind...');

    try {
      const upmindProducts = await fetchUpmindProducts();
      if (upmindProducts.length === 0) {
        setSyncStatus('error');
        setSyncMessage('No products found in Upmind');
        return;
      }

      setSyncMessage('Syncing plans from Upmind...');
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const product of upmindProducts) {
        try {
          // Find matching local plan
          const localPlan = plans.find(p => p.upmind_product_id === product.id);
          await syncPlanFromUpmind(product, localPlan);
          successCount++;
          setSyncMessage(`Synced ${successCount}/${upmindProducts.length} plans from Upmind...`);
        } catch (error) {
          errorCount++;
          errors.push(`${product.name}: ${error.message}`);
        }
      }

      setSyncStatus(errorCount === 0 ? 'success' : 'error');
      setSyncMessage(
        errorCount === 0 
          ? `Successfully synced ${successCount} plans from Upmind`
          : `Synced ${successCount} plans, ${errorCount} failed. Errors: ${errors.join(', ')}`
      );
      setLastSyncTime(new Date());
      
      // Refresh plans to show new data
      fetchPlans();
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage(`Sync failed: ${error.message}`);
    }
  };

  const handleSyncSinglePlan = async (plan, direction = 'to') => {
    if (!isApiConfigValid) {
      alert('Please configure your Upmind API credentials in Settings first');
      return;
    }

    setSyncStatus('syncing');
    
    try {
      if (direction === 'to') {
        setSyncMessage(`Syncing "${plan.name}" to Upmind...`);
        await syncPlanToUpmind(plan);
        setSyncMessage(`Successfully synced "${plan.name}" to Upmind`);
      } else {
        if (!plan.upmind_product_id) {
          throw new Error('No Upmind product ID found for this plan');
        }
        setSyncMessage(`Syncing "${plan.name}" from Upmind...`);
        // Fetch the specific product from Upmind
        const products = await fetchUpmindProducts();
        const upmindProduct = products.find(p => p.id === plan.upmind_product_id);
        if (!upmindProduct) {
          throw new Error('Product not found in Upmind');
        }
        await syncPlanFromUpmind(upmindProduct, plan);
        setSyncMessage(`Successfully synced "${plan.name}" from Upmind`);
      }
      
      setSyncStatus('success');
      setLastSyncTime(new Date());
      fetchPlans();
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage(`Sync failed: ${error.message}`);
    }
  };

  const handleDeleteFromUpmind = async (plan) => {
    if (!plan.upmind_product_id) {
      alert('This plan is not synced with Upmind');
      return;
    }

    if (!confirm(`Delete "${plan.name}" from Upmind? This action cannot be undone.`)) {
      return;
    }

    try {
      setSyncStatus('syncing');
      setSyncMessage(`Deleting "${plan.name}" from Upmind...`);
      
      const response = await deleteProduct(plan.upmind_product_id);
      if (response.success) {
        // Update local plan to remove Upmind reference
        await supabase
          .from('hosting_plans')
          .update({ 
            upmind_product_id: null,
            sync_with_upmind: false,
            last_synced_at: null
          })
          .eq('id', plan.id);
        
        setSyncStatus('success');
        setSyncMessage(`Successfully deleted "${plan.name}" from Upmind`);
        fetchPlans();
      } else {
        throw new Error(response.error || 'Failed to delete from Upmind');
      }
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage(`Delete failed: ${error.message}`);
    }
  };

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Hosting Plans</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Hosting Plans</h1>
          <p className="text-gray-600">Manage your hosting plans and pricing</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
      </div>

      {/* Upmind Sync Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isApiConfigValid ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <span className={`text-sm font-medium ${isApiConfigValid ? 'text-green-700' : 'text-red-700'}`}>
                {isApiConfigValid ? 'Upmind Connected' : 'Upmind Disconnected'}
              </span>
            </div>
            {lastSyncTime && (
              <span className="text-sm text-gray-500">
                Last sync: {lastSyncTime.toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncAllFromUpmind}
              disabled={!isApiConfigValid || syncStatus === 'syncing'}
              className="flex items-center"
            >
              {syncStatus === 'syncing' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Pull from Upmind
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncAllToUpmind}
              disabled={!isApiConfigValid || syncStatus === 'syncing'}
              className="flex items-center"
            >
              {syncStatus === 'syncing' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Push to Upmind
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSyncModal(true)}
              disabled={!isApiConfigValid}
              className="flex items-center"
            >
              <Sync className="w-4 h-4 mr-2" />
              Sync Options
            </Button>
          </div>
        </div>
        
        {/* Sync Status Message */}
        {syncMessage && (
          <div className={`mt-3 p-3 rounded-lg flex items-center ${
            syncStatus === 'error' ? 'bg-red-50 text-red-700' :
            syncStatus === 'success' ? 'bg-green-50 text-green-700' :
            'bg-blue-50 text-blue-700'
          }`}>
            {syncStatus === 'error' ? (
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            ) : syncStatus === 'success' ? (
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2 flex-shrink-0 animate-spin" />
            )}
            <span className="text-sm">{syncMessage}</span>
          </div>
        )}
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`p-6 h-full flex flex-col ${plan.is_popular ? 'border-2 border-primary-500' : ''}`}>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{plan.icon_emoji}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {plan.name}
                      </h3>
                      {plan.is_popular && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary-800 bg-primary-100 rounded-full">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReorder(plan, 'up')}
                      disabled={plan.sort_order === 1}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReorder(plan, 'down')}
                      disabled={plan.sort_order === plans.length}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-sm text-gray-500 ml-1">/{plan.period}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                
                <div className="text-sm text-gray-500 mb-4">
                  {plan.features?.length || 0} features • Order: {plan.sort_order}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      plan.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </span>
                    
                    {/* Upmind Sync Status */}
                    {plan.upmind_product_id ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
                        <Sync className="w-3 h-3 mr-1" />
                        Synced
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                        Local Only
                      </span>
                    )}
                  </div>
                  
                  {/* Individual Sync Actions */}
                  {isApiConfigValid && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSyncSinglePlan(plan, 'to')}
                        disabled={syncStatus === 'syncing'}
                        title="Push to Upmind"
                      >
                        <Upload className="w-3 h-3" />
                      </Button>
                      
                      {plan.upmind_product_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSyncSinglePlan(plan, 'from')}
                          disabled={syncStatus === 'syncing'}
                          title="Pull from Upmind"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      )}
                      
                      {plan.upmind_product_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFromUpmind(plan)}
                          disabled={syncStatus === 'syncing'}
                          className="text-red-600 hover:text-red-700"
                          title="Remove from Upmind"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(plan)}
                    className={plan.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                  >
                    {plan.is_active ? 'Hide' : 'Show'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(plan)}
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
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Server className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No plans found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : 'Get started by creating your first hosting plan'
            }
          </p>
          {!searchTerm && (
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Plan
            </Button>
          )}
        </Card>
      )}

      {/* Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPlan ? 'Edit Plan' : 'Add New Plan'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., SpeedMaster"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="49.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Plan description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (one per line)
                </label>
                <textarea
                  rows={6}
                  value={Array.isArray(formData.features) ? formData.features.join('\n') : formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="1 Website&#10;10GB Storage&#10;Unlimited Bandwidth"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon Emoji
                  </label>
                  <input
                    type="text"
                    value={formData.icon_emoji}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon_emoji: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="🚀"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
              </div>

              {/* Upmind Integration Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Sync className="w-5 h-5 mr-2" />
                  Upmind Integration
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.sync_with_upmind}
                        onChange={(e) => setFormData(prev => ({ ...prev, sync_with_upmind: e.target.checked }))}
                        className="mr-2"
                      />
                      Enable Upmind Sync
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      Automatically sync this plan with Upmind products
                    </p>
                  </div>
                  
                  {formData.sync_with_upmind && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upmind Product ID
                        </label>
                        <input
                          type="text"
                          value={formData.upmind_product_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, upmind_product_id: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="auto-generated on sync"
                          readOnly={!!editingPlan?.upmind_product_id}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upmind Product URL
                        </label>
                        <input
                          type="url"
                          value={formData.upmind_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, upmind_url: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="https://your-upmind.com/products/..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_popular: e.target.checked }))}
                    className="mr-2"
                  />
                  Popular Plan
                </label>
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
                  {editingPlan ? 'Update' : 'Create'} Plan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sync Options Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Upmind Sync Options
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSyncModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Sync Directions</h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <p><strong>Pull from Upmind:</strong> Fetch products from Upmind and create/update local plans</p>
                  <p><strong>Push to Upmind:</strong> Send local plans to Upmind as products</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleSyncAllFromUpmind}
                  disabled={!isApiConfigValid || syncStatus === 'syncing'}
                  className="w-full flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Pull All Plans from Upmind
                </Button>

                <Button
                  onClick={handleSyncAllToUpmind}
                  disabled={!isApiConfigValid || syncStatus === 'syncing'}
                  className="w-full flex items-center justify-center"
                  variant="outline"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Push All Plans to Upmind
                </Button>

                <Button
                  onClick={async () => {
                    setSyncMessage('Fetching Upmind products...');
                    await fetchUpmindProducts();
                  }}
                  disabled={!isApiConfigValid || syncStatus === 'syncing'}
                  className="w-full flex items-center justify-center"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Upmind Product List
                </Button>
              </div>

              {upmindProducts.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Upmind Products ({upmindProducts.length})
                  </h3>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {upmindProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <span>{product.name}</span>
                        <span className="text-gray-500">${product.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 mb-1">Important Notes</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Syncing will overwrite existing data</li>
                  <li>• Local-only fields (emoji, popularity) are preserved</li>
                  <li>• Always backup your data before bulk operations</li>
                  <li>• Configure Upmind API credentials in Settings first</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => setShowSyncModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostingPlansManager; 