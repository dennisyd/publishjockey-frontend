import React, { useState } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Divider, CircularProgress, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { redirectToCheckout } from '../services/stripeService';
import { useAuth } from '../contexts/AuthContext';
import { isLaunchOfferActive, LAUNCH_OFFER_CONFIG } from '../config/launchOffer';
import LaunchOfferCountdown from '../components/LaunchOfferCountdown';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';



const Pricing = () => {
  console.log('🔍 PRICING COMPONENT LOADED');
  
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [error, setError] = useState(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customBooks, setCustomBooks] = useState('');
  const [customImages, setCustomImages] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Use launch offer if active
  const launchOfferActive = isLaunchOfferActive();
  console.log('🔍 LAUNCH OFFER ACTIVE:', launchOfferActive);
  
  // Define pricing data based on launch offer status
  let pricingPlans = [
    { 
      title: 'Free', 
      price: 'Free', 
      description: 'Try before you buy with the first 12 pages',
      planId: 'free',
      features: [
        '1 book project',
        'Export limited to first 12 pages',
        'AI-assisted formatting',
        'Watermark on output',
        'Word document splitting by H1 sections',
        '2 images included'
      ],
      buttonText: 'Register Free',
      buttonVariant: 'outlined'
    }
  ];

  if (launchOfferActive) {
    // Debug: Log the launch offer configuration
    console.log('🔍 LAUNCH OFFER CONFIG:', {
      keys: Object.keys(LAUNCH_OFFER_CONFIG.pricing),
      totalPlans: Object.keys(LAUNCH_OFFER_CONFIG.pricing).length
    });
    
    // Use the launch offer configuration
    Object.entries(LAUNCH_OFFER_CONFIG.pricing).forEach(([key, plan]) => {
      console.log(`🔍 Processing plan: ${key} - ${plan.title}`);
      
      // Map the key to the correct plan ID
      const planIdMap = {
        'single': 'single_promo',
        'bundle5': 'bundle5_promo',
        'bundle10': 'bundle10_promo',
        'bundle20': 'bundle20_promo',
        'poweruser': 'poweruser_promo',
        'agency': 'agency_promo'
      };
      
      const planData = {
        title: plan.title,
        price: `$${plan.price}`,
        originalPrice: `$${plan.originalPrice}`,
        description: plan.subtitle,
        planId: planIdMap[key] || 'single_promo',
        perBookText: `${plan.booksIncluded} book${plan.booksIncluded > 1 ? 's' : ''} for ${plan.title.includes('Power User') || plan.title.includes('Agency') ? '1 year' : '3 years'}`,
        launchOffer: true,
        features: plan.features.map(f => f.title),
        buttonText: plan.buttonText,
        buttonVariant: 'contained',
        savings: plan.savings
      };
      
      console.log(`🔍 Adding plan: ${planData.title} with planId: ${planData.planId}`);
      pricingPlans.push(planData);
    });
  } else {
    // Regular pricing plans
    pricingPlans.push(
      {
        title: 'Single',
        price: '$93',
        description: 'One-time purchase (3-year validity)',
        planId: 'single',
        perBookText: '1 book for 3 years',
        features: [
          '1 book project',
          'Full book export',
          'AI-assisted formatting',
          'Watermark-free output',
          'Word document splitting by H1 sections',
          '12 images included'
        ],
        buttonText: 'Get Single — $93',
        buttonVariant: 'contained'
      },
      {
        title: '5 Book Pack',
        price: '$199',
        description: 'Great value for multiple books (3-year validity)',
        planId: 'bundle5',
        perBookText: '5 books for 3 years',
        features: [
          '5 book projects',
          'Full book export',
          'AI-assisted formatting',
          'Watermark-free output',
          'Word document splitting by H1 sections',
          '50 images included'
        ],
        buttonText: 'Get 5 Books — $199',
        buttonVariant: 'outlined'
      },
      { 
        title: '10 Book Pack', 
        price: '$349', 
        description: 'Publish up to 10 books (3-year validity)',
        planId: 'bundle10',
        perBookText: '10 books for 3 years',
        features: [
          '10 book projects',
          'Full book export',
          'AI-assisted formatting',
          'Watermark-free output',
          'Word document splitting by H1 sections',
          '100 images included'
        ],
        buttonText: 'Get 10 Books — $349',
        buttonVariant: 'outlined'
      },
      { 
        title: '20 Book Pack', 
        price: '$599', 
        description: 'Publish up to 20 books (3-year validity)',
        planId: 'bundle20',
        perBookText: '20 books for 3 years',
        features: [
          '20 book projects',
          'Full book export',
          'AI-assisted formatting',
          'Watermark-free output',
          'Word document splitting by H1 sections',
          '200 images included'
        ],
        buttonText: 'Get 20 Books — $599',
        buttonVariant: 'outlined'
      },
      {
        title: 'Power User',
        price: '$1,188',
        description: 'For prolific authors (1-year validity)',
        planId: 'poweruser',
        perBookText: '48 books for 1 year',
        features: [
          '48 book projects',
          'Full book export',
          'AI-assisted formatting',
          'Watermark-free output',
          'Word document splitting by H1 sections',
          '480 images included',
          'Priority support'
        ],
        buttonText: 'Get Power User — $1,188',
        buttonVariant: 'outlined'
      },
      {
        title: 'Agency',
        price: '$2,988',
        description: 'For publishing agencies (1-year validity)',
        planId: 'agency',
        perBookText: '180 books for 1 year',
        features: [
          '180 book projects',
          'Full book export',
          'AI-assisted formatting',
          'Watermark-free output',
          'Word document splitting by H1 sections',
          '1800 images included',
          'Priority support',
          'Dedicated account manager'
        ],
        buttonText: 'Get Agency — $2,988',
        buttonVariant: 'outlined'
      }
    );
  }

  // Debug: Log the plans being generated
  console.log('🔍 PRICING PLANS DEBUG:', {
    launchOfferActive,
    totalPlans: pricingPlans.length,
    plans: pricingPlans.map(p => ({ title: p.title, planId: p.planId }))
  });

  // Add-ons and custom
  pricingPlans.push(
    { 
      title: 'Additional Books', 
      price: '$37', 
      description: 'Add more books to your account',
      planId: 'additional',
      perBookText: 'Per additional book (3-year validity)',
      features: [
        '1 additional book project',
        'Full book export',
        'AI-assisted formatting',
        'Watermark-free output',
        'Word document splitting by H1 sections',
        '+10 additional images'
      ],
      buttonText: 'Add Book — $37',
      buttonVariant: 'outlined'
    },
    {
      title: 'Image Upgrade',
      price: '$25',
      description: 'Add 100 images to your allowance',
      planId: 'images_addon_100',
      perBookText: 'Per 100 images',
      features: [
        '+100 additional images',
        'Works with any plan',
        'No expiration',
        'Immediate activation'
      ],
      buttonText: 'Add 100 Images — $25',
      buttonVariant: 'outlined'
    },
    {
      title: 'Custom Plan',
      price: 'Contact Us',
      description: 'Need a larger plan or specific image limits? We can help.',
      isCustom: true,
      perBookText: '3-year validity',
      features: [
        'Custom books allowance',
        'Custom image allowance',
        'Full export (PDF, EPUB, DOCX)',
        'Priority support'
      ],
      buttonText: 'Request Custom Plan',
      buttonVariant: 'outlined'
    }
  );

  const handlePlanSelect = async (plan) => {
    if (plan.planId === 'free') {
      navigate('/register');
      return;
    }

    // Handle Contact Us option
    if (plan.isContactUs || plan.isCustom) {
      setCustomOpen(true);
      return;
    }

    // Check if user is authenticated
    if (!currentUser) {
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

  const handleCustomSubmit = () => {
    const subject = encodeURIComponent('Custom Plan Request - PublishJockey');
    const body = encodeURIComponent(
      `Hi,\n\nI would like a custom plan.\n\nBooks needed: ${customBooks || 'TBD'}\nImages needed: ${customImages || 'TBD'}\nNotes: ${customNotes || 'N/A'}\n\nUser: ${currentUser?.name || 'Guest'} (${currentUser?.email || 'N/A'})\n\nThanks!`
    );
    window.open(`mailto:denni@publishjockey.com?subject=${subject}&body=${body}`);
    setCustomOpen(false);
  };

  return (
         <Container maxWidth="xl" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Simple, Transparent Pricing
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Choose the plan that fits your publishing needs
        </Typography>
        
        {launchOfferActive && (
          <Box mt={3}>
            <LaunchOfferCountdown />
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

             <Grid container spacing={4} justifyContent="center">
         {pricingPlans.map((plan, index) => (
           <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              elevation={plan.launchOffer ? 8 : 2}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: plan.launchOffer ? '2px solid #ff6b35' : '1px solid #e0e0e0',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              {plan.launchOffer && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#ff6b35',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  PROMO OFFER
                </Box>
              )}

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  {plan.title}
                </Typography>
                
                {plan.launchOffer && plan.originalPrice ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        textDecoration: 'line-through', 
                        color: 'text.disabled',
                        mr: 2
                      }}
                    >
                      {plan.originalPrice}
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ color: '#ff6b35' }}>
                      {plan.price}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                    {plan.price}
                  </Typography>
                )}
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {plan.description}
                </Typography>

                {plan.perBookText && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {plan.perBookText}
                  </Typography>
                )}

                {plan.launchOffer && plan.savings && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#ff6b35', 
                      fontWeight: 600,
                      bgcolor: '#fff3e0',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'inline-block',
                      mb: 2
                    }}
                  >
                    Save ${plan.savings}!
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  {plan.features.map((feature, featureIndex) => (
                    <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircleOutlineIcon sx={{ color: 'success.main', mr: 1, fontSize: '1.2rem' }} />
                      <Typography variant="body2">
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Button
                variant={plan.buttonVariant}
                size="large"
                fullWidth
                onClick={() => handlePlanSelect(plan)}
                disabled={loadingPlanId === plan.planId}
                sx={{
                  mt: 'auto',
                  bgcolor: plan.launchOffer ? '#ff6b35' : undefined,
                  '&:hover': {
                    bgcolor: plan.launchOffer ? '#e55a2b' : undefined
                  }
                }}
              >
                {loadingPlanId === plan.planId ? (
                  <CircularProgress size={24} />
                ) : (
                  plan.buttonText
                )}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Custom Plan Dialog */}
      <Dialog open={customOpen} onClose={() => setCustomOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Custom Plan</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Tell us about your specific needs and we'll create a custom plan for you.
          </Typography>
          <TextField
            fullWidth
            label="Number of Books Needed"
            value={customBooks}
            onChange={(e) => setCustomBooks(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Number of Images Needed"
            value={customImages}
            onChange={(e) => setCustomImages(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Additional Notes"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomOpen(false)}>Cancel</Button>
          <Button onClick={handleCustomSubmit} variant="contained">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Pricing; 