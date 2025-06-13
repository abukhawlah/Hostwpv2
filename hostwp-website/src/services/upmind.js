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
  }
  
  async makeRequest(endpoint, options = {}) {
    const config = UpmindApiConfig.getActiveConfig();
    UpmindApiConfig.validateConfig(config);
    
    const url = `${config.baseUrl.replace(/\/$/, '')}${endpoint}`;
    const defaultHeaders = {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Brand-ID': config.brandId
    };
    
    const requestOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };
    
    return this.executeWithRetry(url, requestOptions);
  }
  
  async executeWithRetry(url, options, attempt = 1) {
    try {
      console.log(`[Upmind API] ${options.method || 'GET'} ${url} (attempt ${attempt})`);
      
      const response = await fetch(url, options);
      
      // Handle different response scenarios
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log(`[Upmind API] Success:`, data);
          return { success: true, data, status: response.status };
        } else {
          const text = await response.text();
          return { success: true, data: text, status: response.status };
        }
      }
      
      // Handle client and server errors
      const errorData = await this.parseErrorResponse(response);
      
      // Don't retry client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        console.error(`[Upmind API] Client Error (${response.status}):`, errorData);
        return {
          success: false,
          error: errorData.message || `Client error: ${response.status} ${response.statusText}`,
          status: response.status,
          details: errorData
        };
      }
      
      // Retry server errors (5xx) and network issues
      if (attempt < this.maxRetries && (response.status >= 500 || !response.status)) {
        console.warn(`[Upmind API] Server Error (${response.status}), retrying in ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay * attempt);
        return this.executeWithRetry(url, options, attempt + 1);
      }
      
      console.error(`[Upmind API] Server Error (${response.status}):`, errorData);
      return {
        success: false,
        error: errorData.message || `Server error: ${response.status} ${response.statusText}`,
        status: response.status,
        details: errorData
      };
      
    } catch (error) {
      console.error(`[Upmind API] Network Error (attempt ${attempt}):`, error);
      
      // Retry network errors
      if (attempt < this.maxRetries) {
        console.warn(`[Upmind API] Network Error, retrying in ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay * attempt);
        return this.executeWithRetry(url, options, attempt + 1);
      }
      
      return {
        success: false,
        error: `Network error: ${error.message}`,
        details: error
      };
    }
  }
  
  async parseErrorResponse(response) {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        const text = await response.text();
        return { message: text || response.statusText };
      }
    } catch {
      return { message: response.statusText || 'Unknown error' };
    }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main Upmind API Service
class UpmindApiService {
  constructor() {
    this.client = new UpmindHttpClient();
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
  
  // Product Management
  async getProducts() {
    try {
      const response = await this.client.makeRequest('/products');
      
      if (response.success) {
        return {
          ...response,
          data: this.transformProductsResult(response.data)
        };
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch products: ${error.message}`,
        details: error
      };
    }
  }
  
  async createProduct(productData) {
    if (!productData || typeof productData !== 'object') {
      return {
        success: false,
        error: 'Product data is required and must be an object'
      };
    }
    
    try {
      const validatedData = this.validateProductData(productData);
      
      return await this.client.makeRequest('/products', {
        method: 'POST',
        body: JSON.stringify(validatedData)
      });
    } catch (error) {
      return {
        success: false,
        error: `Product creation failed: ${error.message}`,
        details: error
      };
    }
  }
  
  async updateProduct(productId, productData) {
    if (!productId) {
      return {
        success: false,
        error: 'Product ID is required'
      };
    }
    
    if (!productData || typeof productData !== 'object') {
      return {
        success: false,
        error: 'Product data is required and must be an object'
      };
    }
    
    try {
      const validatedData = this.validateProductData(productData, false); // Allow partial updates
      
      return await this.client.makeRequest(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(validatedData)
      });
    } catch (error) {
      return {
        success: false,
        error: `Product update failed: ${error.message}`,
        details: error
      };
    }
  }
  
  async deleteProduct(productId) {
    if (!productId) {
      return {
        success: false,
        error: 'Product ID is required'
      };
    }
    
    try {
      return await this.client.makeRequest(`/products/${productId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      return {
        success: false,
        error: `Product deletion failed: ${error.message}`,
        details: error
      };
    }
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
export const searchDomain = (domain) => upmindApi.searchDomain(domain);
export const renewDomain = (domainId) => upmindApi.renewDomain(domainId);
export const getProducts = () => upmindApi.getProducts();
export const createProduct = (data) => upmindApi.createProduct(data);
export const updateProduct = (id, data) => upmindApi.updateProduct(id, data);
export const deleteProduct = (id) => upmindApi.deleteProduct(id);
export const createClient = (data) => upmindApi.createClient(data);
export const getClients = (filters) => upmindApi.getClients(filters);
export const createOrder = (data) => upmindApi.createOrder(data);
export const getOrders = (filters) => upmindApi.getOrders(filters);

// Export the service instance for advanced usage
export default upmindApi;

// Export configuration utilities
export const getActiveApiConfig = () => UpmindApiConfig.getActiveConfig();
export const validateApiConfig = (config) => UpmindApiConfig.validateConfig(config);
