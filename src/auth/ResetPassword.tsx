import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';

const API_URL = process.env.REACT_APP_API_URL || 'https://publishjockey-backend.onrender.com';

// Define response type
interface AuthResponse {
  success: boolean;
  message: string;
}

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  // If no token is provided, we'll display an error
  if (!token) {
    return (
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            mt: 8,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Box sx={{ 
              bgcolor: 'error.main', 
              color: 'white', 
              p: 1.5, 
              borderRadius: '50%', 
              mb: 1.5 
            }}>
              <LockResetIcon />
            </Box>
            <Typography component="h1" variant="h5">
              Invalid Reset Link
            </Typography>
          </Box>
          
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            The password reset link is invalid. Please request a new one.
          </Alert>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              component={Link}
              to="/forgot-password"
            >
              Request New Link
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newPassword || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    
    // Clear any previous errors
    setFormError('');
    setError('');
    
    setLoading(true);
    try {
      await axios.post<AuthResponse>(`${API_URL}/auth/reset-password`, { token, newPassword });
      setSuccess(true);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Password reset failed');
      } else {
        setError('Unable to connect to server');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            mt: 8,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Box sx={{ 
              bgcolor: 'success.main', 
              color: 'white', 
              p: 1.5, 
              borderRadius: '50%', 
              mb: 1.5 
            }}>
              <LockResetIcon />
            </Box>
            <Typography component="h1" variant="h5">
              Password Reset Successful
            </Typography>
          </Box>
          
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            Your password has been successfully reset.
          </Alert>
          
          <Typography variant="body1" align="center" paragraph>
            You can now login with your new password.
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 1.5, 
            borderRadius: '50%', 
            mb: 1.5 
          }}>
            <LockResetIcon />
          </Box>
          <Typography component="h1" variant="h5">
            Create New Password
          </Typography>
        </Box>
        
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Please enter your new password.
        </Typography>
        
        {(error || formError) && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {formError || error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="body2" color="primary">
                Back to Login
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword; 