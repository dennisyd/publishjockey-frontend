import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Divider,
  Container,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ListAlt as ListAltIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import UserManagement from './UserManagement';
import TestimonialApproval from '../../components/admin/TestimonialApproval';
import * as adminService from '../../services/adminService';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    activeBooks: 0
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminService.getDashboardStats();
        if (response.success) {
          setStats(response.stats);
        }
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    if (tabValue === 0) {
      fetchStats();
    }
  }, [tabValue]);

  if (currentUser?.role !== 'admin') {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" color="error">Access Denied</Typography>
            <Typography>
              You do not have permission to access the Admin Dashboard.
              Please contact an administrator if you believe this is an error.
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ borderRadius: 0 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          aria-label="admin dashboard tabs"
        >
          <Tab icon={<DashboardIcon />} label="Overview" {...a11yProps(0)} />
          <Tab icon={<PeopleIcon />} label="User Management" {...a11yProps(1)} />
          <Tab icon={<ListAltIcon />} label="Content Management" {...a11yProps(2)} />
          <Tab icon={<AssessmentIcon />} label="Analytics" {...a11yProps(3)} />
          <Tab icon={<SettingsIcon />} label="Settings" {...a11yProps(4)} />
        </Tabs>
      </Paper>
      <Divider />
      
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Admin Dashboard</Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Total Users</Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={30} />
                  </Box>
                ) : (
                  <Typography variant="h3">{stats.totalUsers}</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Active Projects</Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={30} />
                  </Box>
                ) : (
                  <Typography variant="h3">{stats.activeBooks}</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Premium Users</Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={30} />
                  </Box>
                ) : (
                  <Typography variant="h3">{stats.premiumUsers}</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <UserManagement />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Content Management</Typography>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Testimonial Approval</Typography>
            <Paper sx={{ p: 2, mb: 4 }}>
              <TestimonialApproval />
            </Paper>
          </Box>
        </Box>
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Analytics</Typography>
          <Typography>Analytics features will be implemented here.</Typography>
        </Box>
      </TabPanel>
      
      <TabPanel value={tabValue} index={4}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Admin Settings</Typography>
          <Typography>Admin settings features will be implemented here.</Typography>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default AdminDashboard; 