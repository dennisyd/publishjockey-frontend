import React, { useState } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Divider, CircularProgress, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { redirectToCheckout } from '../services/stripeService';
import { useAuth } from '../auth/AuthContext';

const pricingPlans = [
  { 
    title: 'Free', 
    price: 'Free', 
    description: 'Try before you buy with the first 10 pages',
    planId: 'free',
    features: [
      '1 book project',
      'Export limited to first 10 pages',
      'AI-assisted formatting',
      'Watermark on output',
      'Word document splitting by H1 sections'
    ],
    buttonText: 'Register Free',
    buttonVariant: 'outlined'
  },
  { 
    title: 'Single Book', 
    price: '$63', 
    description: 'One-time purchase for a single book',
    popular: true,
    planId: 'single',
    perBookText: 'One-time payment',
    features: [
      '1 book project',
      'Full book export',
      'AI-assisted formatting',
      'Watermark-free output',
      'Email support',
      'Word document splitting by H1 sections',
      '$100 value included: Upscaled cover images created by ChatGPT for AI to meet DPI standards for KDP'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'contained'
  },
  { 
    title: 'Additional Books', 
    price: '$37', 
    description: 'Add more books to your account',
    planId: 'additional',
    perBookText: 'Per additional book',
    features: [
      '1 additional book project',
      'Full book export',
      'AI-assisted formatting',
      'Watermark-free output',
      'Email support',
      'Word document splitting by H1 sections',
      '$100 value included: Upscaled cover images created by ChatGPT for AI to meet DPI standards for KDP'
    ],
    buttonText: 'Add Book',
    buttonVariant: 'outlined'
  },
  { 
    title: 'Annual Subscription', 
    price: '$399', 
    description: 'Unlimited books for one year',
    planId: 'annual',
    perBookText: 'Unlimited books for 12 months',
    features: [
      'Unlimited book projects',
      'Full book export',
      'AI-assisted formatting',
      'Watermark-free output',
      'Priority support',
      'Word document splitting by H1 sections',
      '$100 value included: Upscaled cover images created by ChatGPT for AI to meet DPI standards for KDP'
    ],
    buttonText: 'Subscribe Now',
    buttonVariant: 'outlined'
  }
];

const Pricing = () => {
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelect = async (plan) => {
    if (plan.planId === 'free') {
      navigate('/register');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/pricing', planId: plan.planId } });
      return;
    }

    try {
      setLoadingPlanId(plan.planId);
      setError(null);
      
      // Redirect to Stripe checkout
      await redirectToCheckout(plan.planId);
      
      // This code will only run if there's an error with the redirect
      setLoadingPlanId(null);
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError('An error occurred. Please try again later.');
      setLoadingPlanId(null);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', pt: 8, pb: 12 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Pricing Plans
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'text.secondary', 
              maxWidth: '700px',
              mx: 'auto',
              mb: 1, 
              fontWeight: 400 
            }}
          >
            Start with a single book for $63, add more for $37 each, or get unlimited access with annual subscription
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Pricing Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
              <Paper 
                elevation={plan.popular ? 4 : 1}
                sx={{ 
                  p: 4, 
                  borderRadius: 4,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: plan.popular ? '2px solid' : '1px solid',
                  borderColor: plan.popular ? 'primary.main' : 'divider',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  zIndex: plan.popular ? 2 : 1,
                  '&:hover': {
                    transform: plan.popular ? 'scale(1.08)' : 'scale(1.03)',
                    boxShadow: plan.popular ? '0 16px 70px -12px rgba(0,0,0,0.3)' : '0 12px 40px -12px rgba(0,0,0,0.2)'
                  }
                }}
              >
                {plan.popular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -12,
                      right: 20,
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '20px',
                      px: 2,
                      py: 0.5,
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  >
                    Most Popular
                  </Box>
                )}
                
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                  {plan.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: '40px' }}>
                  {plan.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="h3" component="span" sx={{ fontWeight: 800 }}>
                    {plan.price}
                  </Typography>
                </Box>
                
                {plan.perBookText && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    {plan.perBookText}
                  </Typography>
                )}
                
                {plan.price !== 'Free' && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                      NO REFUNDS — Try the free plan first
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ mb: 4, flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                    INCLUDES:
                  </Typography>
                  <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                    {plan.features.map((feature, idx) => (
                      <Box 
                        component="li" 
                        key={idx} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          mb: 1.5
                        }}
                      >
                        <CheckCircleOutlineIcon 
                          sx={{ 
                            color: 'primary.main', 
                            mr: 1.5, 
                            fontSize: '1.2rem',
                            mt: 0.2,
                            flexShrink: 0
                          }} 
                        />
                        <Typography variant="body2">
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                
                <Button 
                  fullWidth
                  variant={plan.buttonVariant}
                  color="primary"
                  onClick={() => handlePlanSelect(plan)}
                  disabled={loadingPlanId === plan.planId}
                  size="large"
                  sx={{
                    py: 1.5,
                    borderRadius: '50px',
                    textTransform: 'none',
                    fontWeight: 600,
                    ...(plan.popular && plan.buttonVariant === 'contained' && {
                      boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(99, 102, 241, 0.23)',
                      }
                    })
                  }}
                >
                  {loadingPlanId === plan.planId ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box 
          sx={{ 
            textAlign: 'center', 
            p: 4, 
            bgcolor: 'white', 
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Every paid plan includes:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Export to PDF, Word, and EPUB formats, AI-assisted formatting, editing tools, watermark-free output, and Word document splitting by H1 sections.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
            $100 value included: Upscaled cover images created by ChatGPT for AI to meet DPI standards for KDP — no need to hire someone to create your cover!
          </Typography>
          <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 'bold', mt: 2 }}>
            NO REFUNDS on paid plans — Try the free plan first to see exactly what you'll get
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Pricing; 