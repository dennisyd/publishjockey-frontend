import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { currentUser } = useAuth();
  
  // Not logged in - redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Role check, if required
  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  // User is authenticated and has the required role (if specified)
  return <>{children}</>;
}; 