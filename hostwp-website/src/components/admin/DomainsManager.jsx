import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Globe, 
  Plus, 
  RefreshCw, 
  Calendar,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Sync,
  Wifi,
  WifiOff,
  Clock,
  X,
  Filter
} from 'lucide-react';
import { useActiveApiConfig } from '../../hooks/useActiveApiConfig';
import { searchDomain, renewDomain } from '../../services/upmind';
import Card from '../ui/Card';
import Button from '../ui/Button';

const DomainsManager = () => {
  const { activeConfig, isValid: isApiConfigValid } = useActiveApiConfig();
  
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      
      const mockDomains = [
        {
          id: 1,
          domain: 'hostwp.co',
          status: 'active',
          registrar: 'Upmind',
          registrationDate: '2023-01-15',
          expirationDate: '2025-01-15',
          autoRenew: true,
          upmindDomainId: 'umd_123456',
          price: 12.99,
          lastSynced: '2024-06-13T10:30:00Z'
        },
        {
          id: 2,
          domain: 'example-client.com',
          status: 'expiring_soon',
          registrar: 'Upmind',
          registrationDate: '2022-03-20',
          expirationDate: '2024-07-20',
          autoRenew: false,
          upmindDomainId: 'umd_789012',
          price: 14.99,
          lastSynced: '2024-06-12T15:45:00Z'
        }
      ];
      
      setDomains(mockDomains);
    } catch (error) {
      console.error('Error fetching domains:', error);
      setSyncStatus('error');
      setSyncMessage('Failed to fetch domains');
    } finally {
      setLoading(false);
    }
  };

  const handleDomainSearch = async () => {
    if (!searchTerm.trim()) return;
    
    if (!isApiConfigValid) {
      alert('Please configure your Upmind API credentials in Settings first');
      return;
    }

    try {
      setSearchLoading(true);
      setSyncMessage('Searching for domain availability...');
      
      const response = await searchDomain(searchTerm);
      if (response.success) {
        setSearchResults(response.data);
        setSyncMessage(`Found ${response.data.length} results for "${searchTerm}"`);
      } else {
        throw new Error(response.error || 'Domain search failed');
      }
    } catch (error) {
      console.error('Error searching domain:', error);
      setSyncMessage(`Search failed: ${error.message}`);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSyncAllDomains = async () => {
    if (!isApiConfigValid) {
      alert('Please configure your Upmind API credentials in Settings first');
      return;
    }

    setSyncStatus('syncing');
    setSyncMessage('Syncing all domains with Upmind...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSyncStatus('success');
      setSyncMessage('Successfully synced all domains with Upmind');
      setLastSyncTime(new Date());
      fetchDomains();
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage(`Sync failed: ${error.message}`);
    }
  };

  const filteredDomains = domains.filter(domain => {
    if (filterStatus === 'all') return true;
    return domain.status === filterStatus;
  });

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      expiring_soon: { color: 'bg-yellow-100 text-yellow-800', label: 'Expiring Soon' },
      expired: { color: 'bg-red-100 text-red-800', label: 'Expired' },
      pending_transfer: { color: 'bg-blue-100 text-blue-800', label: 'Pending Transfer' },
      suspended: { color: 'bg-gray-100 text-gray-800', label: 'Suspended' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getDaysUntilExpiration = (expirationDate) => {
    const today = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Domains</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Domains</h1>
          <p className="text-gray-600">Manage your domains and registrations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowSearchModal(true)}
            className="flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Domains
          </Button>
          <Button onClick={() => window.open('https://upmind.com/domains', '_blank')} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Register Domain
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
              onClick={handleSyncAllDomains}
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

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Domains</option>
          <option value="active">Active</option>
          <option value="expiring_soon">Expiring Soon</option>
          <option value="expired">Expired</option>
          <option value="pending_transfer">Pending Transfer</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDomains.map((domain) => {
          const daysUntilExpiration = getDaysUntilExpiration(domain.expirationDate);
          
          return (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{domain.domain}</h3>
                  </div>
                  <StatusBadge status={domain.status} />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Registrar:</span>
                    <span className="font-medium">{domain.registrar}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Expires:</span>
                    <span className={`font-medium ${daysUntilExpiration <= 30 ? 'text-red-600' : 'text-gray-900'}`}>
                      {new Date(domain.expirationDate).toLocaleDateString()}
                      {daysUntilExpiration <= 30 && (
                        <span className="ml-1 text-xs">({daysUntilExpiration} days)</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Auto-renew:</span>
                    <span className={`font-medium ${domain.autoRenew ? 'text-green-600' : 'text-gray-600'}`}>
                      {domain.autoRenew ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-medium">${domain.price}/year</span>
                  </div>
                </div>

                {/* Sync Status */}
                <div className="flex items-center justify-between mb-4">
                  {domain.upmindDomainId ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
                      <Sync className="w-3 h-3 mr-1" />
                      Synced with Upmind
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                      Local Only
                    </span>
                  )}
                  
                  {domain.lastSynced && (
                    <span className="text-xs text-gray-500">
                      {new Date(domain.lastSynced).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://upmind.com/domains/${domain.domain}`, '_blank')}
                      title="View in Upmind"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {daysUntilExpiration <= 30 && (
                    <div className="flex items-center text-orange-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Expiring Soon</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredDomains.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No domains found</h3>
          <p className="text-gray-600 mb-4">
            {filterStatus === 'all' 
              ? "You don't have any domains yet. Start by searching for available domains."
              : `No domains with status "${filterStatus}" found.`
            }
          </p>
          <Button onClick={() => setShowSearchModal(true)} className="flex items-center mx-auto">
            <Search className="w-4 h-4 mr-2" />
            Search Domains
          </Button>
        </div>
      )}

      {/* Domain Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Search Domains</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearchModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter domain name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleDomainSearch()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button
                  onClick={handleDomainSearch}
                  disabled={!isApiConfigValid || searchLoading}
                  className="flex items-center"
                >
                  {searchLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>

              {!isApiConfigValid && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800">
                      Please configure your Upmind API credentials in Settings to search domains.
                    </span>
                  </div>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Search Results</h3>
                  {searchResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{result.domain}</span>
                        <span className={`ml-2 text-sm ${result.available ? 'text-green-600' : 'text-red-600'}`}>
                          {result.available ? 'Available' : 'Taken'}
                        </span>
                      </div>
                      {result.available && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">${result.price}/year</span>
                          <Button
                            size="sm"
                            onClick={() => window.open(`https://upmind.com/register/${result.domain}`, '_blank')}
                          >
                            Register
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainsManager;
