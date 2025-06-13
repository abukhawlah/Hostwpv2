import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Package, 
  Search, 
  RefreshCw, 
  Calendar,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  RefreshCw as Sync,
  Wifi,
  WifiOff,
  Clock,
  X,
  Filter,
  DollarSign,
  User,
  Eye,
  Edit,
  Download,
  CreditCard,
  Truck
} from 'lucide-react';
import { useActiveApiConfig } from '../../hooks/useActiveApiConfig.jsx';
import { getOrders, createOrder } from '../../services/upmind';
import Card from '../ui/Card';
import Button from '../ui/Button';

const OrdersManager = () => {
  const { activeConfig, isValid: isApiConfigValid } = useActiveApiConfig();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [syncStatus, setSyncStatus] = useState('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'ORD-2024-001',
          upmindOrderId: 'umd_order_123456',
          customerName: 'John Smith',
          customerEmail: 'john@example.com',
          status: 'completed',
          total: 299.99,
          currency: 'USD',
          items: [
            { name: 'Business Hosting Plan', quantity: 1, price: 199.99 },
            { name: 'Domain Registration (.com)', quantity: 1, price: 12.99 },
            { name: 'SSL Certificate', quantity: 1, price: 87.01 }
          ],
          createdAt: '2024-06-10T14:30:00Z',
          updatedAt: '2024-06-10T15:45:00Z',
          paymentStatus: 'paid',
          paymentMethod: 'credit_card',
          lastSynced: '2024-06-13T10:30:00Z'
        },
        {
          id: 2,
          orderNumber: 'ORD-2024-002',
          upmindOrderId: 'umd_order_789012',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah@company.com',
          status: 'processing',
          total: 149.99,
          currency: 'USD',
          items: [
            { name: 'Starter Hosting Plan', quantity: 1, price: 99.99 },
            { name: 'Domain Transfer (.org)', quantity: 1, price: 50.00 }
          ],
          createdAt: '2024-06-12T09:15:00Z',
          updatedAt: '2024-06-12T09:15:00Z',
          paymentStatus: 'pending',
          paymentMethod: 'bank_transfer',
          lastSynced: '2024-06-13T09:45:00Z'
        },
        {
          id: 3,
          orderNumber: 'ORD-2024-003',
          upmindOrderId: null,
          customerName: 'Mike Wilson',
          customerEmail: 'mike@startup.io',
          status: 'cancelled',
          total: 599.99,
          currency: 'USD',
          items: [
            { name: 'Enterprise Hosting Plan', quantity: 1, price: 499.99 },
            { name: 'Premium Support', quantity: 1, price: 100.00 }
          ],
          createdAt: '2024-06-08T16:20:00Z',
          updatedAt: '2024-06-09T10:30:00Z',
          paymentStatus: 'refunded',
          paymentMethod: 'credit_card',
          lastSynced: null
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setSyncStatus('error');
      setSyncMessage('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAllOrders = async () => {
    if (!isApiConfigValid) {
      alert('Please configure your Upmind API credentials in Settings first');
      return;
    }

    setSyncStatus('syncing');
    setSyncMessage('Syncing all orders with Upmind...');
    
    try {
      const response = await getOrders();
      if (response.success) {
        setSyncStatus('success');
        setSyncMessage(`Successfully synced ${response.data.length} orders from Upmind`);
        setLastSyncTime(new Date());
        // In real implementation, update local database with Upmind data
        fetchOrders();
      } else {
        throw new Error(response.error || 'Sync failed');
      }
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage(`Sync failed: ${error.message}`);
    }
  };

  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filterStatus !== 'all' && order.status !== filterStatus) {
      return false;
    }
    
    // Period filter
    if (filterPeriod !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      
      switch (filterPeriod) {
        case 'today':
          if (daysDiff > 0) return false;
          break;
        case 'week':
          if (daysDiff > 7) return false;
          break;
        case 'month':
          if (daysDiff > 30) return false;
          break;
        default:
          break;
      }
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.customerEmail.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      processing: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const PaymentStatusBadge = ({ status }) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders and transactions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => window.open('https://upmind.com/orders', '_blank')}
            className="flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View in Upmind
          </Button>
          <Button onClick={() => window.open('https://upmind.com/orders/new', '_blank')} className="flex items-center">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Create Order
          </Button>
        </div>
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
              onClick={handleSyncAllOrders}
              disabled={!isApiConfigValid || syncStatus === 'syncing'}
              className="flex items-center"
            >
              {syncStatus === 'syncing' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sync className="w-4 h-4 mr-2" />
              )}
              Sync with Upmind
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

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Status:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">
                      {order.customerName} • {order.customerEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={order.status} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Total Amount:</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(order.total, order.currency)}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Order Date:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Payment Method:</span>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {order.paymentMethod.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items:</h4>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(item.price, order.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sync Status and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {order.upmindOrderId ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
                      <Sync className="w-3 h-3 mr-1" />
                      Synced with Upmind
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                      Local Only
                    </span>
                  )}
                  
                  {order.lastSynced && (
                    <span className="text-xs text-gray-500">
                      Last synced: {new Date(order.lastSynced).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderModal(true);
                    }}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  {order.upmindOrderId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://upmind.com/orders/${order.upmindOrderId}`, '_blank')}
                      title="View in Upmind"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' || filterPeriod !== 'all'
              ? "No orders match your current filters."
              : "No orders have been created yet."
            }
          </p>
          <Button onClick={() => window.open('https://upmind.com/orders/new', '_blank')} className="flex items-center mx-auto">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Create First Order
          </Button>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOrderModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Order Header */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedOrder.orderNumber}</h3>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={selectedOrder.status} />
                    <PaymentStatusBadge status={selectedOrder.paymentStatus} />
                  </div>
                </div>
                <p className="text-gray-600">
                  Created: {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
                <p className="text-gray-600">
                  Updated: {new Date(selectedOrder.updatedAt).toLocaleString()}
                </p>
              </div>

              {/* Customer Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium text-gray-900">{selectedOrder.customerEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatCurrency(item.price, selectedOrder.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="2" className="px-4 py-3 text-sm font-medium text-gray-900">Total:</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">
                          {formatCurrency(selectedOrder.total, selectedOrder.currency)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Payment Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Payment Method:</span>
                      <p className="font-medium text-gray-900 capitalize">
                        {selectedOrder.paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Payment Status:</span>
                      <div className="mt-1">
                        <PaymentStatusBadge status={selectedOrder.paymentStatus} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowOrderModal(false)}
                >
                  Close
                </Button>
                {selectedOrder.upmindOrderId && (
                  <Button
                    onClick={() => window.open(`https://upmind.com/orders/${selectedOrder.upmindOrderId}`, '_blank')}
                    className="flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View in Upmind
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager; 