export default async function handler(req, res) {
  // Enable CORS for our domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept, X-Brand-ID');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { endpoint, baseUrl, token, brandId, method = 'GET', body } = req.body;

    if (!endpoint || !baseUrl || !token) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: endpoint, baseUrl, token'
      });
    }

    const url = `${baseUrl.replace(/\/$/, '')}${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Brand-ID': brandId || 'default'
      }
    };

    if (body && method !== 'GET') {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    console.log(`[Upmind Proxy] ${method} ${url}`);
    
    const response = await fetch(url, options);
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return res.status(200).json({ success: true, data, status: response.status });
      } else {
        const text = await response.text();
        return res.status(200).json({ success: true, data: text, status: response.status });
      }
    }

    // Handle errors
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

    return res.status(response.status).json({
      success: false,
      error: errorData.message || `API error: ${response.status} ${response.statusText}`,
      status: response.status,
      details: errorData
    });

  } catch (error) {
    console.error('[Upmind Proxy] Error:', error);
    return res.status(500).json({
      success: false,
      error: `Proxy error: ${error.message}`,
      details: error
    });
  }
} 