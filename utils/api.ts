import * as SecureStore from 'expo-secure-store';

// 1. Move the URL check inside or use a reliable fallback
const getBaseUrl = () => {
  return process.env.EXPO_PUBLIC_API_URL || "http://192.168.137.1:8000/api";
};

const api = {
  // 1. Update request to accept an optional 'options' object
  request: async (method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE', endpoint: string, data: any = null, options: any = {}) => {
    
    const cleanBaseUrl = getBaseUrl().replace(/\/$/, "");
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${getBaseUrl()}${endpoint}`;

    console.log(`🌐 [API] Calling: ${method} ${url}`);
    
    const token = await SecureStore.getItemAsync('userToken');

    //for form data
    const isFormData = data instanceof FormData;

    //preparing headers dynamically
    const headers: any = {
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers, // Allow overriding headers
    }

    //ONLY add application/json if not file upload
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    // Handle AbortController for timeouts
    const controller = new AbortController();
    const id = options.timeout ? setTimeout(() => controller.abort(), options.timeout) : null;

    try {
      const res = await fetch(url, {
        method,
        signal: controller.signal, // Connect the abort signal
        headers,
        body: method === 'POST' || method === 'PATCH' || method === 'PUT' ? (isFormData ? data : JSON.stringify(data)) : undefined,
      });

      if (id) clearTimeout(id); // Clear timeout if request succeeds

      const result = await res.json().catch(() => ({}));
      return { data: result, status: res.status };
    } catch (error: any) {
      if (error.name === 'AbortError') console.error("❌ [API] Request timed out");
      return { data: { error: "Network failed" }, status: 0 };
    }
  },

  // 2. Update these to pass the 3rd argument (options) through
  get: (endpoint: string, options: any = {}) => api.request('GET', endpoint, null, options),
  post: (endpoint: string, data: any, options: any = {}) => api.request('POST', endpoint, data, options),
  patch: (endpoint: string, data: any, options: any = {}) => api.request('PATCH', endpoint, data, options),
};

export default api;