import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import defaultAvatar from '../assets/default-avatar.png';

const Navigation: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState<null | HTMLElement>(null);

  // Debug log for auth state
  console.log('NAVIGATION AUTH STATE', { currentUser });

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  // Get display name or email prefix
  const displayName = currentUser?.name || (currentUser?.email ? currentUser.email.split('@')[0] : 'User');
  // Use a default avatar (no user.avatarUrl property exists)
  const avatarSrc = defaultAvatar;

  return (
    <AppBar position="static" color="default" elevation={1} className="!bg-white !shadow-sm">
      <Container maxWidth="lg">
        <Toolbar disableGutters className="flex justify-between w-full">
          {/* Logo/App Name */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}
          >
            <Link to="/" className="text-inherit no-underline" style={{ display: 'flex', alignItems: 'center' }}>
              <img src={require('../publishjockey_logo.png')} alt="PublishJockey Logo" style={{ height: 36, marginRight: 8 }} />
            </Link>
          </Typography>

          {/* Mobile Logo */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}
          >
            <Link to="/" className="text-inherit no-underline" style={{ display: 'flex', alignItems: 'center' }}>
              <img src={require('../publishjockey_logo.png')} alt="PublishJockey Logo" style={{ height: 32, marginRight: 8 }} />
            </Link>
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {currentUser ? (
              <>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                {currentUser?.role === 'admin' && (
                  <Button color="inherit" component={Link} to="/admin">
                    Admin
                  </Button>
                )}
                <Button color="inherit" component={Link} to="/split-doctor">
                  SplitDoctor
                </Button>
                <Button color="inherit" component={Link} to="/image-magic">
                  ImageMagic
                </Button>
                {currentUser?.subscription === 'free' && (
                  <Button 
                    color="primary" 
                    variant="outlined" 
                    component={Link} 
                    to="/pricing"
                    sx={{ ml: 1 }}
                  >
                    Upgrade
                  </Button>
                )}
                <Button color="inherit" component={Link} to="/contact">
                  Contact
                </Button>
                <div className="relative ml-4">
                  <IconButton
                    onClick={handleUserMenuOpen}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      borderRadius: 2,
                      p: 0.5,
                      border: '1px solid #ccc', // Optional: subtle border
                      background: 'white',      // Optional: white background
                      boxShadow: 1,             // Optional: slight shadow
                      '&:hover': { boxShadow: 2 }
                    }}
                    data-testid="user-menu-button"
                  >
                    <Avatar
                      src={avatarSrc}
                      sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 18 }}
                      className="border-2 border-white shadow"
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </Avatar>
                    <span style={{ fontWeight: 500, fontSize: 16, marginLeft: 8 }}>{displayName}</span>
                    <ChevronDownIcon className="text-gray-500" />
                  </IconButton>
                  <Menu
                    anchorEl={userMenuAnchorEl}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(userMenuAnchorEl)}
                    onClose={handleUserMenuClose}
                    className="z-50"
                    PaperProps={{
                      className: 'min-w-[180px] rounded-lg shadow-lg',
                      style: { marginTop: 8 }
                    }}
                  >
                    <MenuItem onClick={() => { handleUserMenuClose(); navigate('/dashboard'); }}>
                      Dashboard
                    </MenuItem>
                    {currentUser?.role === 'admin' && (
                      <MenuItem onClick={() => { handleUserMenuClose(); navigate('/admin'); }}>
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => { handleUserMenuClose(); navigate('/split-doctor'); }}>
                      <SplitscreenIcon fontSize="small" sx={{ mr: 1.5 }} />
                      SplitDoctor
                    </MenuItem>
                    <MenuItem onClick={() => { handleUserMenuClose(); navigate('/image-magic'); }}>
                      <SplitscreenIcon fontSize="small" sx={{ mr: 1.5 }} />
                      ImageMagic
                    </MenuItem>
                    <MenuItem onClick={() => { handleUserMenuClose(); navigate('/settings'); }}>
                      Settings
                    </MenuItem>
                    {currentUser?.subscription === 'free' && (
                      <MenuItem onClick={() => { handleUserMenuClose(); navigate('/pricing'); }} 
                        sx={{ color: 'primary.main', fontWeight: 500 }}>
                        Upgrade Plan
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout} className="text-red-600">
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/contact">
                  Contact
                </Button>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  component={Link}
                  to="/register"
                  sx={{ ml: 1 }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Navigation */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            {currentUser && (
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-full border border-gray-200 hover:bg-gray-100 transition focus:outline-none"
                onClick={handleUserMenuOpen}
                aria-haspopup="true"
                aria-expanded={Boolean(userMenuAnchorEl)}
                data-testid="user-menu-button-mobile"
              >
                <Avatar
                  src={avatarSrc}
                  sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 16 }}
                  className="border-2 border-white shadow"
                >
                  {displayName.charAt(0).toUpperCase()}
                </Avatar>
                <ChevronDownIcon className="text-gray-500" />
              </button>
            )}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileAnchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(mobileAnchorEl)}
              onClose={handleMobileMenuClose}
              className="z-50"
              PaperProps={{
                className: 'min-w-[160px] rounded-lg shadow-lg',
                style: { marginTop: 8 }
              }}
            >
              <MenuItem onClick={() => { navigate('/'); handleMobileMenuClose(); }}>
                Home
              </MenuItem>
              {currentUser ? (
                [
                  <MenuItem key="home" onClick={() => { navigate('/'); handleMobileMenuClose(); }}>
                    Home
                  </MenuItem>,
                  <MenuItem key="dashboard" onClick={() => { navigate('/dashboard'); handleMobileMenuClose(); }}>
                    Dashboard
                  </MenuItem>,
                  currentUser?.role === 'admin' && (
                    <MenuItem key="admin" onClick={() => { navigate('/admin'); handleMobileMenuClose(); }}>
                      Admin Dashboard
                    </MenuItem>
                  ),
                  <MenuItem key="split-doctor" onClick={() => { navigate('/split-doctor'); handleMobileMenuClose(); }}>
                    SplitDoctor
                  </MenuItem>,
                  <MenuItem key="image-magic" onClick={() => { navigate('/image-magic'); handleMobileMenuClose(); }}>
                    ImageMagic
                  </MenuItem>,
                  <MenuItem key="contact" onClick={() => { navigate('/contact'); handleMobileMenuClose(); }}>
                    Contact
                  </MenuItem>,
                  currentUser?.subscription === 'free' && (
                    <MenuItem key="upgrade" onClick={() => { navigate('/pricing'); handleMobileMenuClose(); }} 
                      sx={{ color: 'primary.main', fontWeight: 500 }}>
                      Upgrade Plan
                    </MenuItem>
                  ),
                  <MenuItem key="logout" onClick={() => { logout(); handleMobileMenuClose(); navigate('/'); }} className="text-red-600">
                    Logout
                  </MenuItem>
                ]
              ) : (
                [
                  <MenuItem key="login" onClick={() => { navigate('/login'); handleMobileMenuClose(); }}>
                    Login
                  </MenuItem>,
                  <MenuItem key="contact" onClick={() => { navigate('/contact'); handleMobileMenuClose(); }}>
                    Contact
                  </MenuItem>,
                  <MenuItem key="register" onClick={() => { navigate('/register'); handleMobileMenuClose(); }}>
                    Register
                  </MenuItem>
                ]
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation; 