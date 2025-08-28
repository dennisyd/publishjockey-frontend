import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
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
  Tabs,
  Tab,
  Divider,
  IconButton,
  Tooltip,
  Link,
  Checkbox
} from '@mui/material';
import {
  ContentCopy,
  Share,
  TrendingUp,
  AttachMoney,
  People,
  ShoppingCart,
  CheckCircle,
  Pending,
  Warning,
  Info
} from '@mui/icons-material';
import { http } from '../services/http';
import { ENV } from '../config/env';
import TrackingService from '../services/TrackingService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`affiliate-tabpanel-${index}`}
      aria-labelledby={`affiliate-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AffiliateDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Registration dialog
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    paypalEmail: '',
    stripeConnect: {
      enabled: false,
      businessName: '',
      businessType: '',
      taxId: ''
    },
    bankInfo: {
      accountName: '',
      accountNumber: '',
      routingNumber: '',
      bankName: '',
      country: 'US'
    },
    zelleInfo: {
      emailOrPhone: ''
    },
    preferredPaymentMethod: 'paypal'
  });
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  
  // Payout info dialog
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    paypalEmail: '',
    stripeConnect: {
      enabled: false,
      businessName: '',
      businessType: '',
      taxId: ''
    },
    bankInfo: {
      accountName: '',
      accountNumber: '',
      routingNumber: '',
      bankName: '',
      country: 'US'
    },
    zelleInfo: {
      emailOrPhone: ''
    },
    preferredPaymentMethod: 'paypal'
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    loadAffiliateData();
  }, [currentUser, navigate]);

  const loadAffiliateData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await http.get('/affiliates/profile');
      
      if (response.data.success) {
        setAffiliateData(response.data.affiliate);
        setReferrals(response.data.recentReferrals || []);
        setCommissions(response.data.pendingCommissions || []);
        
        // Set payout form with existing data
        if (response.data.affiliate.payoutInfo) {
          setPayoutForm(response.data.affiliate.payoutInfo);
        }
      } else {
        setError(response.data.message || 'Failed to load affiliate data');
      }
    } catch (error: any) {
      console.error('Error loading affiliate data:', error);
      if (error.response?.status === 404) {
        // Not an affiliate yet
        setAffiliateData(null);
      } else {
        setError('Failed to load affiliate data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAffiliate = async () => {
    if (!agreementAccepted) {
      setError('You must accept the affiliate agreement to continue');
      return;
    }

    try {
      setRegisterLoading(true);
      
      const response = await http.post('/affiliates/register', registerForm);
      
      if (response.data.success) {
        // Track successful affiliate registration
        TrackingService.trackReferralRegistration(
          currentUser.id,
          currentUser.email
        );
        
        setRegisterDialogOpen(false);
        setAgreementAccepted(false); // Reset for next time
        await loadAffiliateData();
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Error registering affiliate:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleUpdatePayoutInfo = async () => {
    try {
      setPayoutLoading(true);
      
      const response = await http.put('/affiliates/payout-info', payoutForm);
      
      if (response.data.success) {
        setPayoutDialogOpen(false);
        await loadAffiliateData();
      } else {
        setError(response.data.message || 'Update failed');
      }
    } catch (error: any) {
      console.error('Error updating payout info:', error);
      setError('Update failed. Please try again.');
    } finally {
      setPayoutLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Track affiliate link copy
    if (affiliateData?.affiliateCode) {
      TrackingService.trackAffiliateLinkGeneration(affiliateData.affiliateCode);
    }
  };

  const getTrackingLink = () => {
    if (!affiliateData?.affiliateCode) return '';
    return `${window.location.origin}/register?ref=${affiliateData.affiliateCode}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getCommissionStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'approved': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Not an affiliate yet
  if (!affiliateData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Join Our Affiliate Program
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Earn up to 20% commission on every sale you refer to PublishJockey. 
            Perfect for authors, publishers, and content creators.
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    20% Commission
                  </Typography>
                  <Typography variant="body2">
                    Earn 20% on all sales during our promotional period
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    60-Day Payout
                  </Typography>
                  <Typography variant="body2">
                    Reliable 60-day payout schedule with no refunds
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Marketing Tools
                  </Typography>
                  <Typography variant="body2">
                    Access to banners, email templates, and tracking links
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => setRegisterDialogOpen(true)}
            sx={{ mb: 2 }}
          >
            Apply Now
          </Button>
          
          <Typography variant="body2" color="text.secondary">
            Applications are typically approved within 24-48 hours
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Affiliate Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            label={affiliateData.status}
            color={getStatusColor(affiliateData.status) as any}
            icon={affiliateData.status === 'active' ? <CheckCircle /> : <Pending />}
          />
          {affiliateData.status === 'pending' && (
            <Typography variant="body2" color="text.secondary">
              Your application is under review
            </Typography>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <People color="primary" />
                <Box>
                  <Typography variant="h4">{affiliateData.totalReferrals}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Referrals</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ShoppingCart color="primary" />
                <Box>
                  <Typography variant="h4">{formatCurrency(affiliateData.totalSales)}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Sales</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
                 <Grid item xs={12} sm={6} md={3}>
           <Card>
             <CardContent>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 <AttachMoney color="primary" />
                 <Box>
                   <Typography variant="h4">{formatCurrency(affiliateData.totalCommissions)}</Typography>
                   <Typography variant="body2" color="text.secondary">Total Commissions</Typography>
                 </Box>
               </Box>
             </CardContent>
           </Card>
         </Grid>
         <Grid item xs={12} sm={6} md={3}>
           <Card>
             <CardContent>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 <TrendingUp color="primary" />
                 <Box>
                   <Typography variant="h4">{formatCurrency(affiliateData.expectedPayout || 0)}</Typography>
                   <Typography variant="body2" color="text.secondary">Expected Payout</Typography>
                   <Typography variant="caption" color="text.secondary">
                     After fees
                   </Typography>
                 </Box>
               </Box>
             </CardContent>
           </Card>
         </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp color="primary" />
                <Box>
                  <Typography variant="h4">{(affiliateData.commissionRate * 100).toFixed(0)}%</Typography>
                  <Typography variant="body2" color="text.secondary">Commission Rate</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tracking Link */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Your Tracking Link
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            value={getTrackingLink()}
            variant="outlined"
            size="small"
            InputProps={{ readOnly: true }}
            sx={{ flexGrow: 1 }}
          />
          <Tooltip title="Copy link">
            <IconButton onClick={() => copyToClipboard(getTrackingLink())}>
              <ContentCopy />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton onClick={() => navigator.share?.({ url: getTrackingLink() })}>
              <Share />
            </IconButton>
          </Tooltip>
        </Box>
                 <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
           Share this link to start earning commissions
         </Typography>
         
         <Alert severity="info" sx={{ mt: 2 }}>
           <Typography variant="body2">
             <strong>Payout Schedule:</strong> Commissions are paid on the 15th of each month for all transactions 60+ days old. 
             Payment processing fees are deducted from commission amounts.
           </Typography>
         </Alert>
      </Paper>

      {/* Tabs */}
      <Paper elevation={2}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Overview" />
          <Tab label="Referrals" />
          <Tab label="Commissions" />
          <Tab label="Sales Tracking" />
          <Tab label="Payout Info" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Recent Referrals
              </Typography>
              {referrals.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Source</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {referrals.slice(0, 5).map((referral: any) => (
                        <TableRow key={referral._id}>
                          <TableCell>{formatDate(referral.clickedAt)}</TableCell>
                          <TableCell>
                            <Chip
                              label={referral.status}
                              size="small"
                              color={referral.status === 'converted' ? 'success' : 'default'}
                            />
                          </TableCell>
                          <TableCell>{referral.source}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No referrals yet. Share your tracking link to get started!
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Pending Commissions
              </Typography>
              {commissions.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {commissions.slice(0, 5).map((commission: any) => (
                        <TableRow key={commission._id}>
                          <TableCell>{formatDate(commission.createdAt)}</TableCell>
                          <TableCell>{formatCurrency(commission.amount)}</TableCell>
                          <TableCell>
                            <Chip
                              label={commission.status}
                              size="small"
                              color={getCommissionStatusColor(commission.status) as any}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No pending commissions yet.
                </Typography>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            All Referrals
          </Typography>
          {referrals.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Commission</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {referrals.map((referral: any) => (
                    <TableRow key={referral._id}>
                      <TableCell>{formatDate(referral.clickedAt)}</TableCell>
                      <TableCell>
                        {referral.referredUserId ? 
                          referral.referredUserId.email : 
                          'Anonymous'
                        }
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={referral.status}
                          size="small"
                          color={referral.status === 'converted' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>{referral.source}</TableCell>
                      <TableCell>
                        {referral.commission?.amount ? 
                          formatCurrency(referral.commission.amount) : 
                          '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No referrals yet. Share your tracking link to get started!
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Commission History
          </Typography>
          {commissions.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Sale Amount</TableCell>
                    <TableCell>Commission</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payout Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commissions.map((commission: any) => (
                    <TableRow key={commission._id}>
                      <TableCell>{formatDate(commission.createdAt)}</TableCell>
                      <TableCell>{commission.sale?.planName || '-'}</TableCell>
                      <TableCell>
                        {commission.sale?.amount ? 
                          formatCurrency(commission.sale.amount) : 
                          '-'
                        }
                      </TableCell>
                      <TableCell>{formatCurrency(commission.amount)}</TableCell>
                      <TableCell>
                        <Chip
                          label={commission.status}
                          size="small"
                          color={getCommissionStatusColor(commission.status) as any}
                        />
                      </TableCell>
                                             <TableCell>
                         {commission.paidAt ? 
                           formatDate(commission.paidAt) : 
                           commission.nextPayoutDate ? 
                             formatDate(commission.nextPayoutDate) : 
                             '-'
                         }
                       </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No commissions yet.
            </Typography>
          )}
        </TabPanel>

                 <TabPanel value={tabValue} index={3}>
           <Typography variant="h6" gutterBottom>
             Sales Tracking
           </Typography>
           <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
             Track your referral sales and conversion rates. Monitor which campaigns are performing best.
           </Typography>
           
           <Grid container spacing={3}>
             <Grid item xs={12} md={6}>
               <Card>
                 <CardContent>
                   <Typography variant="h6" gutterBottom>
                     Conversion Rate
                   </Typography>
                   <Typography variant="h4" color="primary">
                     {affiliateData.totalReferrals > 0 
                       ? `${((affiliateData.totalSales / affiliateData.totalReferrals) * 100).toFixed(1)}%`
                       : '0%'
                     }
                   </Typography>
                   <Typography variant="body2" color="text.secondary">
                     {affiliateData.totalSales} sales from {affiliateData.totalReferrals} referrals
                   </Typography>
                 </CardContent>
               </Card>
             </Grid>
             
             <Grid item xs={12} md={6}>
               <Card>
                 <CardContent>
                   <Typography variant="h6" gutterBottom>
                     Average Sale Value
                   </Typography>
                   <Typography variant="h4" color="primary">
                     {affiliateData.totalSales > 0 
                       ? formatCurrency(affiliateData.totalSales / affiliateData.totalSales)
                       : '$0'
                     }
                   </Typography>
                   <Typography variant="body2" color="text.secondary">
                     Average commission per sale
                   </Typography>
                 </CardContent>
               </Card>
             </Grid>
           </Grid>
           
           <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
             Recent Sales Activity
           </Typography>
           {commissions.length > 0 ? (
             <TableContainer>
               <Table>
                 <TableHead>
                   <TableRow>
                     <TableCell>Date</TableCell>
                     <TableCell>Customer</TableCell>
                     <TableCell>Plan</TableCell>
                     <TableCell>Sale Amount</TableCell>
                     <TableCell>Commission</TableCell>
                     <TableCell>Status</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {commissions.map((commission: any) => (
                     <TableRow key={commission._id}>
                       <TableCell>{formatDate(commission.createdAt)}</TableCell>
                       <TableCell>
                         {commission.referralId?.referredUserId?.email || 'Anonymous'}
                       </TableCell>
                       <TableCell>{commission.sale?.planName || '-'}</TableCell>
                       <TableCell>
                         {commission.sale?.amount ? 
                           formatCurrency(commission.sale.amount) : 
                           '-'
                         }
                       </TableCell>
                       <TableCell>{formatCurrency(commission.amount)}</TableCell>
                       <TableCell>
                         <Chip
                           label={commission.status}
                           size="small"
                           color={getCommissionStatusColor(commission.status) as any}
                         />
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </TableContainer>
           ) : (
             <Typography variant="body2" color="text.secondary">
               No sales activity yet. Share your tracking link to start earning commissions!
             </Typography>
           )}
         </TabPanel>

         <TabPanel value={tabValue} index={4}>
           <Typography variant="h6" gutterBottom>
             Payout Information
           </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Update your payout information to receive commissions. We pay via PayPal or bank transfer.
          </Typography>
          
          <Button
            variant="contained"
            onClick={() => setPayoutDialogOpen(true)}
            sx={{ mb: 2 }}
          >
            Update Payout Info
          </Button>
          
          {affiliateData.payoutInfo?.paypalEmail && (
            <Alert severity="info" sx={{ mt: 2 }}>
              PayPal email: {affiliateData.payoutInfo.paypalEmail}
            </Alert>
          )}
          
          {affiliateData.payoutInfo?.bankInfo?.accountName && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Bank account: {affiliateData.payoutInfo.bankInfo.accountName} - {affiliateData.payoutInfo.bankInfo.bankName}
            </Alert>
          )}
        </TabPanel>
      </Paper>

      {/* Registration Dialog */}
      <Dialog open={registerDialogOpen} onClose={() => setRegisterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for Affiliate Program</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please provide your payout information and review our affiliate agreement. We'll review your application and get back to you within 24-48 hours.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Payment Information
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select your preferred payment method. You can update this later.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <input
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="paypal"
                checked={registerForm.preferredPaymentMethod === 'paypal'}
                onChange={(e) => setRegisterForm({ ...registerForm, preferredPaymentMethod: e.target.value })}
              />
              <label htmlFor="paypal" style={{ marginLeft: 8, fontWeight: 500 }}>
                PayPal (Recommended)
              </label>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <input
                type="radio"
                id="stripe"
                name="paymentMethod"
                value="stripe"
                checked={registerForm.preferredPaymentMethod === 'stripe'}
                onChange={(e) => setRegisterForm({ ...registerForm, preferredPaymentMethod: e.target.value })}
              />
              <label htmlFor="stripe" style={{ marginLeft: 8, fontWeight: 500 }}>
                Stripe Connect (Lower fees)
              </label>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <input
                type="radio"
                id="bank"
                name="paymentMethod"
                value="bank"
                checked={registerForm.preferredPaymentMethod === 'bank'}
                onChange={(e) => setRegisterForm({ ...registerForm, preferredPaymentMethod: e.target.value })}
              />
              <label htmlFor="bank" style={{ marginLeft: 8, fontWeight: 500 }}>
                Bank Transfer (US only)
              </label>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <input
                type="radio"
                id="zelle"
                name="paymentMethod"
                value="zelle"
                checked={registerForm.preferredPaymentMethod === 'zelle'}
                onChange={(e) => setRegisterForm({ ...registerForm, preferredPaymentMethod: e.target.value })}
              />
              <label htmlFor="zelle" style={{ marginLeft: 8, fontWeight: 500 }}>
                Zelle (US only - Instant)
              </label>
            </Box>
          </Box>

          {registerForm.preferredPaymentMethod === 'paypal' && (
            <TextField
              fullWidth
              label="PayPal Email"
              value={registerForm.paypalEmail}
              onChange={(e) => setRegisterForm({ ...registerForm, paypalEmail: e.target.value })}
              margin="normal"
              type="email"
              required
              helperText="We'll send your commissions to this PayPal email address"
            />
          )}

          {registerForm.preferredPaymentMethod === 'stripe' && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Stripe Connect allows direct bank transfers with lower fees. You'll complete the setup after approval.
              </Typography>
              <TextField
                fullWidth
                label="Business Name"
                value={registerForm.stripeConnect.businessName}
                onChange={(e) => setRegisterForm({
                  ...registerForm,
                  stripeConnect: { ...registerForm.stripeConnect, businessName: e.target.value }
                })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Business Type"
                value={registerForm.stripeConnect.businessType}
                onChange={(e) => setRegisterForm({
                  ...registerForm,
                  stripeConnect: { ...registerForm.stripeConnect, businessType: e.target.value }
                })}
                margin="normal"
                required
                select
                SelectProps={{ native: true }}
              >
                <option value="">Select business type</option>
                <option value="individual">Individual</option>
                <option value="corporation">Corporation</option>
                <option value="llc">LLC</option>
                <option value="partnership">Partnership</option>
                <option value="non_profit">Non-profit</option>
              </TextField>
            </Box>
          )}
          
          {registerForm.preferredPaymentMethod === 'zelle' && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Zelle payments are instant and only available for US-based affiliates.
              </Typography>
              <TextField
                fullWidth
                label="Zelle Email or Phone"
                value={registerForm.zelleInfo.emailOrPhone}
                onChange={(e) => setRegisterForm({
                  ...registerForm,
                  zelleInfo: { ...registerForm.zelleInfo, emailOrPhone: e.target.value }
                })}
                margin="normal"
                required
                helperText="Enter the email or phone number associated with your Zelle account"
              />
            </Box>
          )}

          {registerForm.preferredPaymentMethod !== 'bank' && registerForm.preferredPaymentMethod !== 'zelle' && (
            <>
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Bank Information (Optional - Backup)
              </Typography>
              
              <TextField
                fullWidth
                label="Account Holder Name"
                value={registerForm.bankInfo.accountName}
                onChange={(e) => setRegisterForm({
                  ...registerForm,
                  bankInfo: { ...registerForm.bankInfo, accountName: e.target.value }
                })}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Account Number"
                value={registerForm.bankInfo.accountNumber}
                onChange={(e) => setRegisterForm({
                  ...registerForm,
                  bankInfo: { ...registerForm.bankInfo, accountNumber: e.target.value }
                })}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Routing Number"
                value={registerForm.bankInfo.routingNumber}
                onChange={(e) => setRegisterForm({
                  ...registerForm,
                  bankInfo: { ...registerForm.bankInfo, routingNumber: e.target.value }
                })}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Bank Name"
                value={registerForm.bankInfo.bankName}
                onChange={(e) => setRegisterForm({
                  ...registerForm,
                  bankInfo: { ...registerForm.bankInfo, bankName: e.target.value }
                })}
                margin="normal"
              />
            </>
          )}

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Affiliate Agreement
          </Typography>
          
          <Box sx={{ 
            maxHeight: 200, 
            overflow: 'auto', 
            border: '1px solid #ddd', 
            borderRadius: 1, 
            p: 2, 
            mb: 2,
            backgroundColor: '#f9f9f9'
          }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              <strong>PublishJockey Affiliate Program Agreement</strong>
              <br /><br />
              By participating in the PublishJockey Affiliate Program, you agree to the following terms:
              <br /><br />
                                            <strong>1. Commission Structure:</strong>
                • 20% commission during promotional period
                • 15% commission after promotional period
                • 60-day payout delay for fraud prevention
                • No refunds = guaranteed commissions
                • $50 minimum payout requirement
                • Payment processing fees deducted from commission amount
              <br /><br />
                             <strong>2. Your Responsibilities:</strong>
               • Promote PublishJockey ethically and honestly
               • Not engage in spam, misleading advertising, or fraudulent activities
               • Comply with all applicable laws and regulations
               • Maintain accurate and up-to-date payout information
               • Be responsible for all taxes on commissions earned
              <br /><br />
                                            <strong>3. Our Responsibilities:</strong>
                • Track and credit all valid referrals
                • Process payouts on the 15th of each month for commissions 60+ days old
                • Provide marketing materials and support
                • Maintain program transparency
                • Hold commissions for 60 days to prevent fraud and chargebacks
                • Deduct payment processing fees from commission amounts
              <br /><br />
              <strong>4. Termination:</strong>
              • Either party may terminate with 30 days written notice
              • PublishJockey reserves the right to terminate for violations
              • Outstanding commissions will be paid according to schedule
              <br /><br />
              <strong>5. Limitation of Liability:</strong>
              • PublishJockey is not liable for indirect or consequential damages
              • Maximum liability limited to total commissions earned
              <br /><br />
              This agreement is effective upon acceptance and continues until terminated.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Checkbox
              checked={agreementAccepted}
              onChange={(e) => setAgreementAccepted(e.target.checked)}
              size="small"
            />
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              I have read and agree to the <strong>PublishJockey Affiliate Program Agreement</strong> above. 
              I understand that by checking this box, I am entering into a legally binding agreement.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setRegisterDialogOpen(false);
            setAgreementAccepted(false);
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleRegisterAffiliate} 
            variant="contained"
            disabled={registerLoading || !agreementAccepted}
          >
            {registerLoading ? <CircularProgress size={20} /> : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payout Info Dialog */}
      <Dialog open={payoutDialogOpen} onClose={() => setPayoutDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Payout Information</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="PayPal Email"
            value={payoutForm.paypalEmail}
            onChange={(e) => setPayoutForm({ ...payoutForm, paypalEmail: e.target.value })}
            margin="normal"
            type="email"
          />
          
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Bank Information (Optional)
          </Typography>
          
          <TextField
            fullWidth
            label="Account Holder Name"
            value={payoutForm.bankInfo.accountName}
            onChange={(e) => setPayoutForm({
              ...payoutForm,
              bankInfo: { ...payoutForm.bankInfo, accountName: e.target.value }
            })}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Account Number"
            value={payoutForm.bankInfo.accountNumber}
            onChange={(e) => setPayoutForm({
              ...payoutForm,
              bankInfo: { ...payoutForm.bankInfo, accountNumber: e.target.value }
            })}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Routing Number"
            value={payoutForm.bankInfo.routingNumber}
            onChange={(e) => setPayoutForm({
              ...payoutForm,
              bankInfo: { ...payoutForm.bankInfo, routingNumber: e.target.value }
            })}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Bank Name"
            value={payoutForm.bankInfo.bankName}
            onChange={(e) => setPayoutForm({
              ...payoutForm,
              bankInfo: { ...payoutForm.bankInfo, bankName: e.target.value }
            })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayoutDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdatePayoutInfo} 
            variant="contained"
            disabled={payoutLoading}
          >
            {payoutLoading ? <CircularProgress size={20} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AffiliateDashboard;
