import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Types
interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      
      // Register the user
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const registerResponse = await axios.post<RegisterResponse>(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password
      });
      
      if (registerResponse.data.success) {
        // After successful registration, log the user in
        await login(email, password);
        navigate('/dashboard');
      } else {
        setError(registerResponse.data.message || 'Failed to create an account');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create an account');
      console.error(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ p: 4, width: '100%' }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography component="h1" variant="h5">
              Create an Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join PublishJockey
            </Typography>
          </Box>
          
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link to="/login">
                <Typography variant="body2">
                  Already have an account? Sign in
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 