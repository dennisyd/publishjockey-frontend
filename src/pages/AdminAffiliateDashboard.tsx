import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  People,
  ShoppingCart,
  CheckCircle,
  Pending,
  Warning,
  Edit,
  Visibility,
  Payment,
  Refresh,
  Download,
  FilterList
} from '@mui/icons-material';
import { http } from '../services/http';

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
      id={`admin-affiliate-tabpanel-${index}`}
      aria-labelledby={`admin-affiliate-tab-${index}`}
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

const AdminAffiliateDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Payout processing
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);
  const [payoutLoading, setPayoutLoading] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('30');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    loadAdminData();
  }, [currentUser, navigate]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, affiliatesRes, commissionsRes, revenueRes] = await Promise.all([
        http.get('/admin/affiliates/stats'),
        http.get('/admin/affiliates'),
        http.get('/admin/commissions'),
        http.get('/admin/revenue')
      ]);
      
      setStats(statsRes.data);
      setAffiliates(affiliatesRes.data.affiliates || []);
      setCommissions(commissionsRes.data.commissions || []);
      setRevenue(revenueRes.data.revenue || []);
      
    } catch (error: any) {
      console.error('Error loading admin data:', error);
      setError('Failed to load admin data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayout = async (affiliate: any) => {
    setSelectedAffiliate(affiliate);
    setPayoutDialogOpen(true);
  };

  const confirmPayout = async () => {
    if (!selectedAffiliate) return;
    
    try {
      setPayoutLoading(true);
      
      const response = await http.post(`/admin/affiliates/${selectedAffiliate._id}/process-payout`);
      
      if (response.data.success) {
        setPayoutDialogOpen(false);
        setSelectedAffiliate(null);
        await loadAdminData(); // Refresh data
      } else {
        setError(response.data.message || 'Payout processing failed');
      }
    } catch (error: any) {
      console.error('Error processing payout:', error);
      setError('Payout processing failed. Please try again.');
    } finally {
      setPayoutLoading(false);
    }
  };

  const handleStatusChange = async (affiliateId: string, newStatus: string) => {
    try {
      const response = await http.put(`/admin/affiliates/${affiliateId}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        await loadAdminData(); // Refresh data
      }
    } catch (error: any) {
      console.error('Error updating affiliate status:', error);
      setError('Failed to update affiliate status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'error';
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

  const exportData = (type: string) => {
    // Implement CSV export functionality
    console.log(`Exporting ${type} data...`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Affiliate Program Admin
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadAdminData}
          >
            Refresh Data
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => exportData('affiliates')}
          >
            Export Data
          </Button>
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
                  <Typography variant="h4">{stats?.totalAffiliates || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Affiliates</Typography>
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
                  <Typography variant="h4">{formatCurrency(stats?.totalRevenue || 0)}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
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
                  <Typography variant="h4">{formatCurrency(stats?.totalCommissions || 0)}</Typography>
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
                  <Typography variant="h4">{formatCurrency(stats?.pendingPayouts || 0)}</Typography>
                  <Typography variant="body2" color="text.secondary">Pending Payouts</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper elevation={2}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Revenue Overview" />
          <Tab label="Commissions" />
          <Tab label="Affiliates" />
          <Tab label="Payouts" />
        </Tabs>

        {/* Revenue Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Revenue Overview
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Revenue
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {formatCurrency(stats?.monthlyRevenue || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This month's total revenue
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Commission Payouts
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {formatCurrency(stats?.totalPaidOut || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total paid to affiliates
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Commissions</TableCell>
                  <TableCell>Net Profit</TableCell>
                  <TableCell>Affiliate Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {revenue.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{formatCurrency(item.revenue)}</TableCell>
                    <TableCell>{formatCurrency(item.commissions)}</TableCell>
                    <TableCell>{formatCurrency(item.revenue - item.commissions)}</TableCell>
                    <TableCell>{item.affiliateCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Commissions Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Commission Management
          </Typography>
          
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <FormControl size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Affiliate</TableCell>
                  <TableCell>Sale Amount</TableCell>
                  <TableCell>Commission</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commissions.map((commission: any) => (
                  <TableRow key={commission._id}>
                    <TableCell>{formatDate(commission.createdAt)}</TableCell>
                    <TableCell>{commission.affiliateId?.email || 'Unknown'}</TableCell>
                    <TableCell>{formatCurrency(commission.sale?.amount || 0)}</TableCell>
                    <TableCell>{formatCurrency(commission.amount)}</TableCell>
                    <TableCell>
                      <Chip
                        label={commission.status}
                        size="small"
                        color={getStatusColor(commission.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Affiliates Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Affiliate Management
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total Sales</TableCell>
                  <TableCell>Total Commissions</TableCell>
                  <TableCell>Expected Payout</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {affiliates.map((affiliate: any) => (
                  <TableRow key={affiliate._id}>
                    <TableCell>{affiliate.userId?.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={affiliate.status}
                        size="small"
                        color={getStatusColor(affiliate.status) as any}
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(affiliate.totalSales)}</TableCell>
                    <TableCell>{formatCurrency(affiliate.totalCommissions)}</TableCell>
                    <TableCell>{formatCurrency(affiliate.expectedPayout || 0)}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit Affiliate">
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Process Payout">
                        <IconButton 
                          size="small"
                          onClick={() => handleProcessPayout(affiliate)}
                          disabled={affiliate.expectedPayout < 50}
                        >
                          <Payment />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Payouts Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Payout Management
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Payment />}
              onClick={() => {/* Implement bulk payout processing */}}
            >
              Process Monthly Payouts
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Affiliate</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Pending Amount</TableCell>
                  <TableCell>Next Payout Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {affiliates
                  .filter((affiliate: any) => affiliate.expectedPayout >= 50)
                  .map((affiliate: any) => (
                  <TableRow key={affiliate._id}>
                    <TableCell>{affiliate.userId?.email}</TableCell>
                    <TableCell>{affiliate.payoutInfo?.preferredPaymentMethod}</TableCell>
                    <TableCell>{formatCurrency(affiliate.expectedPayout)}</TableCell>
                    <TableCell>{formatDate(affiliate.nextPayoutDate || new Date())}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleProcessPayout(affiliate)}
                      >
                        Process Payout
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Payout Processing Dialog */}
      <Dialog open={payoutDialogOpen} onClose={() => setPayoutDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Process Payout</DialogTitle>
        <DialogContent>
          {selectedAffiliate && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Process payout for <strong>{selectedAffiliate.userId?.email}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Amount: {formatCurrency(selectedAffiliate.expectedPayout)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Payment Method: {selectedAffiliate.payoutInfo?.preferredPaymentMethod}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayoutDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmPayout} 
            variant="contained"
            disabled={payoutLoading}
          >
            {payoutLoading ? <CircularProgress size={20} /> : 'Confirm Payout'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminAffiliateDashboard;
