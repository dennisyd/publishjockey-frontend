import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface RegisterResponse {
  success: boolean;
  message?: string;
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
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (password !== passwordConfirm) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Register the user
      const registerResponse = await axios.post<RegisterResponse>('http://localhost:3001/api/auth/register', {
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 8 
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Sign Up
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
              name="passwordConfirm"
              label="Confirm Password"
              type="password"
              id="passwordConfirm"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Sign Up
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account? <Link to="/login">Sign In</Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 