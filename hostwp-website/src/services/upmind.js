/**
 * Upmind API Service Layer
 * 
 * This service provides a comprehensive interface to interact with Upmind's API
 * for managing domains, hosting plans, clients, and orders. It dynamically loads
 * the active API configuration from localStorage and handles all API communication.
 */

// API Configuration Management
class UpmindApiConfig {
  static getActiveConfig() {
    try {
      const configs = localStorage.getItem('hostwp_api_configs');
      const activeConfigId = localStorage.getItem('hostwp_active_api_config');
      
      if (!configs || !activeConfigId) {
        throw new Error('No API configuration found. Please configure your Upmind API credentials in Settings.');
      }
      
      const parsedConfigs = JSON.parse(configs);
      const activeConfig = parsedConfigs.find(config => config.id === activeConfigId);
      
      if (!activeConfig) {
        throw new Error('Active API configuration not found. Please select an active configuration in Settings.');
      }
      
      return activeConfig;
    } catch (error) {
      console.error('Error loading API configuration:', error);
      throw error;
    }
  }
  
  static validateConfig(config) {
    const required = ['baseUrl', 'token', 'brandId'];
    const missing = required.filter(field => !config[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required configuration fields: ${missing.join(', ')}`);
    }
    
    // Validate URL format
    try {
      new URL(config.baseUrl);
    } catch {
      throw new Error('Invalid base URL format in API configuration');
    }
    
    return true;
  }
}

// HTTP Client with retry logic and error handling
class UpmindHttpClient {
  constructor() {
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
    this.useProxy = false; // Flag to use proxy for CORS issues
  }
  
  configure(config) {
    this.baseUrl = config.baseUrl?.replace(/\/$/, '') || '';
    this.token = config.token || '';
    this.brandId = config.brandId || 'default';
    this.useProxy = false; // Reset proxy flag on new config
    
    console.log('[Upmind API] Configured:', {
      baseUrl: this.baseUrl,
      hasToken: !!this.token,
      brandId: this.brandId
    });
  }
  
  async executeWithRetry(url, options, attempt = 1) {
    try {
      console.log(`[Upmind API] ${options.method || 'GET'} ${url} (attempt ${attempt})`);
      
      const response = await fetch(url, options);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log(`✅ [Upmind API] Success:`, { status: response.status, dataLength: JSON.stringify(data).length });
          return { success: true, data, status: response.status };
        } else {
          const text = await response.text();
          console.log(`✅ [Upmind API] Success (text):`, { status: response.status, textLength: text.length });
          return { success: true, data: text, status: response.status };
        }
      }

      // Handle HTTP errors
      let errorData;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = { message: await response.text() || response.statusText };
        }
      } catch {
        errorData = { message: response.statusText || 'Unknown error' };
      }

      console.log(`❌ [Upmind API] HTTP Error:`, { 
        status: response.status, 
        statusText: response.statusText,
        error: errorData 
      });

      return {
        success: false,
        error: errorData.message || `API error: ${response.status} ${response.statusText}`,
        status: response.status,
        details: errorData
      };

    } catch (error) {
      console.log(`❌ [Upmind API] Network Error:`, { 
        message: error.message, 
        name: error.name,
        attempt 
      });

      // Detect CORS or network issues and try proxy
      if (this.isCorsOrNetworkError(error) && !this.useProxy && attempt === 1) {
        console.log(`🔄 [Upmind API] Detected CORS/Network issue, trying proxy...`);
        return this.executeViaProxy(url, options);
      }

      // Retry logic for other errors
      if (attempt < this.maxRetries && this.shouldRetry(error)) {
        console.log(`🔄 [Upmind API] Retrying in ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay);
        return this.executeWithRetry(url, options, attempt + 1);
      }

      // Analyze and return detailed error
      const errorAnalysis = this.analyzeError(error);
      return {
        success: false,
        error: `${errorAnalysis.type}: ${error.message}`,
        details: errorAnalysis
      };
    }
  }
  
  async executeViaProxy(originalUrl, originalOptions) {
    try {
      // Extract endpoint from the original URL
      const endpoint = originalUrl.replace(this.baseUrl, '');
      
      const proxyPayload = {
        baseUrl: this.baseUrl,
        token: this.token,
        endpoint: endpoint,
        method: originalOptions.method || 'GET',
        body: originalOptions.body ? JSON.parse(originalOptions.body) : undefined
      };

      console.log(`🔄 [Upmind Proxy] Calling proxy with:`, { endpoint, method: proxyPayload.method });

      const proxyResponse = await fetch('/api/upmind-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(proxyPayload)
      });

      const proxyResult = await proxyResponse.json();
      
      if (proxyResult.success) {
        console.log(`✅ [Upmind Proxy] Success:`, { status: proxyResult.status });
        this.useProxy = true; // Use proxy for future requests
        return proxyResult;
      } else {
        console.log(`❌ [Upmind Proxy] Failed:`, proxyResult);
        return proxyResult;
      }

    } catch (proxyError) {
      console.log(`❌ [Upmind Proxy] Error:`, proxyError);
      return {
        success: false,
        error: `Proxy error: ${proxyError.message}`,
        details: { proxyError: proxyError.message }
      };
    }
  }
  
  isCorsOrNetworkError(error) {
    const corsIndicators = [
      'Failed to fetch',
      'CORS',
      'Cross-Origin',
      'Network request failed',
      'TypeError: Failed to fetch',
      'net::ERR_FAILED',
      'blocked by CORS policy',
      'CORS policy',
      'Access to fetch',
      'has been blocked by CORS',
      'not allowed by Access-Control-Allow-Headers'
    ];
    
    return corsIndicators.some(indicator => 
      error.message.includes(indicator) || error.name.includes(indicator)
    );
  }
  
  shouldRetry(error) {
    const retryableErrors = [
      'timeout',
      'ECONNRESET',
      'ENOTFOUND',
      'ECONNREFUSED',
      'socket hang up'
    ];
    
    return retryableErrors.some(retryable => 
      error.message.toLowerCase().includes(retryable.toLowerCase())
    );
  }
  
  analyzeError(error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('failed to fetch') || message.includes('cors')) {
      return {
        type: 'CORS or Network error',
        likely_cause: 'Cross-origin request blocked or network connectivity issue',
        suggestions: [
          'Check if the API server allows requests from your domain',
          'Verify the API server is running and accessible',
          'Check network connectivity'
        ]
      };
    }
    
    if (message.includes('timeout')) {
      return {
        type: 'Timeout error',
        likely_cause: 'Request took too long to complete',
        suggestions: ['Check API server performance', 'Verify network stability']
      };
    }
    
    if (message.includes('ssl') || message.includes('certificate')) {
      return {
        type: 'SSL/Certificate error',
        likely_cause: 'SSL certificate issue with the API server',
        suggestions: ['Check SSL certificate validity', 'Verify HTTPS configuration']
      };
    }
    
    return {
      type: 'Unknown network error',
      likely_cause: 'Unspecified network or connectivity issue',
      suggestions: ['Check network connectivity', 'Verify API server status']
    };
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async testConnectivity(baseUrl) {
    console.log(`🔍 Testing connectivity to: ${baseUrl}`);
    
    try {
      // Try a simple HEAD request first
      const testUrl = baseUrl.replace(/\/api\/v1$/, ''); // Remove API path for basic connectivity test
      const response = await fetch(testUrl, { 
        method: 'HEAD',
        mode: 'no-cors' // This bypasses CORS for connectivity test
      });
      
      console.log(`✅ Basic connectivity test completed`);
      return true;
    } catch (error) {
      console.log(`❌ Basic connectivity test failed:`, error.message);
      return false;
    }
  }
  
  async makeRequest(endpoint, options = {}) {
    if (!this.baseUrl || !this.token) {
      throw new Error('Upmind API not configured. Please set baseUrl and token.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Brand-ID': this.brandId,
        ...options.headers
      }
    };

    if (options.body) {
      requestOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    // Check if we're in a browser environment and making cross-origin requests
    const isBrowser = typeof window !== 'undefined';
    const isCrossOrigin = isBrowser && window.location.origin !== new URL(this.baseUrl).origin;
    
    // If we've determined to use proxy, or if this is a cross-origin request in browser, go straight to proxy
    if (this.useProxy || (isBrowser && isCrossOrigin)) {
      console.log(`🔄 [Upmind API] Using proxy for cross-origin request: ${url}`);
      return this.executeViaProxy(url, requestOptions);
    }

    return this.executeWithRetry(url, requestOptions);
  }
  
  async getProducts() {
    console.log('🔍 Fetching products from Upmind API...');
    
    // Test basic connectivity first
    await this.testConnectivity(this.baseUrl);
    
    // List of endpoints to try for products
    const endpoints = [
      '/products',
      '/services', 
      '/hosting-plans',
      '/plans',
      '/service-plans',
      '/brands/default/products',
      '/brands/default/services',
      '/brands/default/plans'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Trying API endpoint: ${endpoint}...`);
        const result = await this.makeRequest(endpoint);
        
        if (result.success && result.data) {
          // Check if we got an array of products/services
          const products = Array.isArray(result.data) ? result.data : 
                          result.data.data ? result.data.data : 
                          result.data.products ? result.data.products :
                          result.data.services ? result.data.services : null;
          
          if (products && Array.isArray(products) && products.length > 0) {
            console.log(`✅ Found ${products.length} products from ${endpoint}`);
            return products;
          }
        }
        
        console.log(`❌ ${endpoint} failed:`, result.error || 'No products found');
        
      } catch (error) {
        console.log(`❌ ${endpoint} error:`, error.message);
      }
    }

    throw new Error('No products found in Upmind. Tried multiple endpoints but none returned product data.');
  }
  
  async getProduct(id) {
    return this.makeRequest(`/products/${id}`);
  }
  
  async createProduct(productData) {
    return this.makeRequest('/products', {
      method: 'POST',
      body: productData
    });
  }
  
  async updateProduct(id, productData) {
    return this.makeRequest(`/products/${id}`, {
      method: 'PUT',
      body: productData
    });
  }
  
  async deleteProduct(id) {
    return this.makeRequest(`/products/${id}`, {
      method: 'DELETE'
    });
  }
}

// Main Upmind API Service
class UpmindApiService {
  constructor() {
    this.client = new UpmindHttpClient(); // Create a new instance
  }
  
  // Configuration method
  configure(config) {
    try {
      // validateApiConfig throws an error if invalid, returns true if valid
      validateApiConfig(config);
      this.client.configure(config);
      return { success: true };
    } catch (error) {
      throw new Error(`Invalid configuration: ${error.message}`);
    }
  }
  
  // Domain Management
  async searchDomain(domain) {
    if (!domain || typeof domain !== 'string') {
      return {
        success: false,
        error: 'Domain parameter is required and must be a string'
      };
    }
    
    try {
      const response = await this.client.makeRequest(`/domains/search`, {
        method: 'POST',
        body: JSON.stringify({ domain: domain.toLowerCase().trim() })
      });
      
      if (response.success) {
        return {
          ...response,
          data: this.transformDomainSearchResult(response.data)
        };
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: `Domain search failed: ${error.message}`,
        details: error
      };
    }
  }
  
  async renewDomain(domainId) {
    if (!domainId) {
      return {
        success: false,
        error: 'Domain ID is required'
      };
    }
    
    try {
      return await this.client.makeRequest(`/domains/${domainId}/renew`, {
        method: 'POST'
      });
    } catch (error) {
      return {
        success: false,
        error: `Domain renewal failed: ${error.message}`,
        details: error
      };
    }
  }
  
    // Connection Testing
  async testConnection(config) {
    try {
      // Validate configuration first
      UpmindApiConfig.validateConfig(config);
      
      // Configure client temporarily for testing
      const originalConfig = { 
        baseUrl: this.client.baseUrl, 
        token: this.client.token, 
        brandId: this.client.brandId 
      };
      
      this.client.configure(config);
      
      // Test basic connectivity
      const connectivityTest = await this.client.testConnectivity(config.baseUrl);
      
      // Test API endpoints
      const endpointsToTest = ['/products', '/services', '/hosting-plans', '/plans'];
      let workingEndpoint = null;
      let apiData = null;
      
      for (const endpoint of endpointsToTest) {
        try {
          const response = await this.client.makeRequest(endpoint);
          if (response.success && response.data) {
            workingEndpoint = endpoint;
            apiData = response.data;
            break;
          }
        } catch (error) {
          console.log(`Endpoint ${endpoint} failed:`, error.message);
        }
      }
      
      // Restore original configuration
      if (originalConfig.baseUrl) {
        this.client.configure(originalConfig);
      }
      
      return {
        success: true,
        connectivity: connectivityTest,
        workingEndpoint,
        dataAvailable: !!apiData,
        dataCount: Array.isArray(apiData) ? apiData.length : 0
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Product Management
  async getProducts() {
    try {
      console.log('🔍 UpmindApiService: Starting product fetch...');
      console.log('🔧 Current client config:', {
        baseUrl: this.client.baseUrl,
        hasToken: !!this.client.token,
        brandId: this.client.brandId
      });
      
      // Check if client is configured
      if (!this.client.baseUrl || !this.client.token) {
        throw new Error('API client not configured. Please check your API settings.');
      }
      
      const products = await this.client.getProducts();
      console.log('✅ UpmindApiService: Products fetched successfully:', products?.length || 0);
      
      // Transform and return the products
      const transformedProducts = this.transformProductsResult(products);
      
      return {
        success: true,
        data: transformedProducts,
        count: transformedProducts?.length || 0
      };
    } catch (error) {
      console.error('❌ UpmindApiService: Error fetching products:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch products from Upmind',
        details: error
      };
    }
  }

  async createProduct(productData) {
    return this.client.createProduct(productData);
  }

  async updateProduct(productId, productData) {
    return this.client.updateProduct(productId, productData);
  }

  async deleteProduct(productId) {
    return this.client.deleteProduct(productId);
  }
  
  // Client Management
  async createClient(clientData) {
    if (!clientData || typeof clientData !== 'object') {
      return {
        success: false,
        error: 'Client data is required and must be an object'
      };
    }
    
    try {
      const validatedData = this.validateClientData(clientData);
      
      return await this.client.makeRequest('/clients', {
        method: 'POST',
        body: JSON.stringify(validatedData)
      });
    } catch (error) {
      return {
        success: false,
        error: `Client creation failed: ${error.message}`,
        details: error
      };
    }
  }
  
  async getClients(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/clients?${queryString}` : '/clients';
      
      const response = await this.client.makeRequest(endpoint);
      
      if (response.success) {
        return {
          ...response,
          data: this.transformClientsResult(response.data)
        };
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch clients: ${error.message}`,
        details: error
      };
    }
  }
  
  // Order Management
  async createOrder(orderData) {
    if (!orderData || typeof orderData !== 'object') {
      return {
        success: false,
        error: 'Order data is required and must be an object'
      };
    }
    
    try {
      const validatedData = this.validateOrderData(orderData);
      
      return await this.client.makeRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(validatedData)
      });
    } catch (error) {
      return {
        success: false,
        error: `Order creation failed: ${error.message}`,
        details: error
      };
    }
  }
  
  async getOrders(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/orders?${queryString}` : '/orders';
      
      const response = await this.client.makeRequest(endpoint);
      
      if (response.success) {
        return {
          ...response,
          data: this.transformOrdersResult(response.data)
        };
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch orders: ${error.message}`,
        details: error
      };
    }
  }

  async updateClient(clientId, clientData) {
    if (!clientId) {
      return {
        success: false,
        error: 'Client ID is required'
      };
    }

    if (!clientData || typeof clientData !== 'object') {
      return {
        success: false,
        error: 'Client data is required and must be an object'
      };
    }

    try {
      const validatedData = this.validateClientData(clientData);
      
      return await this.client.makeRequest(`/clients/${clientId}`, {
        method: 'PUT',
        body: JSON.stringify(validatedData)
      });
    } catch (error) {
      return {
        success: false,
        error: `Client update failed: ${error.message}`,
        details: error
      };
    }
  }

  async deleteClient(clientId) {
    if (!clientId) {
      return {
        success: false,
        error: 'Client ID is required'
      };
    }

    try {
      return await this.client.makeRequest(`/clients/${clientId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      return {
        success: false,
        error: `Client deletion failed: ${error.message}`,
        details: error
      };
    }
  }

  async updateOrder(orderId, orderData) {
    if (!orderId) {
      return {
        success: false,
        error: 'Order ID is required'
      };
    }

    if (!orderData || typeof orderData !== 'object') {
      return {
        success: false,
        error: 'Order data is required and must be an object'
      };
    }

    try {
      const validatedData = this.validateOrderData(orderData);
      
      return await this.client.makeRequest(`/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify(validatedData)
      });
    } catch (error) {
      return {
        success: false,
        error: `Order update failed: ${error.message}`,
        details: error
      };
    }
  }

  async deleteOrder(orderId) {
    if (!orderId) {
      return {
        success: false,
        error: 'Order ID is required'
      };
    }

    try {
      return await this.client.makeRequest(`/orders/${orderId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      return {
        success: false,
        error: `Order deletion failed: ${error.message}`,
        details: error
      };
    }
  }
  
  // Data Validation Methods
  validateProductData(data, requireAll = true) {
    const required = ['name', 'price'];
    const optional = ['description', 'billing_cycle', 'category', 'features', 'visible'];
    
    if (requireAll) {
      const missing = required.filter(field => !data[field]);
      if (missing.length > 0) {
        throw new Error(`Missing required product fields: ${missing.join(', ')}`);
      }
    }
    
    const validated = {};
    
    // Copy and validate required fields
    required.forEach(field => {
      if (data[field] !== undefined) {
        validated[field] = data[field];
      }
    });
    
    // Copy and validate optional fields
    optional.forEach(field => {
      if (data[field] !== undefined) {
        validated[field] = data[field];
      }
    });
    
    // Validate price is a number
    if (validated.price && isNaN(parseFloat(validated.price))) {
      throw new Error('Product price must be a valid number');
    }
    
    return validated;
  }
  
  validateClientData(data) {
    const required = ['email', 'first_name', 'last_name'];
    const optional = ['company', 'phone', 'address', 'city', 'state', 'country', 'postal_code'];
    
    const missing = required.filter(field => !data[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required client fields: ${missing.join(', ')}`);
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }
    
    const validated = {};
    
    // Copy required fields
    required.forEach(field => {
      validated[field] = data[field];
    });
    
    // Copy optional fields
    optional.forEach(field => {
      if (data[field] !== undefined) {
        validated[field] = data[field];
      }
    });
    
    return validated;
  }
  
  validateOrderData(data) {
    const required = ['client_id', 'product_id'];
    const optional = ['quantity', 'billing_cycle', 'notes', 'custom_fields'];
    
    const missing = required.filter(field => !data[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required order fields: ${missing.join(', ')}`);
    }
    
    const validated = {};
    
    // Copy required fields
    required.forEach(field => {
      validated[field] = data[field];
    });
    
    // Copy optional fields
    optional.forEach(field => {
      if (data[field] !== undefined) {
        validated[field] = data[field];
      }
    });
    
    // Validate quantity is a positive number
    if (validated.quantity && (isNaN(parseInt(validated.quantity)) || parseInt(validated.quantity) < 1)) {
      throw new Error('Order quantity must be a positive integer');
    }
    
    return validated;
  }
  
  // Data Transformation Methods
  transformDomainSearchResult(data) {
    // Transform Upmind domain search response to standardized format
    if (Array.isArray(data)) {
      return data.map(domain => ({
        domain: domain.name || domain.domain,
        available: domain.available || false,
        price: domain.price || null,
        currency: domain.currency || 'USD',
        period: domain.period || '1 year',
        premium: domain.premium || false
      }));
    }
    
    return data;
  }
  
  transformProductsResult(data) {
    // Transform Upmind products response to standardized format
    if (Array.isArray(data)) {
      return data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: parseFloat(product.price) || 0,
        currency: product.currency || 'USD',
        billing_cycle: product.billing_cycle || 'monthly',
        category: product.category || 'hosting',
        features: product.features || [],
        visible: product.visible !== false,
        created_at: product.created_at,
        updated_at: product.updated_at
      }));
    }
    
    return data;
  }
  
  transformClientsResult(data) {
    // Transform Upmind clients response to standardized format
    if (Array.isArray(data)) {
      return data.map(client => ({
        id: client.id,
        email: client.email,
        first_name: client.first_name,
        last_name: client.last_name,
        full_name: `${client.first_name} ${client.last_name}`,
        company: client.company || '',
        phone: client.phone || '',
        status: client.status || 'active',
        created_at: client.created_at,
        updated_at: client.updated_at
      }));
    }
    
    return data;
  }
  
  transformOrdersResult(data) {
    // Transform Upmind orders response to standardized format
    if (Array.isArray(data)) {
      return data.map(order => ({
        id: order.id,
        client_id: order.client_id,
        product_id: order.product_id,
        status: order.status || 'pending',
        quantity: parseInt(order.quantity) || 1,
        total: parseFloat(order.total) || 0,
        currency: order.currency || 'USD',
        billing_cycle: order.billing_cycle || 'monthly',
        created_at: order.created_at,
        updated_at: order.updated_at
      }));
    }
    
    return data;
  }
}

// Create and export singleton instance
const upmindApi = new UpmindApiService();

// Export individual functions for easier importing
export const testConnection = (config) => upmindApi.testConnection(config);
export const searchDomain = (domain) => upmindApi.searchDomain(domain);
export const renewDomain = (domainId) => upmindApi.renewDomain(domainId);
export const getProducts = () => upmindApi.getProducts();
export const createProduct = (data) => upmindApi.createProduct(data);
export const updateProduct = (id, data) => upmindApi.updateProduct(id, data);
export const deleteProduct = (id) => upmindApi.deleteProduct(id);
export const createClient = (data) => upmindApi.createClient(data);
export const getClients = (filters) => upmindApi.getClients(filters);
export const updateClient = (id, data) => upmindApi.updateClient(id, data);
export const deleteClient = (id) => upmindApi.deleteClient(id);
export const createOrder = (data) => upmindApi.createOrder(data);
export const getOrders = (filters) => upmindApi.getOrders(filters);
export const updateOrder = (id, data) => upmindApi.updateOrder(id, data);
export const deleteOrder = (id) => upmindApi.deleteOrder(id);

// Customer management (aliases for client functions)
export const getCustomers = (filters) => upmindApi.getClients(filters);
export const createCustomer = (data) => upmindApi.createClient(data);
export const updateCustomer = (id, data) => upmindApi.updateClient(id, data);
export const deleteCustomer = (id) => upmindApi.deleteClient(id);

// Invoice management (placeholder functions - implement as needed)
export const getInvoices = (filters = {}) => upmindApi.getOrders(filters);
export const createInvoice = (data) => upmindApi.createOrder(data);
export const updateInvoice = (id, data) => upmindApi.updateOrder(id, data);
export const sendInvoice = (id) => Promise.resolve({ success: true, message: 'Invoice sent' });

// Export the service instance for advanced usage
export default upmindApi;

// Export configuration utilities
export const getActiveApiConfig = () => UpmindApiConfig.getActiveConfig();
export const validateApiConfig = (config) => UpmindApiConfig.validateConfig(config);
