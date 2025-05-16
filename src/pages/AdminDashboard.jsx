import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import TestimonialApproval from '../components/admin/TestimonialApproval';

// Mock admin credentials - in a real app, this would be handled by an authentication system
const MOCK_ADMIN = {
  email: 'admin@publishjockey.com',
  password: 'admin123'
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  // Check if user is already logged in (could use localStorage/cookies in a real app)
  useEffect(() => {
    const checkAuth = async () => {
      // Simulate API call to check authentication
      await new Promise(resolve => setTimeout(resolve, 500));
      const storedAuth = localStorage.getItem('admin_authenticated');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setLoginError('');
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple credential check - in a real app, this would be a proper API call
      if (loginData.email === MOCK_ADMIN.email && loginData.password === MOCK_ADMIN.password) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        setSnackbar({
          open: true,
          message: 'Login successful. Welcome to the admin dashboard!',
          severity: 'success'
        });
      } else {
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      setLoginError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setUserMenuAnchor(null);
    setSnackbar({
      open: true,
      message: 'You have been logged out successfully',
      severity: 'info'
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  const renderLoginForm = () => (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Admin Login
        </Typography>
        <Typography variant="body1" paragraph align="center" color="text.secondary">
          Enter your credentials to access the admin dashboard
        </Typography>
        
        {loginError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loginError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={loginData.email}
            onChange={handleLoginChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={loginData.password}
            onChange={handleLoginChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            For demo purposes, use these credentials:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: admin@publishjockey.com
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Password: admin123
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
  
  const renderAdminDashboard = () => (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Publish Jockey Admin
          </Typography>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleUserMenuOpen}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={userMenuAnchor}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="admin navigation tabs"
          centered
        >
          <Tab label="Dashboard" />
          <Tab label="Testimonials" />
          <Tab label="Settings" />
        </Tabs>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {activeTab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Welcome to the Admin Dashboard</Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" paragraph>
              This is your control center for managing Publish Jockey content and settings. Use the tabs above to navigate to different sections.
            </Typography>
            <Typography variant="body1" paragraph>
              The Testimonials tab allows you to review, edit, approve, or reject user-submitted testimonials.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>Quick Stats</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">2</Typography>
                  <Typography variant="body2" color="text.secondary">Pending Testimonials</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">2</Typography>
                  <Typography variant="body2" color="text.secondary">Approved Testimonials</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">1</Typography>
                  <Typography variant="body2" color="text.secondary">Rejected Testimonials</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}
        
        {activeTab === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom>Testimonial Management</Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              Review, edit, approve or reject user-submitted testimonials. Approved testimonials will appear on the website.
            </Typography>
            <TestimonialApproval />
          </Box>
        )}
        
        {activeTab === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Settings</Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1">
              Account and site settings will be available here in a future update.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isAuthenticated ? renderAdminDashboard() : renderLoginForm()}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard; 