import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
} 