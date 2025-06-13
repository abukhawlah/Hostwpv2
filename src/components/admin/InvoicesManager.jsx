import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Eye, 
  Download,
  User,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Wifi,
  WifiOff,
  Plus,
  Filter
} from 'lucide-react';
import { useActiveApiConfig } from '../../hooks/useActiveApiConfig';
import { getOrders } from '../../services/upmind';

const InvoicesManager = () => {
  const { activeConfig, isValid: isApiConfigured } = useActiveApiConfig();
  
  // State management
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Mock invoices data
  const mockInvoices = [
    {
      id: 'INV-2024-001',
      invoiceNumber: 'INV-001',
      customer: { name: 'John Smith', email: 'john@example.com', company: 'Tech Solutions Inc.' },
      status: 'paid',
      amount: 299.99,
      currency: 'USD',
      dueDate: '2024-01-30T00:00:00Z',
      issueDate: '2024-01-15T10:30:00Z',
      paidDate: '2024-01-20T14:22:00Z',
      items: [
        { description: 'WordPress Hosting Pro - Monthly', quantity: 1, unitPrice: 299.99, total: 299.99 }
      ],
      upmindInvoiceId: 'UPM-INV-12345',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'INV-2024-002',
      invoiceNumber: 'INV-002',
      customer: { name: 'Sarah Johnson', email: 'sarah@company.com', company: 'Digital Marketing Co.' },
      status: 'pending',
      amount: 599.99,
      currency: 'USD',
      dueDate: '2024-02-15T00:00:00Z',
      issueDate: '2024-01-16T14:20:00Z',
      paidDate: null,
      items: [
        { description: 'Cloud Hosting Enterprise - Monthly', quantity: 1, unitPrice: 599.99, total: 599.99 }
      ],
      upmindInvoiceId: 'UPM-INV-12346',
      paymentMethod: null
    },
    {
      id: 'INV-2024-003',
      invoiceNumber: 'INV-003',
      customer: { name: 'Mike Davis', email: 'mike@startup.io', company: 'Startup Ventures' },
      status: 'overdue',
      amount: 149.99,
      currency: 'USD',
      dueDate: '2024-01-10T00:00:00Z',
      issueDate: '2024-01-01T09:15:00Z',
      paidDate: null,
      items: [
        { description: 'WordPress Hosting Basic - Monthly', quantity: 1, unitPrice: 149.99, total: 149.99 }
      ],
      upmindInvoiceId: null,
      paymentMethod: null
    },
    {
      id: 'INV-2024-004',
      invoiceNumber: 'INV-004',
      customer: { name: 'Emily Chen', email: 'emily@design.co', company: 'Creative Design Studio' },
      status: 'cancelled',
      amount: 399.98,
      currency: 'USD',
      dueDate: '2024-01-25T00:00:00Z',
      issueDate: '2024-01-10T08:15:00Z',
      paidDate: null,
      items: [
        { description: 'WordPress Hosting Pro - Monthly', quantity: 1, unitPrice: 199.99, total: 199.99 },
        { description: 'Domain Registration - .com', quantity: 1, unitPrice: 199.99, total: 199.99 }
      ],
      upmindInvoiceId: 'UPM-INV-12348',
      paymentMethod: null
    }
  ];

  useEffect(() => {
    setInvoices(mockInvoices);
    setFilteredInvoices(mockInvoices);
  }, []);

  // Filter invoices
  useEffect(() => {
    let filtered = invoices;

    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(invoice => 
          new Date(invoice.issueDate) >= filterDate
        );
      }
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter, dateFilter]);

  const handleSyncWithUpmind = async () => {
    if (!isApiConfigured) {
      setSyncMessage('Please configure API settings first');
      return;
    }

    setSyncStatus('syncing');
    setSyncMessage('Syncing invoices with Upmind...');

    try {
      // Note: Using getOrders as a placeholder since Upmind API might not have separate invoice endpoint
      const response = await getOrders();
      if (response.success) {
        setSyncStatus('success');
        setSyncMessage('Invoices synced successfully');
        setLastSyncTime(new Date());
      } else {
        setSyncStatus('error');
        setSyncMessage(response.error || 'Failed to sync invoices');
      }
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage('Error syncing invoices: ' + error.message);
    }

    setTimeout(() => {
      setSyncStatus('idle');
      setSyncMessage('');
    }, 3000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      overdue: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
      draft: { color: 'bg-blue-100 text-blue-800', icon: FileText }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'paid' || status === 'cancelled') return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetails(true);
  };

  const handleDownloadInvoice = (invoice) => {
    // Placeholder for download functionality
    console.log('Downloading invoice:', invoice.invoiceNumber);
  };

  const InvoiceDetailsModal = () => {
    if (!selectedInvoice) return null;

    return (
      <AnimatePresence>
        {showInvoiceDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInvoiceDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Invoice Details - {selectedInvoice.invoiceNumber}
                  </h2>
                  <button
                    onClick={() => setShowInvoiceDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Invoice Header */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                      <div className="space-y-1">
                        <p className="font-medium">{selectedInvoice.customer.name}</p>
                        <p className="text-sm text-gray-600">{selectedInvoice.customer.email}</p>
                        <p className="text-sm text-gray-600">{selectedInvoice.customer.company}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Invoice Information</h3>
                      <div className="space-y-1">
                        <p><span className="text-sm text-gray-600">Status:</span> {getStatusBadge(selectedInvoice.status)}</p>
                        <p><span className="text-sm text-gray-600">Issue Date:</span> {formatDate(selectedInvoice.issueDate)}</p>
                        <p><span className="text-sm text-gray-600">Due Date:</span> {formatDate(selectedInvoice.dueDate)}</p>
                        {selectedInvoice.paidDate && (
                          <p><span className="text-sm text-gray-600">Paid Date:</span> {formatDate(selectedInvoice.paidDate)}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Invoice Items */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Invoice Items</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedInvoice.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.unitPrice)}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(item.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Invoice Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-end">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          Total: {formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => handleDownloadInvoice(selectedInvoice)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </button>
                    {selectedInvoice.upmindInvoiceId && (
                      <button
                        onClick={() => window.open(`${activeConfig?.baseUrl}/invoices/${selectedInvoice.upmindInvoiceId}`, '_blank')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
                      >
                        View in Upmind
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage invoices and sync with Upmind billing
          </p>
        </div>
      </div>

      {/* Sync Status Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isApiConfigured ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {isApiConfigured ? 'Connected to Upmind' : 'Not Connected'}
              </span>
            </div>
            {lastSyncTime && (
              <span className="text-sm text-gray-500">
                Last sync: {formatDate(lastSyncTime.toISOString())}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {syncMessage && (
              <span className={`text-sm ${
                syncStatus === 'success' ? 'text-green-600' : 
                syncStatus === 'error' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {syncMessage}
              </span>
            )}
            <button
              onClick={handleSyncWithUpmind}
              disabled={!isApiConfigured || syncStatus === 'syncing'}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              Sync with Upmind
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Invoices ({filteredInvoices.length})
          </h2>
        </div>
        
        {filteredInvoices.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'No invoices have been created yet.'}
            </p>
          </div>
        ) : (
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(invoice.issueDate)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(invoice.dueDate)}
                      </div>
                      {isOverdue(invoice.dueDate, invoice.status) && (
                        <div className="text-xs text-red-600 font-medium">
                          {Math.abs(getDaysUntilDue(invoice.dueDate))} days overdue
                        </div>
                      )}
                      {!isOverdue(invoice.dueDate, invoice.status) && invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                        <div className="text-xs text-gray-500">
                          Due in {getDaysUntilDue(invoice.dueDate)} days
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {invoice.upmindInvoiceId && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Synced
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Details Modal */}
      <InvoiceDetailsModal />
    </div>
  );
};

export default InvoicesManager; 