import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Download, 
  Eye,
  Calendar,
  DollarSign,
  User,
  Wifi,
  WifiOff,
  RefreshCw,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  CreditCard,
  Receipt,
  MoreVertical
} from 'lucide-react';
import { useActiveApiConfig } from '../../hooks/useActiveApiConfig.jsx';
import { getInvoices, createInvoice, updateInvoice, sendInvoice } from '../../services/upmind';

const InvoicesManager = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [syncMessage, setSyncMessage] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const { config: apiConfig, isReady: apiReady } = useActiveApiConfig();

  // Mock invoice data
  const mockInvoices = [
    {
      id: 1,
      upmind_invoice_id: 'UPM_INV_001',
      invoice_number: 'INV-2024-001',
      customer_id: 1,
      customer_name: 'John Smith',
      customer_email: 'john.smith@example.com',
      customer_company: 'Smith Enterprises',
      issue_date: '2024-06-01T00:00:00Z',
      due_date: '2024-06-15T00:00:00Z',
      paid_date: '2024-06-10T14:30:00Z',
      status: 'paid',
      subtotal: 299.00,
      tax_amount: 23.92,
      total_amount: 322.92,
      currency: 'USD',
      items: [
        {
          description: 'Business Hosting Plan - Monthly',
          quantity: 1,
          unit_price: 299.00,
          total: 299.00
        }
      ],
      payment_method: 'credit_card',
      notes: 'Payment received via Stripe',
      sent_count: 1,
      last_sent: '2024-06-01T09:00:00Z'
    },
    {
      id: 2,
      upmind_invoice_id: 'UPM_INV_002',
      invoice_number: 'INV-2024-002',
      customer_id: 2,
      customer_name: 'Sarah Johnson',
      customer_email: 'sarah.j@techstartup.com',
      customer_company: 'Tech Startup Inc',
      issue_date: '2024-06-05T00:00:00Z',
      due_date: '2024-06-20T00:00:00Z',
      paid_date: null,
      status: 'pending',
      subtotal: 199.00,
      tax_amount: 15.92,
      total_amount: 214.92,
      currency: 'USD',
      items: [
        {
          description: 'Startup Hosting Plan - Monthly',
          quantity: 1,
          unit_price: 199.00,
          total: 199.00
        }
      ],
      payment_method: null,
      notes: 'Awaiting payment',
      sent_count: 2,
      last_sent: '2024-06-12T10:00:00Z'
    },
    {
      id: 3,
      upmind_invoice_id: null,
      invoice_number: 'INV-2024-003',
      customer_id: 3,
      customer_name: 'Mike Davis',
      customer_email: 'mike.davis@freelancer.com',
      customer_company: 'Davis Design Studio',
      issue_date: '2024-06-10T00:00:00Z',
      due_date: '2024-06-25T00:00:00Z',
      paid_date: null,
      status: 'overdue',
      subtotal: 99.00,
      tax_amount: 7.92,
      total_amount: 106.92,
      currency: 'USD',
      items: [
        {
          description: 'Basic Hosting Plan - Monthly',
          quantity: 1,
          unit_price: 99.00,
          total: 99.00
        }
      ],
      payment_method: null,
      notes: 'Payment overdue - follow up required',
      sent_count: 3,
      last_sent: '2024-06-20T15:00:00Z'
    },
    {
      id: 4,
      upmind_invoice_id: 'UPM_INV_004',
      invoice_number: 'INV-2024-004',
      customer_id: 4,
      customer_name: 'Emily Chen',
      customer_email: 'emily.chen@bloggerlife.com',
      customer_company: 'Blogger Life',
      issue_date: '2024-06-12T00:00:00Z',
      due_date: '2024-06-27T00:00:00Z',
      paid_date: null,
      status: 'draft',
      subtotal: 149.00,
      tax_amount: 11.92,
      total_amount: 160.92,
      currency: 'USD',
      items: [
        {
          description: 'Personal Hosting Plan - Monthly',
          quantity: 1,
          unit_price: 149.00,
          total: 149.00
        }
      ],
      payment_method: null,
      notes: 'Draft invoice - not yet sent',
      sent_count: 0,
      last_sent: null
    }
  ];

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchTerm, statusFilter, dateFilter]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from your database
      // If Upmind API is configured, sync with Upmind
      if (apiReady && apiConfig) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    let filtered = invoices;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer_company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(invoice => 
            new Date(invoice.issue_date) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(invoice => 
            new Date(invoice.issue_date) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(invoice => 
            new Date(invoice.issue_date) >= filterDate
          );
          break;
      }
    }

    setFilteredInvoices(filtered);
  };

  const handleSyncWithUpmind = async () => {
    if (!apiReady || !apiConfig) {
      setSyncMessage('API configuration not available');
      setSyncStatus('error');
      return;
    }

    setSyncStatus('syncing');
    setSyncMessage('Syncing invoices with Upmind...');

    try {
      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSyncStatus('success');
      setSyncMessage('Successfully synced with Upmind');
      setLastSyncTime(new Date());
      
      // Reload invoices after sync
      await loadInvoices();
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage('Failed to sync with Upmind: ' + error.message);
    }
  };

  const handleSendInvoice = async (invoiceId) => {
    try {
      // In a real app, this would send the invoice via email
      const updatedInvoices = invoices.map(invoice =>
        invoice.id === invoiceId
          ? { 
              ...invoice, 
              sent_count: invoice.sent_count + 1,
              last_sent: new Date().toISOString(),
              status: invoice.status === 'draft' ? 'pending' : invoice.status
            }
          : invoice
      );

      setInvoices(updatedInvoices);
      alert('Invoice sent successfully!');
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice');
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Paid' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      overdue: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Overdue' },
      draft: { color: 'bg-gray-100 text-gray-800', icon: FileText, label: 'Draft' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' }
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTotalStats = () => {
    const stats = filteredInvoices.reduce((acc, invoice) => {
      acc.total += invoice.total_amount;
      if (invoice.status === 'paid') {
        acc.paid += invoice.total_amount;
      } else if (invoice.status === 'pending') {
        acc.pending += invoice.total_amount;
      } else if (invoice.status === 'overdue') {
        acc.overdue += invoice.total_amount;
      }
      return acc;
    }, { total: 0, paid: 0, pending: 0, overdue: 0 });

    return stats;
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage invoices and sync with Upmind billing
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Receipt className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-blue-900">
                {formatCurrency(stats.total)}
              </div>
              <div className="text-sm text-blue-600">Total Amount</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(stats.paid)}
              </div>
              <div className="text-sm text-green-600">Paid</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-yellow-900">
                {formatCurrency(stats.pending)}
              </div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-red-900">
                {formatCurrency(stats.overdue)}
              </div>
              <div className="text-sm text-red-600">Overdue</div>
            </div>
          </div>
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
                placeholder="Search invoices..."
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
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
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
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.invoice_number}
                    </div>
                    <div className="text-sm text-gray-500">
                      Issued: {formatDate(invoice.issue_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.customer_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.customer_company}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(invoice.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(invoice.due_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.upmind_invoice_id ? (
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
                          setSelectedInvoice(invoice);
                          setShowDetailsModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {invoice.status !== 'paid' && (
                        <button
                          onClick={() => handleSendInvoice(invoice.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Send Invoice"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
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

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first invoice.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Invoice Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedInvoice && (
          <InvoiceDetailsModal
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedInvoice(null);
            }}
            invoice={selectedInvoice}
            onSend={() => handleSendInvoice(selectedInvoice.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Invoice Details Modal Component
const InvoiceDetailsModal = ({ isOpen, onClose, invoice, onSend }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
            <h3 className="text-lg font-medium text-gray-900">Invoice Details</h3>
            <div className="flex items-center space-x-2">
              {invoice.status !== 'paid' && (
                <button
                  onClick={() => {
                    onSend();
                    onClose();
                  }}
                  className="btn-primary text-sm flex items-center"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Send Invoice
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Invoice Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-lg text-gray-600">{invoice.invoice_number}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">HostWP</div>
                <p className="text-sm text-gray-600">Premium WordPress Hosting</p>
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bill To:</h3>
              <div className="text-gray-600">
                <p className="font-medium">{invoice.customer_name}</p>
                {invoice.customer_company && <p>{invoice.customer_company}</p>}
                <p>{invoice.customer_email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Details:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Issue Date:</span>
                  <span className="text-gray-900">{formatDate(invoice.issue_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="text-gray-900">{formatDate(invoice.due_date)}</span>
                </div>
                {invoice.paid_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid Date:</span>
                    <span className="text-green-600">{formatDate(invoice.paid_date)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Items:</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Unit Price</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.unit_price)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900">{formatCurrency(invoice.tax_amount)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">{formatCurrency(invoice.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notes:</h3>
              <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{invoice.notes}</p>
            </div>
          )}

          {/* Send History */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Send History:</h3>
            <div className="text-sm text-gray-600">
              <p>Sent {invoice.sent_count} time(s)</p>
              {invoice.last_sent && (
                <p>Last sent: {formatDate(invoice.last_sent)}</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvoicesManager; 