import axios from 'axios';
import { ENV } from '../config/env';
import tokenManager from '../utils/tokenManager';

// Centralized Axios instance for frontend API calls
export const http = axios.create({
  baseURL: ENV.API_URL.replace(/\/$/, ''),
  withCredentials: true // Enable cookies for CSRF protection
});

// Add security headers to all requests
http.interceptors.request.use((config) => {
  // Add nonce and timestamp for anti-replay protection
  const nonce = generateNonce();
  const timestamp = Date.now().toString();
  
  config.headers['x-nonce'] = nonce;
  config.headers['x-timestamp'] = timestamp;
  
  // Add CSRF token if available
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
    if (process.env.NODE_ENV === 'development') {
      console.log('Adding CSRF token to request:', `${csrfToken.substring(0, 8)}...`);
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.log('No CSRF token available for request');
    }
  }
  
  // Add authorization header if token is available
  const accessToken = tokenManager.getAccessToken();
  if (accessToken && !tokenManager.isAccessTokenExpired()) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

// Handle token refresh on 401 responses
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await tokenManager.refreshTokens();
        const newToken = tokenManager.getAccessToken();
        
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return http(originalRequest);
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

// Generate cryptographically secure nonce
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Get CSRF token from cookie
function getCsrfToken(): string {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1] || '';
  
  if (process.env.NODE_ENV === 'development') {
    console.log('CSRF token from cookie:', token ? `${token.substring(0, 8)}...` : 'not found');
  }
  
  return token;
}


