import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  // Check if user is logged in from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        // Set default Authorization header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (!currentUser) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Parse the JWT to get expiration time
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expTime = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiry = expTime - now;
      
      // If token expires in less than 5 minutes, refresh it
      if (timeUntilExpiry < 5 * 60 * 1000) {
        refreshToken();
      } else {
        // Set up refresh timer to refresh 5 minutes before expiry
        const refreshTime = timeUntilExpiry - (5 * 60 * 1000);
        const refreshTimer = setTimeout(() => {
          refreshToken();
        }, refreshTime);
        
        return () => clearTimeout(refreshTimer);
      }
    } catch (error) {
      console.error('Error parsing JWT token:', error);
    }
  }, [currentUser]);

  async function login(email: string, password: string) {
    try {
      console.log(`API_BASE_URL: ${API_BASE_URL}`);
      console.log(`Attempting login for ${email} to ${API_BASE_URL}/auth/login`);
      
      // Test the backend connection first
      try {
        const healthResponse = await axios.get('https://publishjockey-backend.onrender.com/health');
        console.log('Backend health check:', healthResponse.data);
      } catch (healthError) {
        console.error('Backend health check failed:', healthError);
      }
      
      // Make API call to backend
      const loginUrl = `${API_BASE_URL}/auth/login`;
      console.log(`Full login URL: ${loginUrl}`);
      const response = await axios.post<LoginResponse>(loginUrl, { 
        email, 
        password 
      });
      
      console.log('Login response status:', response.status);
      console.log('Login response data:', JSON.stringify(response.data, null, 2));
      
      if (response.data.success) {
        const { user, token } = response.data;
        
        console.log('Login successful for user:', user.email);
        console.log('Token received:', token ? `${token.substring(0, 10)}...` : 'none');
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set default Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token to refresh');
      }

      console.log('Refreshing token...');
      
      const response = await axios.post<RefreshResponse>(`${API_BASE_URL}/auth/refresh`, {
        refreshToken: token
      });
      
      if (response.data.success) {
        const { user, token: newToken } = response.data;
        
        console.log('Token refreshed successfully');
        
        // Update stored token
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        setCurrentUser(user);
      } else {
        throw new Error(response.data.message || 'Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, log out the user
      logout();
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
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