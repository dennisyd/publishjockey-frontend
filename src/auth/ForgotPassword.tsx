import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import EmailIcon from '@mui/icons-material/Email';

const API_URL = process.env.REACT_APP_API_URL || 'https://publishjockey-backend.onrender.com';

// Define response type
interface AuthResponse {
  success: boolean;
  message: string;
}

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      setFormError('Please enter your email address');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    // Clear any previous errors
    setFormError('');
    setError('');
    
    setLoading(true);
    try {
      await axios.post<AuthResponse>(`${API_URL}/auth/forgot-password`, { email });
      setSuccess(true);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Request failed');
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
              <EmailIcon />
            </Box>
            <Typography component="h1" variant="h5">
              Check Your Email
            </Typography>
          </Box>
          
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            If the email is registered, you will receive password reset instructions.
          </Alert>
          
          <Typography variant="body1" align="center" paragraph>
            We've sent instructions to reset your password to {email}. Please check your email inbox and spam folder.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" paragraph>
            It may take a few minutes for the email to arrive. The link will expire in 1 hour.
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              component={Link}
              to="/login"
            >
              Back to Login
            </Button>
          </Box>
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
            <EmailIcon />
          </Box>
          <Typography component="h1" variant="h5">
            Reset Your Password
          </Typography>
        </Box>
        
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Enter your email address and we'll send you a link to reset your password.
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
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

export default ForgotPassword; 