import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const API_URL = process.env.REACT_APP_API_URL || 'https://publishjockey-backend.onrender.com/api';

// Define response type
interface AuthResponse {
  success: boolean;
  message: string;
}

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  
  // Get token from either URL params or query params
  const token = params.token || searchParams.get('token');
  
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  console.log('🔍 VerifyEmail component loaded with token:', token ? `${token.substring(0, 10)}...` : 'null');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerifying(false);
        setError('Invalid verification link. No token provided.');
        return;
      }

      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/auth/verify-email?token=${token}`);
        setSuccess(true);
        setVerifying(false);
      } catch (err: any) {
        setVerifying(false);
        if (err.response && err.response.data) {
          setError(err.response.data.message || 'Verification failed');
        } else {
          setError('Unable to connect to server');
        }
      }
    };

    verifyEmail();
  }, [token]);

  if (verifying) {
    return (
      <Container component="main" maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Verifying your email...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
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
        {success ? (
          <>
            <Box
              sx={{
                bgcolor: 'success.main',
                color: 'white',
                p: 2,
                borderRadius: '50%',
                mb: 2
              }}
            >
              <MarkEmailReadIcon fontSize="large" />
            </Box>
            <Typography component="h1" variant="h5" gutterBottom>
              Email Verified!
            </Typography>
            <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
              Your email has been successfully verified.
            </Alert>
            <Typography variant="body1" align="center" paragraph>
              Thank you for verifying your email address. Your account is now active.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Sign In
            </Button>
          </>
        ) : (
          <>
            <Box
              sx={{
                bgcolor: 'error.main',
                color: 'white',
                p: 2,
                borderRadius: '50%',
                mb: 2
              }}
            >
              <ErrorOutlineIcon fontSize="large" />
            </Box>
            <Typography component="h1" variant="h5" gutterBottom>
              Verification Failed
            </Typography>
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
            <Typography variant="body1" align="center" paragraph>
              We couldn't verify your email address. The link may have expired or is invalid.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/register')}
              >
                Register Again
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default VerifyEmail; 