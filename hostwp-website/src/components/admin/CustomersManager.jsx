import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  DollarSign,
  Package,
  Wifi,
  WifiOff,
  RefreshCw,
  Eye,
  UserPlus,
  Download,
  Upload,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useActiveApiConfig } from '../../hooks/useActiveApiConfig.jsx';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../services/upmind';

const CustomersManager = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [syncMessage, setSyncMessage] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const { config: apiConfig, isReady: apiReady } = useActiveApiConfig();

  // Mock customer data
  const mockCustomers = [
    {
      id: 1,
      upmind_customer_id: 'UPM_001',
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Smith Enterprises',
      address: '123 Main St, New York, NY 10001',
      status: 'active',
      created_at: '2024-01-15T10:30:00Z',
      last_login: '2024-06-10T14:22:00Z',
      total_orders: 5,
      total_spent: 2450.00,
      active_services: 3,
      notes: 'VIP customer, priority support',
      tags: ['vip', 'enterprise'],
      billing_address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US'
      }
    },
    {
      id: 2,
      upmind_customer_id: 'UPM_002',
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.j@techstartup.com',
      phone: '+1 (555) 987-6543',
      company: 'Tech Startup Inc',
      address: '456 Innovation Blvd, San Francisco, CA 94105',
      status: 'active',
      created_at: '2024-02-20T09:15:00Z',
      last_login: '2024-06-12T16:45:00Z',
      total_orders: 3,
      total_spent: 1200.00,
      active_services: 2,
      notes: 'Interested in scaling up hosting plan',
      tags: ['startup', 'growth'],
      billing_address: {
        street: '456 Innovation Blvd',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'US'
      }
    },
    {
      id: 3,
      upmind_customer_id: null,
      first_name: 'Mike',
      last_name: 'Davis',
      email: 'mike.davis@freelancer.com',
      phone: '+1 (555) 456-7890',
      company: 'Davis Design Studio',
      address: '789 Creative Ave, Austin, TX 73301',
      status: 'inactive',
      created_at: '2024-03-10T11:20:00Z',
      last_login: '2024-05-15T10:30:00Z',
      total_orders: 1,
      total_spent: 299.00,
      active_services: 0,
      notes: 'Cancelled service, may return',
      tags: ['freelancer'],
      billing_address: {
        street: '789 Creative Ave',
        city: 'Austin',
        state: 'TX',
        zip: '73301',
        country: 'US'
      }
    },
    {
      id: 4,
      upmind_customer_id: 'UPM_004',
      first_name: 'Emily',
      last_name: 'Chen',
      email: 'emily.chen@bloggerlife.com',
      phone: '+1 (555) 321-0987',
      company: 'Blogger Life',
      address: '321 Content St, Seattle, WA 98101',
      status: 'pending',
      created_at: '2024-06-01T08:45:00Z',
      last_login: null,
      total_orders: 0,
      total_spent: 0.00,
      active_services: 0,
      notes: 'New signup, awaiting verification',
      tags: ['new', 'blogger'],
      billing_address: {
        street: '321 Content St',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
        country: 'US'
      }
    }
  ];

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, statusFilter]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from your database
      // If Upmind API is configured, sync with Upmind
      if (apiReady && apiConfig) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  };

  const handleSyncWithUpmind = async () => {
    if (!apiReady || !apiConfig) {
      setSyncMessage('API configuration not available');
      setSyncStatus('error');
      return;
    }

    setSyncStatus('syncing');
    setSyncMessage('Syncing customers with Upmind...');

    try {
      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSyncStatus('success');
      setSyncMessage('Successfully synced with Upmind');
      setLastSyncTime(new Date());
      
      // Reload customers after sync
      await loadCustomers();
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage('Failed to sync with Upmind: ' + error.message);
    }
  };

  const handleAddCustomer = async (customerData) => {
    try {
      // In a real app, this would create in your database and optionally sync to Upmind
      const newCustomer = {
        id: Math.max(...customers.map(c => c.id)) + 1,
        ...customerData,
        created_at: new Date().toISOString(),
        total_orders: 0,
        total_spent: 0.00,
        active_services: 0
      };

      setCustomers([...customers, newCustomer]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleEditCustomer = async (customerData) => {
    try {
      const updatedCustomers = customers.map(customer =>
        customer.id === selectedCustomer.id
          ? { ...customer, ...customerData }
          : customer
      );

      setCustomers(updatedCustomers);
      setShowEditModal(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        setCustomers(customers.filter(customer => customer.id !== customerId));
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Inactive' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      suspended: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Suspended' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your customers and sync with Upmind
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Sync Status Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {apiReady ? (
                <Wifi className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500 mr-2" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {apiReady ? 'Connected to Upmind' : 'Upmind Not Configured'}
              </span>
            </div>
            {lastSyncTime && (
              <div className="text-sm text-gray-500">
                Last sync: {formatDate(lastSyncTime)}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {syncStatus === 'syncing' && (
              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
            )}
            <button
              onClick={handleSyncWithUpmind}
              disabled={!apiReady || syncStatus === 'syncing'}
              className="btn-secondary text-sm flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Sync with Upmind
            </button>
          </div>
        </div>
        {syncMessage && (
          <div className={`mt-2 text-sm ${
            syncStatus === 'error' ? 'text-red-600' : 
            syncStatus === 'success' ? 'text-green-600' : 'text-blue-600'
          }`}>
            {syncMessage}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sync Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {customer.first_name[0]}{customer.last_name[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.first_name} {customer.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(customer.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.total_orders}</div>
                    <div className="text-sm text-gray-500">{customer.active_services} active</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(customer.total_spent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.upmind_customer_id ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Synced
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Local Only
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowDetailsModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first customer.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAddModal && (
          <CustomerModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddCustomer}
            title="Add New Customer"
          />
        )}
      </AnimatePresence>

      {/* Edit Customer Modal */}
      <AnimatePresence>
        {showEditModal && selectedCustomer && (
          <CustomerModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedCustomer(null);
            }}
            onSubmit={handleEditCustomer}
            customer={selectedCustomer}
            title="Edit Customer"
          />
        )}
      </AnimatePresence>

      {/* Customer Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedCustomer && (
          <CustomerDetailsModal
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedCustomer(null);
            }}
            customer={selectedCustomer}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Customer Form Modal Component
const CustomerModal = ({ isOpen, onClose, onSubmit, customer, title }) => {
  const [formData, setFormData] = useState({
    first_name: customer?.first_name || '',
    last_name: customer?.last_name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    company: customer?.company || '',
    address: customer?.address || '',
    status: customer?.status || 'active',
    notes: customer?.notes || '',
    tags: customer?.tags?.join(', ') || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onSubmit(submitData);
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
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="vip, enterprise, startup"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
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
              {customer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Customer Details Modal Component
const CustomerDetailsModal = ({ isOpen, onClose, customer }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium">
                      {customer.first_name[0]}{customer.last_name[0]}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-medium text-gray-900">
                      {customer.first_name} {customer.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{customer.company}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{customer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{customer.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{customer.address}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {customer.tags && customer.tags.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {customer.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {customer.notes && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Notes</h5>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {customer.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Account Statistics */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Account Statistics</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Package className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <div className="text-2xl font-bold text-blue-900">
                        {customer.total_orders}
                      </div>
                      <div className="text-sm text-blue-600">Total Orders</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div className="ml-3">
                      <div className="text-2xl font-bold text-green-900">
                        {formatCurrency(customer.total_spent)}
                      </div>
                      <div className="text-sm text-green-600">Total Spent</div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-purple-600" />
                    <div className="ml-3">
                      <div className="text-2xl font-bold text-purple-900">
                        {customer.active_services}
                      </div>
                      <div className="text-sm text-purple-600">Active Services</div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-orange-600" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-orange-900">
                        {formatDate(customer.last_login).split(',')[0]}
                      </div>
                      <div className="text-sm text-orange-600">Last Login</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Dates */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h5 className="text-sm font-medium text-gray-700">Account Timeline</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900">{formatDate(customer.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Login:</span>
                    <span className="text-gray-900">{formatDate(customer.last_login)}</span>
                  </div>
                </div>
              </div>

              {/* Sync Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Sync Status</h5>
                {customer.upmind_customer_id ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Synced with Upmind</span>
                    <span className="ml-2 text-xs text-gray-500">
                      (ID: {customer.upmind_customer_id})
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-600">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Local only - not synced</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomersManager; 