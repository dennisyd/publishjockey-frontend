import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress, 
  Alert, 
  AlertTitle, 
  Divider 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { verifySession } from '../services/stripeService';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');

    const verifyPayment = async () => {
      if (!sessionId) {
        setError('No session ID found in URL');
        setLoading(false);
        return;
      }

      try {
        const data = await verifySession(sessionId);
        console.log('Payment verification response:', data);
        
        setSessionData(data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error verifying payment:', err);
        setError(err.response?.data?.message || 'An error occurred verifying your payment');
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location]);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '80vh',
          p: 3
        }}
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h5" sx={{ mb: 1 }}>Verifying your payment...</Typography>
        <Typography variant="body1" color="text.secondary">
          Please wait while we confirm your payment with Stripe.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Payment Verification Error</AlertTitle>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleContinue}
        >
          Return to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 48, mr: 2 }} />
          <Typography variant="h4">
            Payment Successful!
          </Typography>
        </Box>

        <Alert severity="success" sx={{ mb: 4 }}>
          <AlertTitle>Your payment has been completed successfully</AlertTitle>
          Your account has been upgraded to the <strong>{sessionData?.plan?.name || 'new'}</strong> plan.
        </Alert>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Subscription Details
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Plan:</strong> {sessionData?.plan?.name || 'Unknown Plan'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Book Allowance:</strong> {sessionData?.user?.booksAllowed || 0} books
          </Typography>
          <Typography variant="body1">
            <strong>Books Remaining:</strong> {sessionData?.user?.booksRemaining || 0} books
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          fullWidth 
          onClick={handleContinue}
          sx={{ py: 1.5 }}
        >
          Continue to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default PaymentSuccess; 