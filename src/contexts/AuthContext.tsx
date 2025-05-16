import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define the base URL for API calls
const API_BASE_URL = 'http://localhost:3001'; // Updated to the backend port

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  subscription?: string;
}

// API response interfaces
interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

interface RegisterResponse {
  success: boolean;
  message: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
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

  async function login(email: string, password: string) {
    try {
      console.log(`Attempting login for ${email} to ${API_BASE_URL}/auth/login`);
      
      // Make API call to backend
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, { 
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
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        name: error.name,
        code: error.code,
        stack: error.stack
      });
      
      // More detailed network error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      }
      
      throw error;
    }
  }

  async function register(email: string, password: string, name: string): Promise<void> {
    try {
      console.log(`Attempting registration for ${email} to ${API_BASE_URL}/auth/register`);
      
      // Make API call to backend
      const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/auth/register`, { 
        email, 
        password,
        name
      });
      
      console.log('Registration response status:', response.status);
      console.log('Registration response data:', JSON.stringify(response.data, null, 2));
      
      if (!response.data.success) {
        console.error('Registration failed with success=false:', response.data.message);
        throw new Error(response.data.message || 'Registration failed');
      }
      
      console.log('Registration successful for:', email);
      // Don't return anything to match Promise<void> return type
    } catch (error: any) {
      console.error('Registration error details:', {
        message: error.message,
        name: error.name,
        code: error.code,
        stack: error.stack
      });
      
      // More detailed network error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      }
      
      throw error;
    }
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Clear authorization header
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 