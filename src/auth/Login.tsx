import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleAnalyticsService from '../services/GoogleAnalyticsService';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const { login, loading, currentUser } = useAuth();
  const navigate = useNavigate();

  // Add this effect to automatically redirect when authentication state changes
  useEffect(() => {
    if (currentUser) {
      console.log('Login - User is authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted');
    
    // Basic validation
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    // Clear any previous errors
    setFormError('');
    
    try {
      console.log('Attempting login with:', email);
      
      // Call the login function
      await login(email, password);
      
      // Track successful login
      GoogleAnalyticsService.trackLogin();
      
      console.log('Login successful - redirecting to dashboard');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err);
      
      // Provide more specific error messages based on the error
      if (err.response) {
        // Server responded with an error
        if (err.response.status === 401) {
          setFormError('Invalid email or password. Please check your credentials and try again.');
        } else if (err.response.data && err.response.data.message) {
          setFormError(err.response.data.message);
        } else {
          setFormError(`Server error (${err.response.status}): Please try again later.`);
        }
      } else if (err.request) {
        // No response received
        setFormError('Cannot connect to the server. Please check your internet connection and try again.');
      } else {
        // Something else went wrong
        setFormError(err.message || 'Failed to sign in. Please try again.');
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      {/* Back to Home button */}
      <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ 
            textTransform: 'none',
            fontWeight: 500,
            color: 'primary.main'
          }}
        >
          Back to Home
        </Button>
      </Box>

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
            <LockOutlinedIcon />
          </Box>
          <Typography component="h1" variant="h5">
            Sign in to PublishJockey
          </Typography>
        </Box>
        
        {formError && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {formError}
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/forgot-password" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="body2" color="primary">
                Forgot password?
              </Typography>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="body2" color="primary">
                Don't have an account? Sign Up
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 