import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isAuthenticated } = useAuth();
  
  // Not logged in - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Role check, if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  // User is authenticated and has the required role (if specified)
  return <>{children}</>;
}; 