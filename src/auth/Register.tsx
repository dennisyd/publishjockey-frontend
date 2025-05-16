import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
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
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Modal
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const termsContentRef = React.useRef<HTMLDivElement>(null);

  // Add debug useEffect to log state changes
  useEffect(() => {
    console.log("Terms open state:", termsOpen);
  }, [termsOpen]);

  // Force open terms on first render for testing
  useEffect(() => {
    // Uncomment this line to test if the modal works on component mount
    // setTermsOpen(true);
  }, []);

  const handleTermsAgreement = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAgreed(event.target.checked);
  };

  const handleOpenTerms = () => {
    console.log("Opening terms modal");
    setTermsOpen(true);
    setHasScrolledToBottom(false); // Reset scroll state when opening modal
  };

  const handleCloseTerms = () => {
    console.log("Closing terms modal");
    setTermsOpen(false);
  };

  const handleAgreeTerms = () => {
    console.log("Agreeing to terms");
    setTermsAgreed(true);
    setTermsOpen(false);
  };

  const handleTermsScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!hasScrolledToBottom && termsContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      // Check if user has scrolled to the bottom (with a small tolerance)
      if (scrollHeight - scrollTop <= clientHeight + 10) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }

    if (!termsAgreed) {
      setFormError('You must agree to the terms and conditions');
      handleOpenTerms(); // Open the terms modal if they haven't agreed
      return;
    }
    
    // Clear any previous errors
    setFormError('');
    clearError();
    
    try {
      console.log('Attempting registration with:', { name, email });
      
      await register(name, email, password);
      
      // Registration was successful, show success message
      setRegistrationSuccess(true);
      
      // Don't redirect yet, let user see the success message
      console.log('Registration successful - staying on page to show success message');
    } catch (err) {
      // Error will be handled by the auth context
      console.error('Registration failed:', err);
      setRegistrationSuccess(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Content for the terms and conditions
  const termsContent = (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '80%', md: '70%' },
        maxWidth: '800px',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'hidden',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Typography variant="h5" fontWeight="bold">
          Terms and Agreement
        </Typography>
      </Box>
      
      <Box 
        ref={termsContentRef}
        onScroll={handleTermsScroll}
        sx={{ 
          p: 3,
          overflowY: 'auto',
          flexGrow: 1,
          '& p': {
            mb: 2,
            lineHeight: 1.6
          },
          '& h4': {
            mt: 3,
            mb: 1,
            fontWeight: 700,
            color: 'text.primary'
          }
        }}
      >
        <Typography variant="body1" paragraph>
          By creating an account with PublishJockey, you agree to the following terms:
        </Typography>
        
        <Typography variant="h4">Usage Rights</Typography>
        <Typography variant="body1" paragraph>
          PublishJockey grants you a limited, non-transferable license to use the platform for the purpose of creating, editing, and exporting manuscripts for personal or commercial use, subject to the terms outlined herein.
        </Typography>
        
        <Typography variant="h4">Intellectual Property</Typography>
        <Typography variant="body1" paragraph>
          You retain all rights to the content you create or upload. However, by using the platform, you grant PublishJockey the right to process, display, and temporarily store your content for the sole purpose of providing the publishing service.
        </Typography>
        
        <Typography variant="h4">Fair Use Policy</Typography>
        <Typography variant="body1" paragraph>
          The platform is designed to support a fair number of manuscript creations and exports per user, particularly for individual authors or small publishers. Users on free or basic plans are expected to operate within reasonable publishing limits.
        </Typography>
        <Typography variant="body1" paragraph>
          Abuse of the system—such as attempting to bypass plan restrictions by repeatedly editing and republishing the same project to create multiple unique books—may result in limitations, account suspension, or removal from the platform.
        </Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to implement automatic and manual safeguards to protect the integrity of our service.
        </Typography>
        
        <Typography variant="h4">Account Responsibility</Typography>
        <Typography variant="body1" paragraph>
          You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. If you suspect unauthorized access, you must notify us immediately.
        </Typography>
        
        <Typography variant="h4">Service Changes and Availability</Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to modify, pause, or discontinue any part of the platform with or without notice. We will do our best to notify users in advance of any major changes that affect core functionality.
        </Typography>
        
        <Typography variant="h4">Data Storage and Privacy</Typography>
        <Typography variant="body1" paragraph>
          We do not store your complete manuscript files. Only your original Markdown input and any uploaded images are retained while your account is active. You may request account deletion and data removal at any time.
        </Typography>
        
        <Typography variant="h4">Agreement to Terms</Typography>
        <Typography variant="body1" paragraph>
          By clicking "I Agree" or creating an account, you acknowledge that you have read, understood, and agree to be bound by these terms.
        </Typography>
      </Box>
      
      <Box sx={{ 
        p: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2
      }}>
        {!hasScrolledToBottom ? (
          <Typography variant="caption" color="error" sx={{ flex: 1 }}>
            Please scroll to the bottom to read the entire agreement
          </Typography>
        ) : (
          <FormControlLabel
            control={
              <Checkbox 
                checked={termsAgreed}
                onChange={handleTermsAgreement}
                color="primary"
              />
            }
            label="I have read and agree to the terms and conditions"
            sx={{ flex: 1 }}
          />
        )}
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            onClick={handleCloseTerms} 
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAgreeTerms}
            variant="contained" 
            color="primary"
            disabled={!hasScrolledToBottom || !termsAgreed}
          >
            I Agree
          </Button>
        </Box>
      </Box>
    </Box>
  );

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
        {registrationSuccess ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Registration Successful!
            </Typography>
            <Typography variant="body1" paragraph>
              Thank you for registering. Please check your email for a verification link.
            </Typography>
            <Typography variant="body2" paragraph>
              You will need to verify your email before you can log in.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Box>
        ) : (
          <>
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
                <PersonAddOutlinedIcon />
              </Box>
              <Typography component="h1" variant="h5">
                Create Your Account
              </Typography>
            </Box>
            
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
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
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
                autoComplete="new-password"
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={termsAgreed}
                    onChange={handleTermsAgreement}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the <Button 
                      onClick={handleOpenTerms}
                      color="primary"
                      sx={{ 
                        p: 0, 
                        minWidth: 'auto', 
                        textTransform: 'none',
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        verticalAlign: 'baseline'
                      }}
                    >
                      Terms and Agreement
                    </Button>
                  </Typography>
                }
                sx={{ mt: 2, alignItems: 'flex-start' }}
              />
              
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleOpenTerms}
                sx={{ mt: 1, mb: 2 }}
              >
                View Terms and Agreement
              </Button>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="body2" color="primary">
                    Already have an account? Sign In
                  </Typography>
                </Link>
              </Box>
            </Box>
          </>
        )}
      </Paper>

      {/* Terms and Conditions Modal - using Modal instead of Dialog */}
      <Modal
        open={termsOpen}
        onClose={handleCloseTerms}
        aria-labelledby="terms-modal-title"
      >
        {termsContent}
      </Modal>
    </Container>
  );
};

export default Register; 