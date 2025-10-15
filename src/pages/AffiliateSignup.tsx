import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Checkbox,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  AttachMoney,
  People,
  TrendingUp,
  CheckCircle
} from '@mui/icons-material';
import { http } from '../services/http';
import tokenManager from '../utils/tokenManager';

const AffiliateSignup = () => {
  const navigate = useNavigate();
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    paypalEmail: '',
    companyName: '',
    website: '',
    marketingDescription: '',
    agreeToTerms: false
  });
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = tokenManager.getAccessToken();
    setIsLoggedIn(!!token && !tokenManager.isAccessTokenExpired());
  }, []);

  const handleRegisterClick = () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      // Redirect to register page with message
      navigate('/register?message=Please create an account to join our affiliate program&redirect=/affiliate-signup');
      return;
    }
    setRegisterDialogOpen(true);
  };

  const handleLoginAndNavigate = () => {
    navigate('/login?redirect=/affiliate');
  };

  const handleRegistrationSubmit = async () => {
    if (!registrationData.agreeToTerms) {
      setErrorMessage('You must agree to the terms and conditions');
      return;
    }

    if (!registrationData.paypalEmail || !registrationData.marketingDescription) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setSubmissionStatus('loading');
    setErrorMessage('');

    try {
      const response = await http.post('/affiliates/register', registrationData);
      
      if (response.data.success) {
        setSubmissionStatus('success');
        setTimeout(() => {
          setRegisterDialogOpen(false);
          navigate('/affiliate');
        }, 2000);
      } else {
        setSubmissionStatus('error');
        setErrorMessage(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      setSubmissionStatus('error');
      setErrorMessage(error.response?.data?.message || 'An error occurred during registration');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h3" gutterBottom>
          Join Our Affiliate Program
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Earn up to 20% commission on every sale you refer to PublishJockey
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleRegisterClick}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              backdropFilter: 'blur(10px)'
            }}
          >
            Apply Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleLoginAndNavigate}
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Already a Member? Sign In
          </Button>
        </Box>
      </Paper>

      {/* Benefits Section */}
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        Why Join Our Affiliate Program?
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <AttachMoney sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                High Commissions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Earn up to 20% commission on every sale you refer. Our generous commission structure rewards your success.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <People sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Growing Market
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Book publishing is a thriving industry. Help authors achieve their dreams while earning great commissions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <TrendingUp sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Marketing Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get access to marketing materials, tracking links, and dedicated support to maximize your earnings.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* How It Works Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              borderRadius: '50%', 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              1
            </Box>
            <Typography variant="h6" gutterBottom>Apply</Typography>
            <Typography variant="body2" color="text.secondary">
              Submit your application with your marketing strategy and payout details.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              borderRadius: '50%', 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              2
            </Box>
            <Typography variant="h6" gutterBottom>Get Approved</Typography>
            <Typography variant="body2" color="text.secondary">
              We'll review your application and get back to you within 24-48 hours.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              borderRadius: '50%', 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              3
            </Box>
            <Typography variant="h6" gutterBottom>Start Promoting</Typography>
            <Typography variant="body2" color="text.secondary">
              Get your unique referral links and start promoting PublishJockey.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
            <Box sx={{ 
              width: 60, 
              height: 60, 
              borderRadius: '50%', 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              4
            </Box>
            <Typography variant="h6" gutterBottom>Get Paid</Typography>
            <Typography variant="body2" color="text.secondary">
              Earn commissions on every successful referral and receive monthly payouts.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Call to Action */}
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
        <Typography variant="h5" gutterBottom>
          Ready to Start Earning?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Join hundreds of affiliates who are already earning with PublishJockey.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleRegisterClick}
          sx={{ mr: 2 }}
        >
          Apply for Affiliate Program
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={handleLoginAndNavigate}
        >
          Sign In to Dashboard
        </Button>
      </Paper>

      {/* Registration Dialog */}
      <Dialog open={registerDialogOpen} onClose={() => setRegisterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for Affiliate Program</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please provide your information below. We'll review your application and get back to you within 24-48 hours.
          </Typography>
          
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          
          {submissionStatus === 'success' && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Application submitted successfully! Please check your email for next steps.
            </Alert>
          )}

          <TextField
            fullWidth
            label="PayPal Email *"
            type="email"
            value={registrationData.paypalEmail}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, paypalEmail: e.target.value }))}
            margin="normal"
            disabled={submissionStatus === 'loading'}
          />
          
          <TextField
            fullWidth
            label="Company/Business Name"
            value={registrationData.companyName}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, companyName: e.target.value }))}
            margin="normal"
            disabled={submissionStatus === 'loading'}
          />
          
          <TextField
            fullWidth
            label="Website/Blog URL"
            value={registrationData.website}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, website: e.target.value }))}
            margin="normal"
            disabled={submissionStatus === 'loading'}
          />
          
          <TextField
            fullWidth
            label="How do you plan to promote PublishJockey? *"
            multiline
            rows={4}
            value={registrationData.marketingDescription}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, marketingDescription: e.target.value }))}
            margin="normal"
            disabled={submissionStatus === 'loading'}
            placeholder="Please describe your marketing strategy, audience, and how you plan to promote our services..."
          />

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              <strong>PublishJockey Affiliate Program Terms</strong>
              <br /><br />
              • 20% commission on all successful referrals
              <br />• Monthly payouts via PayPal
              <br />• 30-day cookie tracking
              <br />• Access to marketing materials and support
              <br />• Must comply with our marketing guidelines
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
            <Checkbox
              checked={registrationData.agreeToTerms}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
              disabled={submissionStatus === 'loading'}
              size="small"
            />
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              I have read and agree to the <strong>PublishJockey Affiliate Program Terms</strong> above. 
              I understand that by checking this box, I am entering into a legally binding agreement.
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => setRegisterDialogOpen(false)}
            disabled={submissionStatus === 'loading'}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRegistrationSubmit}
            variant="contained"
            disabled={submissionStatus === 'loading' || !registrationData.agreeToTerms}
          >
            {submissionStatus === 'loading' ? <CircularProgress size={20} /> : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AffiliateSignup;
