import * as SecureStore from 'expo-secure-store';

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  // If we are in a production/preview build, force the deployed URL to be safe
  if (!__DEV__) {
    return "https://open-door-th8q.onrender.com/api"; 
  }
  return envUrl || "http://192.168.137.1:8000/api";
};

const api = {
  request: async (method: string, endpoint: string, data: any = null, options: any = {}) => {
    const baseUrl = getBaseUrl().replace(/\/$/, "");
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // FIX: This handles the { params } passed from your hooks
    let queryString = "";
    if (method === 'GET' && options.params) {
      // Remove null/undefined values so they don't clutter the URL
      const cleanParams = Object.fromEntries(
        Object.entries(options.params).filter(([_, v]) => v != null)
      );
      const params = new URLSearchParams(cleanParams as any).toString();
      queryString = params ? `?${params}` : "";
    }

    const url = `${baseUrl}${cleanEndpoint}${queryString}`;
    const token = await SecureStore.getItemAsync('userToken');
    const isFormData = data instanceof FormData;

    const headers: any = {
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    // FIX: Correctly handle Content-Type for JSON vs Files
    if (isFormData) {
      // We DELETE this because the browser/runtime must set the 
      // boundary automatically for multipart/form-data
      delete headers['Content-Type']; 
    } else {
      headers['Content-Type'] = 'application/json';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 15000);

    try {
      console.log(`🌐 [API] ${method} -> ${url}`);
      
      const res = await fetch(url, {
        method,
        signal: controller.signal,
        headers,
        // GET and HEAD requests cannot have a body
        body: method !== 'GET' ? (isFormData ? data : JSON.stringify(data)) : undefined,
      });

      clearTimeout(timeoutId);

      const result = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        const error: any = new Error(`HTTP ${res.status}`);
        error.response = { status: res.status, data: result };
        throw error;
      }
      
      return { data: result, status: res.status };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return { data: { error: "Network failed or timeout" }, status: 0 };
      }
      throw error;
    }
  },

  // These helper methods just wrap the main request function
  get: (endpoint: string, options: any = {}) => api.request('GET', endpoint, null, options),
  post: (endpoint: string, data: any, options: any = {}) => api.request('POST', endpoint, data, options),
  patch: (endpoint: string, data: any, options: any = {}) => api.request('PATCH', endpoint, data, options),
  put: (endpoint: string, data: any, options: any = {}) => api.request('PUT', endpoint, data, options),
  delete: (endpoint: string, options: any = {}) => api.request('DELETE', endpoint, null, options),
};

export default api;