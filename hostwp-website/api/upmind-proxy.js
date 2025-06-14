// Vercel serverless function to proxy Upmind API requests
// This bypasses CORS issues by making server-side requests

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Extract Upmind API details from request
    const { baseUrl, token, endpoint, method = 'GET', body } = req.body || {};
    
    if (!baseUrl || !token || !endpoint) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: baseUrl, token, endpoint'
      });
    }

    // Construct the full URL
    const fullUrl = `${baseUrl}${endpoint}`;
    
    // Prepare fetch options
    const fetchOptions = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    };

    // Add body for POST/PUT requests
    if (body && (method === 'POST' || method === 'PUT')) {
      fetchOptions.body = JSON.stringify(body);
    }

    console.log(`🔍 Proxying ${method} request to: ${fullUrl}`);

    // Make the request to Upmind API
    const response = await fetch(fullUrl, fetchOptions);
    
    console.log(`📡 Upmind API Response Status: ${response.status}`);
    
    // Get response data
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log(`📦 Upmind API Response Data:`, data);

    // Return the response
    if (response.ok) {
      res.status(200).json({
        success: true,
        data: data,
        status: response.status
      });
    } else {
      res.status(response.status).json({
        success: false,
        error: `Upmind API Error: ${response.status} ${response.statusText}`,
        data: data,
        status: response.status
      });
    }

  } catch (error) {
    console.error('❌ Proxy Error:', error);
    res.status(500).json({
      success: false,
      error: `Proxy Error: ${error.message}`,
      details: error.toString()
    });
  }
} 