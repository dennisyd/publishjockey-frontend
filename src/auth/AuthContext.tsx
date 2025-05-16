import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define our API URL
const API_URL = 'http://localhost:3001';

// Define types for our authentication context
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  subscription: 'free' | 'basic' | 'premium';
  subscriptionExpires?: Date;
}

// Define response types
interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string) => Promise<void>;
  clearError: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  // Configure axios with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get<AuthResponse>(`${API_URL}/auth/me`);
        if (res.data.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Error loading user', err);
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
      
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register a new user (real backend)
  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post<AuthResponse>(`${API_URL}/auth/register`, { name, email, password });
      
      if (res.data.success) {
        // Registration successful - backend doesn't return token/user on registration
        // Display success message without setting auth state
        // User will need to verify email and then log in
        setLoading(false);
      } else {
        setError(res.data.message || 'Registration failed');
        throw new Error(res.data.message || 'Registration failed');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed - please try again');
      throw err;
    }
  };

  // Login a user (real backend)
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post<AuthResponse>(`${API_URL}/auth/login`, { email, password });
      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
      } else {
        setError(res.data.message || 'Login failed');
        throw new Error(res.data.message || 'Login failed');
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed - please try again');
      throw err;
    }
  };

  // Logout a user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (name: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put<AuthResponse>(`${API_URL}/auth/update-profile`, { name });
      
      if (res.data.user) {
        setUser(res.data.user);
      }
      
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Profile update failed');
      } else {
        setError('Unable to connect to server');
      }
      throw err;
    }
  };

  // Clear any errors
  const clearError = () => {
    setError(null);
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      isAuthenticated,
      login,
      register,
      logout,
      updateProfile,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 