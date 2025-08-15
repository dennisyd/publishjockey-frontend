import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../services/http';
import tokenManager from '../utils/tokenManager';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://publishjockey-backend.onrender.com/api';

// Debug logging
console.log('🔍 AuthContext loaded with:');
console.log('  REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('  API_BASE_URL:', API_BASE_URL);
console.log('  NODE_ENV:', process.env.NODE_ENV);

// Debug logging only (removed visible popup)

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  subscription: string;
  subscriptionExpires?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  user: User;
}

interface RefreshResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in from secure token manager
  useEffect(() => {
    const accessToken = tokenManager.getAccessToken();
    
    if (accessToken && !tokenManager.isAccessTokenExpired()) {
      try {
        // Set default Authorization header for all requests
        http.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        // Try to get user info from token payload
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        if (payload.userId) {
          // Set minimal user info from token
          setCurrentUser({
            id: payload.userId,
            name: payload.name || 'User',
            email: payload.email || '',
            role: payload.role || 'user',
            subscription: payload.subscription || 'free'
          });
        }
      } catch (error) {
        console.error('Failed to parse token:', error);
        tokenManager.clearTokens();
      }
    }
    setLoading(false);
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (!currentUser) return;

    const accessToken = tokenManager.getAccessToken();
    if (!accessToken) return;

    // Check if token needs refresh
    if (tokenManager.isAccessTokenExpired()) {
      refreshToken();
    } else {
      // Set up refresh timer to refresh 2 minutes before expiry
      const timeUntilExpiry = tokenManager.getTimeUntilExpiry();
      const refreshTime = Math.max(0, (timeUntilExpiry - 2) * 60 * 1000); // 2 minutes before expiry
      
      const refreshTimer = setTimeout(() => {
        refreshToken();
      }, refreshTime);
      
      return () => clearTimeout(refreshTimer);
    }
  }, [currentUser]);

  async function login(email: string, password: string) {
    try {
      console.log(`API_BASE_URL: ${API_BASE_URL}`);
      console.log(`Attempting login for ${email} to ${API_BASE_URL}/auth/login`);
      
      // Test the backend connection first
      try {
        const healthResponse = await http.get('https://publishjockey-backend.onrender.com/health');
        console.log('Backend health check:', healthResponse.data);
      } catch (healthError) {
        console.error('Backend health check failed:', healthError);
      }
      
      // Get CSRF token before login
      try {
        const csrfResponse = await http.get(`${API_BASE_URL}/csrf-token`);
        if (csrfResponse.data.csrfToken) {
          sessionStorage.setItem('csrfToken', csrfResponse.data.csrfToken);
          console.log('CSRF token stored successfully');
        }
      } catch (csrfError) {
        console.warn('CSRF token fetch failed:', csrfError);
      }
      
      // Make API call to backend
      const loginUrl = `${API_BASE_URL}/auth/login`;
      console.log(`Full login URL: ${loginUrl}`);
      const response = await http.post<LoginResponse>(loginUrl, { 
        email, 
        password 
      });
      
      console.log('Login response status:', response.status);
      console.log('Login response data:', JSON.stringify(response.data, null, 2));
      
      if (response.data.success) {
        const { user, token } = response.data;
        
        console.log('Login successful for user:', user.email);
        console.log('Token received:', token ? `${token.substring(0, 10)}...` : 'none');
        
        // Store tokens securely in memory (not localStorage)
        tokenManager.setTokens(token, response.data.refreshToken);
        
        // Set default Authorization header for future requests
        http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setCurrentUser(user);
      } else {
        console.error('Login failed with success=false:', response.data.message);
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function refreshToken() {
    try {
      await tokenManager.refreshTokens();
      
      const newToken = tokenManager.getAccessToken();
      if (newToken) {
        // Update Authorization header
        http.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        // Update user info from token
        const payload = JSON.parse(atob(newToken.split('.')[1]));
        setCurrentUser({
          id: payload.userId,
          name: payload.name || 'User',
          email: payload.email || '',
          role: payload.role || 'user',
          subscription: payload.subscription || 'free'
        });
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, log out the user
      logout();
    }
  }

  function logout() {
    tokenManager.clearTokens();
    delete http.defaults.headers.common['Authorization'];
    sessionStorage.removeItem('csrfToken'); // Clear CSRF token
    setCurrentUser(null);
    navigate('/login');
  }

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 