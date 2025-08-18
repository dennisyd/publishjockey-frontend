import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { isLaunchOfferActive, LAUNCH_OFFER_CONFIG } from '../config/launchOffer';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const Pricing = () => {
  console.log('🔍 PRICING COMPONENT LOADED');
  
  const { t } = useTranslation();
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [error, setError] = useState(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customBooks, setCustomBooks] = useState('');
  const [customImages, setCustomImages] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Use launch offer if active
  const launchOfferActive = isLaunchOfferActive();
  console.log('🔍 LAUNCH OFFER ACTIVE:', launchOfferActive);

  // Generate comprehensive plans data
  const plansData = useMemo(() => {
    const plans = [
      // Free plan
      {
        id: 'free',
        category: 'Free',
        name: 'Free',
        format: 'Any',
        books: '1 book (12 pages)',
        price: '$0',
        perBook: '$0',
        promo: '',
        features: [
          '1 book project',
          'Export limited to first 12 pages',
          'AI-assisted formatting',
          'Watermark on output',
          'Word document splitting by H1 sections',
          '2 images included'
        ],
        details: 'Try before you buy with the first 12 pages. Perfect for testing the platform.',
        planId: 'free'
      }
    ];

    if (launchOfferActive) {
      // Add all promo plans
      Object.entries(LAUNCH_OFFER_CONFIG.pricing).forEach(([key, plan]) => {
        const planIdMap = {
          'single': 'single_promo',
          'bundle5': 'bundle5_promo',
          'bundle10': 'bundle10_promo',
          'bundle20': 'bundle20_promo',
          'poweruser': 'poweruser_promo',
          'agency': 'agency_promo',
          'eSingle': 'eSingle_promo',
          'ebundle5': 'ebundle5_promo',
          'ebundle10': 'ebundle10_promo',
          'ebundle20': 'ebundle20_promo',
          'epoweruser': 'epoweruser_promo',
          'eagency': 'eagency_promo',
          'fullService': 'fullService_promo',
          'fullServicePlus': 'fullServicePlus_promo'
        };

        const categoryMap = {
          'single': 'Standard',
          'bundle5': 'Standard',
          'bundle10': 'Standard',
          'bundle20': 'Standard',
          'poweruser': 'Premium',
          'agency': 'Premium',
          'eSingle': 'Ebook',
          'ebundle5': 'Ebook',
          'ebundle10': 'Ebook',
          'ebundle20': 'Ebook',
          'epoweruser': 'Ebook Premium',
          'eagency': 'Ebook Premium',
          'fullService': 'Full Service',
          'fullServicePlus': 'Full Service'
        };

        const formatMap = {
          'single': 'Print',
          'bundle5': 'Print',
          'bundle10': 'Print',
          'bundle20': 'Print',
          'poweruser': 'Print',
          'agency': 'Print',
          'eSingle': 'Ebook',
          'ebundle5': 'Ebook',
          'ebundle10': 'Ebook',
          'ebundle20': 'Ebook',
          'epoweruser': 'Ebook',
          'eagency': 'Ebook',
          'fullService': 'Print + Ebook',
          'fullServicePlus': 'Print + Ebook'
        };

        plans.push({
          id: key,
          category: categoryMap[key] || 'Standard',
          name: plan.title,
          format: formatMap[key] || 'Print',
          books: `${plan.booksIncluded} book${plan.booksIncluded > 1 ? 's' : ''}`,
          price: `$${plan.price}`,
          perBook: plan.booksIncluded > 1 ? `$${(plan.price / plan.booksIncluded).toFixed(0)}` : `$${plan.price}`,
          promo: plan.savings ? `Save $${plan.savings}` : '',
          features: plan.features.map(f => f.title),
          details: plan.subtitle,
          planId: planIdMap[key] || key,
          originalPrice: plan.originalPrice ? `$${plan.originalPrice}` : null
        });
      });
    } else {
      // Add regular plans
      const regularPlans = [
        { id: 'single', category: 'Standard', name: 'Single', format: 'Print', books: '1 book', price: '$93', perBook: '$93', features: ['1 book project', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '10 images included'], details: 'One-time purchase (3-year validity)', planId: 'single' },
        { id: 'bundle5', category: 'Standard', name: '5 Book Pack', format: 'Print', books: '5 books', price: '$349', perBook: '$70', features: ['5 book projects', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '50 images included'], details: 'Great value for multiple books (3-year validity)', planId: 'bundle5' },
        { id: 'bundle10', category: 'Standard', name: '10 Book Pack', format: 'Print', books: '10 books', price: '$599', perBook: '$60', features: ['10 book projects', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '100 images included'], details: 'Publish up to 10 books (3-year validity)', planId: 'bundle10' },
        { id: 'bundle20', category: 'Standard', name: '20 Book Pack', format: 'Print', books: '20 books', price: '$999', perBook: '$50', features: ['20 book projects', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '200 images included'], details: 'Publish up to 20 books (3-year validity)', planId: 'bundle20' },
        { id: 'poweruser', category: 'Premium', name: 'Power User', format: 'Print', books: '50 books', price: '$2,250', perBook: '$45', features: ['50 book projects', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '500 images included', 'Priority support'], details: 'For prolific authors (1-year validity)', planId: 'poweruser' },
        { id: 'agency', category: 'Premium', name: 'Agency', format: 'Print', books: '100 books', price: '$3,500', perBook: '$35', features: ['100 book projects', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '1000 images included', 'Priority support', 'Dedicated account manager'], details: 'For publishing agencies (1-year validity)', planId: 'agency' },
        { id: 'eSingle', category: 'Ebook', name: 'Ebook Single', format: 'Ebook', books: '1 book', price: '$46', perBook: '$46', features: ['1 book project', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '11 images included', '50-page limit'], details: 'Ebook-focused plan with 50-page limit (3-year validity)', planId: 'eSingle' },
        { id: 'ebundle5', category: 'Ebook', name: 'Ebook 5 Pack', format: 'Ebook', books: '5 books', price: '$174', perBook: '$35', features: ['5 book projects', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '55 images included', '50-page limit'], details: 'Ebook-focused plan for multiple books (3-year validity)', planId: 'ebundle5' },
        { id: 'ebundle10', category: 'Ebook', name: 'Ebook 10 Pack', format: 'Ebook', books: '10 books', price: '$299', perBook: '$30', features: ['10 book projects', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '110 images included', '50-page limit'], details: 'Ebook-focused plan for serious authors (3-year validity)', planId: 'ebundle10' },
        { id: 'ebundle20', category: 'Ebook', name: 'Ebook 20 Pack', format: 'Ebook', books: '20 books', price: '$499', perBook: '$25', features: ['20 book projects', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '220 images included', '50-page limit'], details: 'Ebook-focused plan for prolific authors (3-year validity)', planId: 'ebundle20' },
        { id: 'epoweruser', category: 'Ebook Premium', name: 'Ebook Power User', format: 'Ebook', books: '50 books', price: '$1,125', perBook: '$23', features: ['50 book projects', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '550 images included', '50-page limit', 'Priority support'], details: 'Ebook-focused plan for prolific authors (1-year validity)', planId: 'epoweruser' },
        { id: 'eagency', category: 'Ebook Premium', name: 'Ebook Agency', format: 'Ebook', books: '100 books', price: '$1,750', perBook: '$18', features: ['100 book projects', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '1100 images included', '50-page limit', 'Priority support', 'Dedicated account manager'], details: 'Ebook-focused plan for publishing agencies (1-year validity)', planId: 'eagency' },
        { id: 'fullService', category: 'Full Service', name: 'Full Service', format: 'Print + Ebook', books: '1 book', price: '$499', perBook: '$499', features: ['1 book project', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '11 images included', '3 custom cover designs'], details: 'Complete publishing package with custom cover designs (3-year validity)', planId: 'fullService' },
        { id: 'fullServicePlus', category: 'Full Service', name: 'Full Service Plus', format: 'Print + Ebook', books: '1 book', price: '$599', perBook: '$599', features: ['1 book project', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '11 images included', '3 custom cover designs', '30-minute guided KDP Amazon setup session'], details: 'Complete package with custom covers and KDP setup guidance (3-year validity)', planId: 'fullServicePlus' }
      ];

      plans.push(...regularPlans);
    }

    // Add add-ons
    plans.push(
      { id: 'additional', category: 'Add-ons', name: 'Additional Books', format: 'Any', books: '1 book', price: '$37', perBook: '$37', features: ['1 additional book project', 'Full book export', 'AI-assisted formatting', 'Watermark-free output', 'Word document splitting by H1 sections', '+10 additional images'], details: 'Add more books to your account (3-year validity)', planId: 'additional' },
      { id: 'images_addon_100', category: 'Add-ons', name: 'Image Upgrade', format: 'Any', books: 'N/A', price: '$25', perBook: '$25', features: ['+100 additional images', 'Works with any plan', 'No expiration', 'Immediate activation'], details: 'Add 100 images to your allowance', planId: 'images_addon_100' }
    );

    return plans;
  }, [launchOfferActive]);

  const toggleRow = (planId) => {
    setExpandedRows(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

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
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }

    setLoadingPlanId(plan.planId);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId: plan.planId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`
        })
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError('Failed to create checkout session. Please try again.');
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    // Handle custom plan submission
    console.log('Custom plan request:', { customBooks, customImages, customNotes });
    setCustomOpen(false);
  };

  // Group plans by category for better organization
  const groupedPlans = useMemo(() => {
    const grouped = {};
    plansData.forEach(plan => {
      if (!grouped[plan.category]) {
        grouped[plan.category] = [];
      }
      grouped[plan.category].push(plan);
    });
    return grouped;
  }, [plansData]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
             <Box sx={{ textAlign: 'center', mb: 6 }}>
         <Typography variant="h3" component="h1" gutterBottom>
           {t('landing.pricing.title')}
         </Typography>
         <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
           {t('landing.pricing.subtitle')}
         </Typography>
         {launchOfferActive && (
           <Chip 
             label={t('landing.pricing.launchOffer')} 
             color="warning" 
             variant="filled"
             sx={{ fontSize: '1rem', py: 1 }}
           />
         )}
       </Box>

             {/* Desktop Table */}
       <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 4 }}>
         <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
           <Table>
             <TableHead>
               <TableRow sx={{ 
                 background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                 '& th': { color: 'white', fontWeight: 'bold' }
               }}>
                 <TableCell sx={{ width: '25%', fontWeight: 'bold', color: 'white' }}>Plan</TableCell>
                 <TableCell sx={{ width: '12%', fontWeight: 'bold', color: 'white' }}>Format</TableCell>
                 <TableCell sx={{ width: '12%', fontWeight: 'bold', color: 'white' }}>Books</TableCell>
                 <TableCell sx={{ width: '14%', fontWeight: 'bold', color: 'white' }}>Price</TableCell>
                 <TableCell sx={{ width: '14%', fontWeight: 'bold', color: 'white' }}>Cost/Book</TableCell>
                 <TableCell sx={{ width: '14%', fontWeight: 'bold', color: 'white' }}>Promo</TableCell>
                 <TableCell sx={{ width: '9%', fontWeight: 'bold', color: 'white' }}>Action</TableCell>
               </TableRow>
             </TableHead>
            <TableBody>
              {Object.entries(groupedPlans).map(([category, plans]) => (
                <React.Fragment key={category}>
                  {plans.map((plan) => (
                    <React.Fragment key={plan.id}>
                                             <TableRow hover sx={{ 
                         '&:hover': { 
                           backgroundColor: 'rgba(25, 118, 210, 0.04)',
                           transition: 'background-color 0.2s ease'
                         }
                       }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton
                              size="small"
                              onClick={() => toggleRow(plan.id)}
                            >
                              {expandedRows[plan.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {plan.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {plan.category}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{plan.format}</TableCell>
                        <TableCell>{plan.books}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {plan.price}
                          </Typography>
                          {plan.originalPrice && (
                            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                              {plan.originalPrice}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{plan.perBook}</TableCell>
                        <TableCell>
                          {plan.promo && (
                            <Chip 
                              label={plan.promo} 
                              size="small" 
                              color="warning" 
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handlePlanSelect(plan)}
                            disabled={loadingPlanId === plan.planId}
                            sx={{ minWidth: 80 }}
                          >
                            {loadingPlanId === plan.planId ? (
                              <CircularProgress size={16} />
                            ) : (
                              'Select'
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={7} sx={{ py: 0, border: 0 }}>
                                                     <Collapse in={expandedRows[plan.id]} timeout="auto" unmountOnExit>
                             <Box sx={{ p: 3, backgroundColor: 'rgba(25, 118, 210, 0.02)' }}>
                              <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3 }}>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Included Features
                                  </Typography>
                                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                    {plan.features.map((feature, index) => (
                                      <Typography key={index} component="li" variant="body2" sx={{ mb: 0.5 }}>
                                        {feature}
                                      </Typography>
                                    ))}
                                  </Box>
                                </Box>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Notes
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {plan.details}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Mobile Cards */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {Object.entries(groupedPlans).map(([category, plans]) => (
          <Box key={category} sx={{ mb: 4 }}>
                                     <Typography variant="h6" sx={{ 
                           mb: 2, 
                           color: 'primary.main',
                           fontWeight: 'bold',
                           borderBottom: '2px solid #1976d2',
                           pb: 1
                         }}>
              {category}
            </Typography>
            {plans.map((plan) => (
                             <Card key={plan.id} sx={{ 
                 mb: 2, 
                 border: '1px solid rgba(25, 118, 210, 0.1)',
                 '&:hover': {
                   boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                   transform: 'translateY(-2px)',
                   transition: 'all 0.2s ease'
                 }
               }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.format} • {plan.books}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight="bold">
                        {plan.price}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {plan.perBook} / book
                      </Typography>
                    </Box>
                  </Box>
                  
                  {plan.promo && (
                    <Chip 
                      label={plan.promo} 
                      size="small" 
                      color="warning" 
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  )}

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handlePlanSelect(plan)}
                      disabled={loadingPlanId === plan.planId}
                      sx={{ flex: 1 }}
                    >
                      {loadingPlanId === plan.planId ? (
                        <CircularProgress size={16} />
                      ) : (
                        'Select'
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => toggleRow(plan.id)}
                    >
                      {expandedRows[plan.id] ? 'Hide' : 'Details'}
                    </Button>
                  </Box>

                  <Collapse in={expandedRows[plan.id]} timeout="auto" unmountOnExit>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Included Features
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0, mb: 2 }}>
                      {plan.features.map((feature, index) => (
                        <Typography key={index} component="li" variant="body2" sx={{ mb: 0.5 }}>
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Notes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.details}
                    </Typography>
                  </Collapse>
                </CardContent>
              </Card>
            ))}
          </Box>
        ))}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Custom Plan Dialog */}
      <Dialog open={customOpen} onClose={() => setCustomOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Custom Plan</DialogTitle>
        <form onSubmit={handleCustomSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Number of Books Needed"
              value={customBooks}
              onChange={(e) => setCustomBooks(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Image Requirements"
              value={customImages}
              onChange={(e) => setCustomImages(e.target.value)}
              margin="normal"
              placeholder="e.g., 500 images, specific formats"
            />
            <TextField
              fullWidth
              label="Additional Notes"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              margin="normal"
              multiline
              rows={3}
              placeholder="Any specific requirements or questions"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCustomOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Submit Request</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Pricing; 