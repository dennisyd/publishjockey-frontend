import axios, { InternalAxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ENV } from '../config/env';
import tokenManager from '../utils/tokenManager';

// Extend Axios config type to include our custom properties
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean;
  _retry?: boolean;
}

// Track generated UUIDs for debugging
const generatedUUIDs = new Set();
let requestCounter = 0;

// Centralized Axios instance for frontend API calls
export const http = axios.create({
  baseURL: ENV.API_URL.replace(/\/$/, ''),
  withCredentials: true, // Enable cookies for CSRF protection
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});

// Add security headers to all requests
http.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Cast to our custom type for internal use
  const customConfig = config as CustomAxiosRequestConfig;
  
  // Skip anti-replay protection for CSRF token endpoint and auth routes
  if (!customConfig.url?.includes('/csrf-token') && !customConfig.url?.includes('/auth/')) {
    // Increment request counter
    requestCounter++;
    
    // Generate a unique UUID for each request
    const nonce = uuidv4();
    const timestamp = Date.now().toString();
    
    // Verify UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(nonce);
    
    // Check if this UUID was already generated (should never happen)
    if (generatedUUIDs.has(nonce)) {
      console.error('DUPLICATE UUID GENERATED ON FRONTEND - this should never happen!');
    } else {
      generatedUUIDs.add(nonce);
    }
    
    // Ensure we're not reusing headers from a previous request
    if (!customConfig.headers) {
      customConfig.headers = {} as any;
    }
    
    // Add nonce and timestamp headers
    (customConfig.headers as any)['x-nonce'] = nonce;
    (customConfig.headers as any)['x-timestamp'] = timestamp;
    

    
    // Add CSRF token if available (but not for CSRF token endpoint)
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      (customConfig.headers as any)['x-csrf-token'] = csrfToken;
    }
  }
  
  // Add authorization header if token is available
  const accessToken = tokenManager.getAccessToken();
  if (accessToken && !tokenManager.isAccessTokenExpired()) {
    (customConfig.headers as any).Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

// Handle token refresh on 401 responses
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    // Check if this is a nonce error - if so, don't retry
    if (error.response?.data?.message === 'Nonce has already been used') {
      console.error('Nonce already used error - not retrying');
      return Promise.reject(error);
    }
    
    // Don't attempt token refresh for login-related endpoints or if no refresh token exists
    const isLoginEndpoint = originalRequest.url?.includes('/auth/login') || 
                           originalRequest.url?.includes('/auth/register') ||
                           originalRequest.url?.includes('/auth/forgot-password');
    
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginEndpoint) {
      originalRequest._retry = true;
      
      try {
        await tokenManager.refreshTokens();
        const newToken = tokenManager.getAccessToken();
        
        if (newToken) {
          // Clear old headers completely
          delete originalRequest.headers['x-nonce'];
          delete originalRequest.headers['x-timestamp'];
          delete originalRequest.headers['Authorization'];
          
          // Set new auth token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          

          return http(originalRequest as any);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Let the calling component handle navigation
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper to manage Authorization header in one place
export function setAuthToken(token?: string): void {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common.Authorization;
  }
}

// Get CSRF token from session storage (set by the server response)
function getCsrfToken(): string {
  return sessionStorage.getItem('csrfToken') || '';
}


