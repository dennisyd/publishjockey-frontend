import axios from 'axios';
import tokenManager from '../utils/tokenManager';

// HTTP service for export backend calls
export const exportHttp = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://publishjockey-export.onrender.com'
    : '', // Use relative URLs for proxy in development
  withCredentials: true
});

// Add authentication headers to all requests
exportHttp.interceptors.request.use((config) => {
  // Add authorization header if token is available
  const accessToken = tokenManager.getAccessToken();
  if (accessToken && !tokenManager.isAccessTokenExpired()) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

// Handle token refresh on 401 responses
exportHttp.interceptors.response.use(
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
          return exportHttp(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
