import React from 'react';
import { Button, Container, Typography, Box, Grid, Card, CardContent, Avatar, Divider, Accordion, AccordionSummary, AccordionDetails, AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';
import BookIcon from '@mui/icons-material/Book';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import TocIcon from '@mui/icons-material/Toc';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EmailIcon from '@mui/icons-material/Email';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ImageIcon from '@mui/icons-material/Image';
import DoneIcon from '@mui/icons-material/Done';
import BlockIcon from '@mui/icons-material/Block';
import StorageIcon from '@mui/icons-material/Storage';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
// Import logo
import PublishJockeyLogo from './publishjockey_logo.png';
import Testimonials from './components/Testimonials';
import { useRef, useState, useEffect } from 'react';
import { useAuth } from './auth/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import Footer from './components/Footer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Add at the top, after imports
function isAuthenticated() {
  // Example: check for a JWT token in localStorage
  return Boolean(localStorage.getItem('token'));
}

// Add in LandingHeader, before return
function handleLogout() {
  localStorage.removeItem('token');
  window.location.reload();
}

// Helper to get user display name
function getUserDisplayName() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      return user.name.split(' ')[0];
    } else if (user && user.email) {
      return user.email;
    }
  } catch {}
  return 'Account';
}

const PublishJockeyLanding = () => {
  // Add scroll padding when component mounts
  React.useEffect(() => {
    // Add scroll padding to account for fixed header and ensure section titles are visible
    document.documentElement.style.scrollPaddingTop = '80px';
    
    // Force scrolling to be enabled
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.overflowX = 'hidden';
    
    // Clean up when component unmounts
    return () => {
      document.documentElement.style.scrollPaddingTop = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.overflowX = '';
    };
  }, []);

  // State for terms and conditions modal
  const [termsOpen, setTermsOpen] = React.useState(false);
  const [termsAgreed, setTermsAgreed] = React.useState(false);
  
  // Handle opening terms modal
  const handleOpenTerms = () => {
    setTermsOpen(true);
  };
  
  // Handle closing terms modal
  const handleCloseTerms = () => {
    setTermsOpen(false);
  };
  
  // Handle terms agreement
  const handleTermsAgreement = (event) => {
    setTermsAgreed(event.target.checked);
  };
  
  // Handle register with terms verification
  const handleRegister = (e) => {
    // Remove the terms verification logic to allow direct navigation
    // The terms agreement will happen on the registration page itself
    // No need to prevent the default behavior
  };

  /* 
    NOTE: Regarding creating separate pages for features, pricing, and how-it-works:
    
    Separate pages would be beneficial for:
    1. Deeper, more detailed content about each section
    2. Better SEO targeting specific keywords for each topic
    3. Improved page load performance (smaller individual pages)
    4. Ability to link directly to specific content
    
    However, a single-page layout is good for:
    1. Quick overview for first-time visitors
    2. Lower friction user experience (no page transitions)
    3. Higher conversion rates (all info and CTAs visible in one journey)
    
    Recommendation: Keep this single-page layout for the main landing page, but 
    also create dedicated pages with expanded content for each section that 
    users can navigate to for more details.
  */

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'visible',
      paddingBottom: '70px'
    }}>
      <LandingHeader openTerms={handleOpenTerms} />
      
      {/* Ticker Tape */}
      <TickerTape />
      
      {/* Hero Section */}
      <Hero handleRegister={handleRegister} />
      
      {/* Mid-page CTA */}
      <MidPageCTA handleRegister={handleRegister} />
      
      {/* Features Section */}
      <Box component="section" id="features" sx={{ scrollMarginTop: '120px', padding: '10px 0 12px', background: '#ffffff', position: 'relative', zIndex: 1 }}>
        <Features />
      </Box>
      
      {/* How It Works Section */}
      <Box component="section" id="how-it-works" sx={{ scrollMarginTop: '90px', py: { xs: 1.2, md: 1.6 }, background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', position: 'relative', zIndex: 1 }}>
        <HowItWorks />
      </Box>
      
      {/* Testimonials Section */}
      <Box component="section" id="testimonials" sx={{ scrollMarginTop: '90px', py: { xs: 2, md: 3 }, backgroundColor: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
        <Testimonials />
      </Box>
      
      {/* Pricing Section */}
      <Box component="section" id="pricing" sx={{ scrollMarginTop: '90px', py: { xs: 1, md: 1.4 }, background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', position: 'relative', zIndex: 1 }}>
        <Pricing handleRegister={handleRegister} />
      </Box>
      
      {/* FAQ Section */}
      <Box component="section" id="faq" sx={{ scrollMarginTop: '90px', py: { xs: 1, md: 1.4 }, background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', position: 'relative', zIndex: 1 }}>
        <FAQ />
      </Box>
      
      {/* Footer */}
      <Footer />
      
      {/* Fixed bottom banner */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'white',
          py: 2,
          boxShadow: '0 -4px 10px rgba(0,0,0,0.05)',
          zIndex: 10,
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Typography
          component="span"
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Ready to publish your book?
        </Typography>
        <Button
          href="/register"
          variant="contained"
          color="primary"
          disableElevation
          sx={{
            borderRadius: '50px',
            px: 4,
            py: 1,
            fontWeight: 600,
            textTransform: 'none'
          }}
        >
          Register Now
        </Button>
      </Box>
      
      {/* Terms and Conditions Modal */}
      <Dialog
        open={termsOpen}
        onClose={handleCloseTerms}
        scroll="paper"
        aria-labelledby="terms-dialog-title"
        maxWidth="md"
      >
        <DialogTitle id="terms-dialog-title" sx={{ 
          fontWeight: 700, 
          fontSize: '1.5rem',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          Terms and Agreement
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ 
            height: '400px', 
            overflowY: 'auto',
            pr: 2,
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
          }}>
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
              By clicking "Register" or creating an account, you acknowledge that you have read, understood, and agree to be bound by these terms.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 2
        }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={termsAgreed}
                onChange={handleTermsAgreement}
                color="primary"
              />
            }
            label="I have read and agree to the terms and conditions"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button onClick={handleCloseTerms} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleCloseTerms}
              variant="contained" 
              color="primary"
              disabled={!termsAgreed}
              href="/register"
              sx={{
                borderRadius: '50px',
                px: 3,
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Accept & Register
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      
    </Box>
  );
};

// Ticker Tape Component
const TickerTape = () => {
  // Ticker items with icons
  const tickerItems = [
    { text: "⚡ PDFs in 15 seconds. EPUB & Word docs in under 2." },
    { text: "🧠 Real-time preview shows your content before you publish." },
    { text: "🖼️ Native image and table support—no formatting headaches." },
    { text: "✅ Only one book? No problem. Unlimited edits & downloads of your final manuscript." },
    { text: "🚫 Unused sections? Delete, rename, or ignore—your choice." },
    { text: "📘 Your manuscript isn't stored—only Markdown files while your account is active." },
    { text: "📚 Textbook publishing not yet supported—let us know if you need it!" },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '80px', // Right below the header
        left: 0,
        right: 0,
        zIndex: 1050,
        width: '100%',
        background: 'linear-gradient(90deg, #005c97 0%, #363795 100%)', // Horizontal gradient from navy to slate blue
        color: 'white',
        overflow: 'hidden',
        height: '74px', // Slightly increased height for more padding
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '0 0 8px 8px', // Rounded bottom corners
        padding: '0 15px', // Add horizontal padding
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: 'fit-content',
          whiteSpace: 'nowrap',
          marginLeft: '100%', // Start offscreen on the right
          animation: 'ticker-slide 60s linear infinite',
          '@keyframes ticker-slide': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-100%)' }, // Move left by 100%
          },
          height: '100%',
        }}
      >
        {tickerItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              margin: '0 35px',
              fontSize: '18px', // Increased font size
              fontWeight: 600,
              letterSpacing: '0.2px',
              textShadow: '0px 1px 2px rgba(0,0,0,0.4)', // Enhanced text shadow for better readability
              height: '100%',
              paddingTop: '18px', // Adjusted to center text better
            }}
          >
            {item.text}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const LandingHeader = ({ openTerms }) => {
  const { user, isAuthenticated, logout } = useAuth();

  // State for dropdowns
  const [productAnchorEl, setProductAnchorEl] = useState(null);
  const [resourcesAnchorEl, setResourcesAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);

  const handleProductMenuOpen = (event) => setProductAnchorEl(event.currentTarget);
  const handleProductMenuClose = () => setProductAnchorEl(null);
  const handleResourcesMenuOpen = (event) => setResourcesAnchorEl(event.currentTarget);
  const handleResourcesMenuClose = () => setResourcesAnchorEl(null);
  const handleAccountMenuOpen = (event) => setAccountAnchorEl(event.currentTarget);
  const handleAccountMenuClose = () => setAccountAnchorEl(null);

  return (
    <AppBar position="fixed" elevation={0} sx={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.98)', 
      borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
      backdropFilter: 'blur(12px)',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      minHeight: '80px',
      zIndex: 1100
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 2,
          width: '100%'
        }}>
          {/* Logo */}
          <Box 
            component="a"
            href="#hero"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
              maxWidth: '190px'
            }}
          >
            <Box 
              component="img"
              src={PublishJockeyLogo} 
              alt="Publish Jockey Logo"
              sx={{ 
                height: { xs: '55px', sm: '65px', md: '80px' },
                width: 'auto',
                display: 'block'
              }}
            />
          </Box>

          {/* Navigation Links and Auth Buttons Container */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            flexGrow: 1,
            ml: 3,
            flexWrap: { xs: 'wrap', md: 'nowrap' }
          }}>
            {/* Navigation Links */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 2
            }}>
              {isAuthenticated ? (
                <>
                  {/* Product Dropdown - Only for authenticated users */}
                  <Button
                    onClick={handleProductMenuOpen}
                    sx={{
                      color: 'text.primary',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': { bgcolor: 'transparent' }
                    }}
                    endIcon={<ExpandMoreIcon />}
                  >
                    Product
                  </Button>
                  <Menu
                    anchorEl={productAnchorEl}
                    open={Boolean(productAnchorEl)}
                    onClose={handleProductMenuClose}
                    sx={{ mt: 1 }}
                  >
                    <MenuItem onClick={() => { handleProductMenuClose(); window.location.href = '/#features'; }}>
                      Features
                    </MenuItem>
                    <MenuItem onClick={() => { handleProductMenuClose(); window.location.href = '/#how-it-works'; }}>
                      How it Works
                    </MenuItem>
                    <MenuItem onClick={() => { handleProductMenuClose(); window.location.href = '/#pricing'; }}>
                      Pricing
                    </MenuItem>
                  </Menu>

                  {/* Resources Dropdown - Only for authenticated users */}
                  <Button
                    onClick={handleResourcesMenuOpen}
                    sx={{
                      color: 'text.primary',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': { bgcolor: 'transparent' }
                    }}
                    endIcon={<ExpandMoreIcon />}
                  >
                    Resources
                  </Button>
                  <Menu
                    anchorEl={resourcesAnchorEl}
                    open={Boolean(resourcesAnchorEl)}
                    onClose={handleResourcesMenuClose}
                    sx={{ mt: 1 }}
                  >
                    <MenuItem onClick={() => { handleResourcesMenuClose(); window.location.href = '/blog'; }}>
                      Blog
                    </MenuItem>
                    <MenuItem onClick={() => { handleResourcesMenuClose(); window.location.href = '/#faq'; }}>
                      FAQ
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  {/* Expanded menu for anonymous visitors */}
                  <Button 
                    href="/#features"
                    sx={{ 
                      color: 'text.primary',
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Features
                  </Button>
                  <Button 
                    href="/#how-it-works"
                    sx={{ 
                      color: 'text.primary',
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    How it Works
                  </Button>
                  <Button 
                    href="/#pricing"
                    sx={{ 
                      color: 'text.primary',
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Pricing
                  </Button>
                  <Button 
                    href="/blog"
                    sx={{ 
                      color: 'text.primary',
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Blog
                  </Button>
                  <Button 
                    href="/#faq"
                    sx={{ 
                      color: 'text.primary',
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    FAQ
                  </Button>
                </>
              )}

              {/* Common links for both authenticated and anonymous users */}
              <Button 
                href="#testimonials"
                sx={{ 
                  color: 'text.primary',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Testimonials
              </Button>
              <Button 
                href="/about"
                sx={{ 
                  color: 'text.primary',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                About
              </Button>
              {isAuthenticated && (
                <Button 
                  href="/submit-testimonial"
                  sx={{ 
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Share Your Story
                </Button>
              )}
            </Box>

            {/* Auth Buttons */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              ml: { xs: 0, md: 2 },
              mt: { xs: 1, md: 0 }
            }}>
              {isAuthenticated ? (
                <>
                  <IconButton
                    onClick={handleAccountMenuOpen}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 2,
                      p: 0.5,
                      border: '1px solid #ccc',
                      background: 'white',
                      boxShadow: 1,
                      '&:hover': { boxShadow: 2 }
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 18 }}>
                      {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
                    </Avatar>
                    <span style={{ fontWeight: 500, fontSize: 14, marginLeft: 8, color: '#222', whiteSpace: 'nowrap' }}>
                      {user?.name || user?.email || 'Account'}
                    </span>
                    <ExpandMoreIcon sx={{ color: 'gray.500', ml: 1 }} />
                  </IconButton>
                  <Menu
                    anchorEl={accountAnchorEl}
                    open={Boolean(accountAnchorEl)}
                    onClose={handleAccountMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem onClick={() => { handleAccountMenuClose(); window.location.href = '/dashboard'; }}>
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={() => { handleAccountMenuClose(); window.location.href = '/account'; }}>
                      Account Settings
                    </MenuItem>
                    <MenuItem onClick={() => { handleAccountMenuClose(); logout(); }} sx={{ color: 'error.main' }}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    href="/login"
                    variant="outlined"
                    color="primary"
                    sx={{
                      mr: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: '50px',
                      px: 3
                    }}
                  >
                    Log in
                  </Button>
                  <Button 
                    href="/register" 
                    variant="contained" 
                    color="primary" 
                    disableElevation 
                    sx={{ 
                      textTransform: 'none', 
                      fontWeight: 600,
                      borderRadius: '50px',
                      px: 3,
                      boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(99, 102, 241, 0.23)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s'
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
};

const Hero = ({ handleRegister }) => {
  return (
    <Box
      id="hero"
      sx={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        backgroundImage: 'url("https://images.unsplash.com/photo-1550399105-c4db5fb85c18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 10, md: 14 },
        pb: { xs: 6, md: 8 }
      }}
    >
      {/* Dark overlay */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(31, 41, 90, 0.85)',
          zIndex: 0
        }}
      />
      
      {/* Background decoration */}
      <Box 
        sx={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          top: '-200px',
          right: '-100px',
          zIndex: 0
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          bottom: '-150px',
          left: '-150px',
          zIndex: 0
        }}
      />
      
      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: '600px', mx: 'auto', textAlign: { xs: 'center', md: 'left' } }}>
              <Box 
                sx={{ 
                  display: 'inline-block',
                  px: 2,
                  py: 0.5,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  borderRadius: '30px',
                  color: 'white',
                  mb: 3,
                  mt: 0,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  Write anywhere. Publish here — fast, clean, professional.
                </Typography>
              </Box>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '3.5rem' }, 
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 2,
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                Turn Your Writing Into Professional Books
              </Typography>
              <Typography 
                variant="h2" 
                component="p" 
                sx={{ 
                  fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                  fontWeight: 400, 
                  opacity: 0.9, 
                  mb: 3,
                  lineHeight: 1.4,
                  maxWidth: '530px',
                  mx: { xs: 'auto', md: 0 }
                }}
              >
                Simple markdown editing paired with beautiful typesetting technology that gets your books print-ready in minutes.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <Button 
                  href="/register" 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    fontWeight: 600,
                    borderRadius: '50px',
                    px: 3,
                    py: 1,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                    '&:hover': {
                      bgcolor: 'white',
                      boxShadow: '0 6px 20px rgba(255, 255, 255, 0.4)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s'
                    }
                  }}
                >
                  Register
                </Button>
                <Button 
                  href="#how-it-works" 
                  variant="outlined"
                  size="large"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.6)', 
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '50px',
                    px: 3,
                    py: 1,
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s'
                    }
                  }}
                >
                  See How It Works
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}>
              <Box sx={{ 
                position: 'relative',
                p: 2,
                mx: 'auto',
                maxWidth: '500px',
                height: { xs: 'auto', md: '250px' },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  right: '10px',
                  bottom: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '24px',
                  zIndex: -1
                }
              }}>
                <Box 
                  sx={{ 
                    bgcolor: 'white', 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80" 
                    alt="Book publishing preview" 
                    style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
                  />
                </Box>
              </Box>
              
              {/* Stats moved here */}
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-around',
                px: 2,
                py: 1.5,
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, fontSize: '1.75rem', mb: 0 }}>2,500+</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>Authors</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, fontSize: '1.75rem', mb: 0 }}>15,000+</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>Books</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, fontSize: '1.75rem', mb: 0 }}>4.9/5</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>Rating</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const MidPageCTA = ({ handleRegister }) => {
  return (
    <Box sx={{ 
      py: { xs: 10, md: 12 }, 
      textAlign: 'center',
      background: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)'
    }}>
      <Container maxWidth="md">
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ 
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            fontWeight: 700,
            mb: 3
          }}
        >
          Transform Your Manuscript Today
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: { xs: '1.1rem', md: '1.25rem' }, 
            opacity: 0.8,
            mb: 5,
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          Join thousands of authors who have simplified their publishing workflow with Publish Jockey.
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
          <Button 
            href="/register" 
            variant="contained" 
            size="large"
            disableElevation
            color="primary"
            sx={{ 
              fontWeight: 600,
              borderRadius: '50px',
              px: 5,
              py: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.23)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }
            }}
          >
            Register Now
          </Button>
          <Button 
            href="#how-it-works" 
            variant="outlined"
            size="large"
            color="primary"
            sx={{ 
              fontWeight: 600,
              borderRadius: '50px',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }
            }}
          >
            See How It Works
          </Button>
        </Box>
        {/* Logos */}
        <Box sx={{ mt: 8, opacity: 0.6 }}>
          <Typography variant="overline" sx={{ display: 'block', mb: 3, letterSpacing: 1.5 }}>
            TRUSTED BY PUBLISHERS WORLDWIDE
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary' }}>KDP</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary' }}>IngramSpark</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary' }}>Lulu</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary' }}>BookBaby</Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

const Features = () => {
  return (
    <Box 
      component="section" 
      id="features" 
      sx={{ 
        padding: '10px 0 12px', 
        background: '#ffffff',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
          <Typography 
            variant="subtitle1" 
            component="p"
            color="primary"
            sx={{ 
              fontWeight: 600,
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            Why Authors Choose Us
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 800,
              mb: 2,
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            Features designed for serious authors
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            Everything you need to create professional books without the hassle
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(0,0,0,0.06)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ p: 4, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                    <EditIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h5" component="h3" fontWeight={700}>
                    Markdown Editor
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Write your content in simple markdown format with our intuitive editor. No complex formatting required.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Supports all standard markdown syntax including headings, lists, links, images, tables, and code blocks.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Real-time preview</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Syntax highlighting</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Auto-save functionality</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(0,0,0,0.06)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ p: 4, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                    <CodeIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h5" component="h3" fontWeight={700}>
                    LaTeX-Powered Export
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Create beautifully typeset PDFs with LaTeX quality - without learning LaTeX yourself.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our system handles all the complex typesetting rules, including proper page breaks, widow and orphan control.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Print-ready PDFs</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Professional typography</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Multiple book sizes</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(0,0,0,0.06)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ p: 4, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                    <TocIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h5" component="h3" fontWeight={700}>
                    Table of Contents
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Automatically generate a professional table of contents based on your document structure.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Customize the depth of headings included, add page numbers, and choose from different formatting styles.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Auto-generated from headings</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Customizable depth</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Clickable in digital formats</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(0,0,0,0.06)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ p: 4, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                    <CloudUploadIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h5" component="h3" fontWeight={700}>
                    Import Tools
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Import from Word documents, Google Docs, or Markdown files to get started quickly.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our smart conversion preserves your document structure, headings, lists, and basic formatting.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Word document (.docx) support</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Google Docs integration</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Structure preservation</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(0,0,0,0.06)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ p: 4, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                    <ImportExportIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h5" component="h3" fontWeight={700}>
                    Multiple Export Formats
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Export your book as PDF, EPUB, or other formats, ready for publishing platforms like KDP.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Each format is optimized for its intended use, with PDF outputs perfect for print publishing.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Print-ready PDF</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">EPUB for e-readers</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">KDP-compatible formats</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(0,0,0,0.06)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ p: 4, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                    <BookIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h5" component="h3" fontWeight={700}>
                    Cloud Storage
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Access your book projects from anywhere, with automatic saving.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Your work is securely stored in the cloud, allowing you to switch between devices seamlessly.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Automatic backups</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Cross-device synchronization</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const HowItWorks = () => {
  return (
    <Box
      component="section"
      id="how-it-works"
      sx={{
        py: { xs: 1.2, md: 1.6 },
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
          <Typography
            variant="subtitle1"
            component="p"
            color="primary"
            sx={{
              fontWeight: 600,
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            Simple Process
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 800,
              mb: 2
            }}
          >
            How it Works
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              maxWidth: '700px',
              mx: 'auto',
              mb: 2
            }}
          >
            From manuscript to published book in four simple steps
          </Typography>
        </Box>
        
        {/* Timeline steps for desktop */}
        <Box 
          sx={{ 
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            mt: 12,
            mb: 8
          }}
        >
          {/* Connector line */}
          <Box 
            sx={{ 
              position: 'absolute',
              top: '100px',
              left: '50px',
              right: '50px',
              height: '4px',
              bgcolor: 'rgba(99, 102, 241, 0.15)',
              zIndex: 0
            }}
          />
          
          <Grid container spacing={4} alignItems="flex-start">
            {/* Step 1 */}
            <Grid item xs={12} md={3}>
              <Box 
                sx={{ 
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: '100px',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    border: '4px solid white',
                    boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.3)'
                  }}
                />
                <Card 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      mb: 3, 
                      display: 'flex', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        bgcolor: 'primary.main',
                        mb: 2
                      }}
                    >
                      <CloudUploadIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                  </Box>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      component="span"
                      sx={{ 
                        mr: 1.5,
                        fontSize: '2.5rem', 
                        fontWeight: 800,
                        color: 'primary.main',
                        opacity: 0.3,
                        lineHeight: 1
                      }}
                    >
                      1
                    </Typography>
                    <Typography 
                      variant="h5" 
                      component="h3"
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '1.25rem'
                      }}
                    >
                      Import or Create
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      textAlign: 'center',
                      fontSize: '0.95rem',
                      lineHeight: 1.6
                    }}
                  >
                    Start by importing your existing manuscript or create a new one from scratch using our intuitive markdown editor.
                  </Typography>
                </Card>
              </Box>
            </Grid>
            
            {/* Step 2 */}
            <Grid item xs={12} md={3}>
              <Box 
                sx={{ 
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: '100px',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    border: '4px solid white',
                    boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.3)'
                  }}
                />
                <Card 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      mb: 3, 
                      display: 'flex', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        bgcolor: 'primary.main',
                        mb: 2
                      }}
                    >
                      <EditIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                  </Box>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      component="span"
                      sx={{ 
                        mr: 1.5,
                        fontSize: '2.5rem', 
                        fontWeight: 800,
                        color: 'primary.main',
                        opacity: 0.3,
                        lineHeight: 1
                      }}
                    >
                      2
                    </Typography>
                    <Typography 
                      variant="h5" 
                      component="h3"
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '1.25rem'
                      }}
                    >
                      Edit and Format
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      textAlign: 'center',
                      fontSize: '0.95rem',
                      lineHeight: 1.6
                    }}
                  >
                    Use our intuitive markdown editor to write and format your content with real-time previews as you work.
                  </Typography>
                </Card>
              </Box>
            </Grid>
            
            {/* Step 3 */}
            <Grid item xs={12} md={3}>
              <Box 
                sx={{ 
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: '100px',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    border: '4px solid white',
                    boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.3)'
                  }}
                />
                <Card 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      mb: 3, 
                      display: 'flex', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        bgcolor: 'primary.main',
                        mb: 2
                      }}
                    >
                      <SettingsIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                  </Box>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      component="span"
                      sx={{ 
                        mr: 1.5,
                        fontSize: '2.5rem', 
                        fontWeight: 800,
                        color: 'primary.main',
                        opacity: 0.3,
                        lineHeight: 1
                      }}
                    >
                      3
                    </Typography>
                    <Typography 
                      variant="h5" 
                      component="h3"
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '1.25rem'
                      }}
                    >
                      Preview and Refine
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      textAlign: 'center',
                      fontSize: '0.95rem',
                      lineHeight: 1.6
                    }}
                  >
                    Preview how your book will look when published and make adjustments to layout and structure as needed.
                  </Typography>
                </Card>
              </Box>
            </Grid>
            
            {/* Step 4 */}
            <Grid item xs={12} md={3}>
              <Box 
                sx={{ 
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: '100px',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    border: '4px solid white',
                    boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.3)'
                  }}
                />
                <Card 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      mb: 3, 
                      display: 'flex', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        bgcolor: 'primary.main',
                        mb: 2
                      }}
                    >
                      <ImportExportIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                  </Box>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      component="span"
                      sx={{ 
                        mr: 1.5,
                        fontSize: '2.5rem', 
                        fontWeight: 800,
                        color: 'primary.main',
                        opacity: 0.3,
                        lineHeight: 1
                      }}
                    >
                      4
                    </Typography>
                    <Typography 
                      variant="h5" 
                      component="h3"
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '1.25rem'
                      }}
                    >
                      Export and Publish
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      textAlign: 'center',
                      fontSize: '0.95rem',
                      lineHeight: 1.6
                    }}
                  >
                    Export your book in PDF or EPUB format, ready to upload to platforms like Amazon KDP or IngramSpark.
                  </Typography>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Mobile responsive view - vertical timeline */}
        <Box 
          sx={{ 
            display: { xs: 'block', md: 'none' },
            position: 'relative',
            mt: 6,
            maxWidth: '450px',
            mx: 'auto'
          }}
        >
          {/* Vertical connector line */}
          <Box 
            sx={{ 
              position: 'absolute',
              top: '20px',
              bottom: '20px',
              left: '24px',
              width: '4px',
              bgcolor: 'rgba(99, 102, 241, 0.15)',
              zIndex: 0
            }}
          />
          
          {/* Step 1 - Mobile */}
          <Box sx={{ mb: 5, display: 'flex' }}>
            <Box 
              sx={{ 
                position: 'relative',
                minWidth: '50px',
                height: '50px'
              }}
            >
              <Avatar 
                sx={{ 
                  position: 'absolute',
                  top: '20px',
                  left: 0,
                  width: '50px',
                  height: '50px',
                  bgcolor: 'primary.main',
                  zIndex: 1,
                  border: '4px solid white',
                  boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.3)'
                }}
              >
                <Typography variant="h6" component="span">1</Typography>
              </Avatar>
            </Box>
            <Card 
              elevation={0}
              sx={{ 
                ml: 3,
                p: 3,
                flex: 1,
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <CloudUploadIcon sx={{ color: 'primary.main', mr: 1.5 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
                  Import or Create
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Start by importing your existing manuscript or create a new one from scratch using our intuitive markdown editor.
              </Typography>
            </Card>
          </Box>
          
          {/* Step 2 - Mobile */}
          <Box sx={{ mb: 5, display: 'flex' }}>
            <Box 
              sx={{ 
                position: 'relative',
                minWidth: '50px',
                height: '50px'
              }}
            >
              <Avatar 
                sx={{ 
                  position: 'absolute',
                  top: '20px',
                  left: 0,
                  width: '50px',
                  height: '50px',
                  bgcolor: 'primary.main',
                  zIndex: 1,
                  border: '4px solid white',
                  boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.3)'
                }}
              >
                <Typography variant="h6" component="span">2</Typography>
              </Avatar>
            </Box>
            <Card 
              elevation={0}
              sx={{ 
                ml: 3,
                p: 3,
                flex: 1,
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <EditIcon sx={{ color: 'primary.main', mr: 1.5 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
                  Edit and Format
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Use our intuitive markdown editor to write and format your content with real-time previews as you work.
              </Typography>
            </Card>
          </Box>
          
          {/* Step 3 - Mobile */}
          <Box sx={{ mb: 5, display: 'flex' }}>
            <Box 
              sx={{ 
                position: 'relative',
                minWidth: '50px',
                height: '50px'
              }}
            >
              <Avatar 
                sx={{ 
                  position: 'absolute',
                  top: '20px',
                  left: 0,
                  width: '50px',
                  height: '50px',
                  bgcolor: 'primary.main',
                  zIndex: 1,
                  border: '4px solid white',
                  boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.3)'
                }}
              >
                <Typography variant="h6" component="span">3</Typography>
              </Avatar>
            </Box>
            <Card 
              elevation={0}
              sx={{ 
                ml: 3,
                p: 3,
                flex: 1,
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <SettingsIcon sx={{ color: 'primary.main', mr: 1.5 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
                  Preview and Refine
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Preview how your book will look when published and make adjustments to layout and structure as needed.
              </Typography>
            </Card>
          </Box>
          
          {/* Step 4 - Mobile */}
          <Box sx={{ display: 'flex' }}>
            <Box 
              sx={{ 
                position: 'relative',
                minWidth: '50px',
                height: '50px'
              }}
            >
              <Avatar 
                sx={{ 
                  position: 'absolute',
                  top: '20px',
                  left: 0,
                  width: '50px',
                  height: '50px',
                  bgcolor: 'primary.main',
                  zIndex: 1,
                  border: '4px solid white',
                  boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.3)'
                }}
              >
                <Typography variant="h6" component="span">4</Typography>
              </Avatar>
            </Box>
            <Card 
              elevation={0}
              sx={{ 
                ml: 3,
                p: 3,
                flex: 1,
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <ImportExportIcon sx={{ color: 'primary.main', mr: 1.5 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
                  Export and Publish
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Export your book in PDF or EPUB format, ready to upload to platforms like Amazon KDP or IngramSpark.
              </Typography>
            </Card>
          </Box>
        </Box>
        
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Button 
            href="/register" 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.23)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }
            }}
          >
            Start Publishing Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

const Pricing = ({ handleRegister }) => {
  // Default to annual pricing since we've removed the toggle
  const [pricingPeriod, setPricingPeriod] = React.useState('annual');
  
  // Define pricing data
  const pricingPlans = [
    {
      title: 'Free',
      subtitle: 'Perfect for trying out Publish Jockey before committing.',
      free: true,
      features: [
        { title: '1 book project', included: true },
        { title: 'Export limited to first 10 pages', included: true },
        { title: 'Export to PDF, Word, and EPUB', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Advanced editing tools', included: true },
      ],
      buttonText: 'Register Free',
      buttonVariant: 'outlined'
    },
    {
      title: '✍️ Author Plan',
      subtitle: 'Designed for writers publishing a single book with professional-quality output.',
      oneTime: true,
      price: 79,
      perBookCost: 79,
      booksIncluded: 1,
      noRefunds: true,
      features: [
        { title: '1 book project', included: true },
        { title: 'Advanced markdown editor', included: true },
        { title: 'Full book export to PDF, Word, and EPUB', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Advanced editing tools', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Email support', included: true }
      ],
      buttonText: 'Get Started',
      buttonVariant: 'contained',
      popular: true
    },
    {
      title: 'Starter',
      subtitle: 'Perfect for authors just beginning their publishing journey.',
      price: 299,
      booksIncluded: 5,
      perBookCost: 59.80,
      noRefunds: true,
      features: [
        { title: '5 books included', included: true },
        { title: 'Export to PDF, Word, and EPUB', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Advanced editing tools', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Standard support', included: true }
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outlined'
    },
    {
      title: 'Growth',
      subtitle: 'Designed for active authors with multiple books to publish.',
      price: 499,
      booksIncluded: 10,
      perBookCost: 49.90,
      noRefunds: true,
      features: [
        { title: '10 books included', included: true },
        { title: 'Export to PDF, Word, and EPUB', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Advanced editing tools', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Priority support', included: true },
        { title: 'Enhanced storage capacity', included: true }
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outlined'
    },
    {
      title: 'Professional',
      subtitle: 'For prolific authors and small publishing houses.',
      price: 699,
      booksIncluded: 20,
      perBookCost: 34.95,
      noRefunds: true,
      features: [
        { title: '20 books included', included: true },
        { title: 'Export to PDF, Word, and EPUB', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Advanced editing tools', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Premium support', included: true },
        { title: 'Enhanced storage capacity', included: true },
        { title: 'Bulk formatting tools', included: true }
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outlined'
    },
    {
      title: 'Power Publisher',
      subtitle: 'Ideal for established publishing companies with a large catalog.',
      price: 899,
      booksIncluded: 30,
      perBookCost: 29.97,
      noRefunds: true,
      features: [
        { title: '30 books included', included: true },
        { title: 'Export to PDF, Word, and EPUB', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Advanced editing tools', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'VIP support', included: true },
        { title: 'Maximum storage capacity', included: true },
        { title: 'Bulk formatting tools', included: true },
        { title: 'Advanced customization options', included: true }
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outlined'
    },
    {
      title: 'Custom Plan',
      subtitle: 'For publishers with 30+ books and specialized requirements.',
      customPrice: true,
      noRefunds: true,
      features: [
        { title: '30+ books included', included: true },
        { title: 'Export to PDF, Word, and EPUB', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Advanced editing tools', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Dedicated account manager', included: true },
        { title: 'Custom storage allocation', included: true },
        { title: 'Custom integrations', included: true },
        { title: 'Personalized publishing workflow', included: true }
      ],
      buttonText: 'Contact Us',
      buttonVariant: 'outlined'
    }
  ];
  
  return (
    <Box
      component="section"
      id="pricing"
      sx={{
        py: { xs: 10, md: 14 },
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
          <Typography
            variant="subtitle1"
            component="p"
            color="primary"
            sx={{
              fontWeight: 600,
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            Pricing Plans
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 800,
              mb: 2,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Simple, transparent pricing
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              maxWidth: '700px',
              mx: 'auto',
              mb: 4
            }}
          >
            Choose the plan that works best for your publishing needs
          </Typography>
          
          {/* Monthly/Annual toggle removed as requested */}
        </Box>
        
        {/* Pricing Cards with Carousel */}
        <Box sx={{ position: 'relative' }}>
          {/* Navigation Arrows */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: { xs: 0, sm: -20 },
              transform: 'translateY(-50%)',
              zIndex: 1,
              display: { xs: 'none', md: 'block' }
            }}
          >
            <IconButton
              id="prev-plan"
              aria-label="Previous Plan"
              onClick={() => {
                const container = document.getElementById('pricing-carousel');
                if (container) {
                  container.scrollBy({ left: -320, behavior: 'smooth' });
                }
              }}
              sx={{
                bgcolor: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: 'white',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                }
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: { xs: 0, sm: -20 },
              transform: 'translateY(-50%)',
              zIndex: 1,
              display: { xs: 'none', md: 'block' }
            }}
          >
            <IconButton
              id="next-plan"
              aria-label="Next Plan"
              onClick={() => {
                const container = document.getElementById('pricing-carousel');
                if (container) {
                  container.scrollBy({ left: 320, behavior: 'smooth' });
                }
              }}
              sx={{
                bgcolor: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: 'white',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                }
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
          
          {/* Mobile navigation buttons */}
          <Box 
            sx={{ 
              display: { xs: 'flex', md: 'none' }, 
              justifyContent: 'center',
              gap: 2,
              mb: 4
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIosNewIcon fontSize="small" />}
              onClick={() => {
                const container = document.getElementById('pricing-carousel');
                if (container) {
                  container.scrollBy({ left: -300, behavior: 'smooth' });
                }
              }}
              sx={{ borderRadius: '50px' }}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIosIcon fontSize="small" />}
              onClick={() => {
                const container = document.getElementById('pricing-carousel');
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
              sx={{ borderRadius: '50px' }}
            >
              Next
            </Button>
          </Box>
          
          {/* Carousel Container */}
          <Box
            id="pricing-carousel"
            sx={{
              display: 'flex',
              overflowX: 'auto',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
              '&::-webkit-scrollbar': { // Chrome/Safari/Webkit
                display: 'none'
              },
              px: 2,
              pb: 2,
              scrollSnapType: 'x mandatory',
              gap: 4
            }}
          >
            {pricingPlans.map((plan, index) => (
              <Box 
                key={index}
                sx={{
                  minWidth: { xs: '85%', sm: '350px', md: '330px' },
                  scrollSnapAlign: 'center',
                  flexShrink: 0,
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                  zIndex: plan.popular ? 2 : 1,
                }}
              >
                <Card
                  elevation={plan.popular ? 8 : 1}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'visible',
                    transition: 'all 0.3s ease',
                    border: plan.popular ? '2px solid' : '1px solid',
                    borderColor: plan.popular ? 'primary.main' : 'divider',
                    '&:hover': {
                      transform: 'translateY(-8px)',
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
                  
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {plan.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: '40px' }}>
                      {plan.subtitle}
                    </Typography>
                    
                    {/* Pricing */}
                    <div className="flex items-center justify-center mt-2">
                      {!plan.free && (
                        <span className="text-gray-500 text-2xl mr-1">$</span>
                      )}
                      <span className="text-4xl font-bold">
                        {plan.free ? 'Free' : plan.customPrice ? 'Custom' : plan.price}
                      </span>
                      {plan.oneTime && (
                        <span className="text-sm text-gray-500 ml-2">/one-time</span>
                      )}
                      {!plan.customPrice && !plan.free && !plan.oneTime && (
                        <div className="flex flex-col ml-2">
                          <span className="text-sm text-gray-500">{plan.booksIncluded} {plan.booksIncluded === 1 ? 'book' : 'books'} @ <span className="font-bold">${plan.perBookCost}</span> per book</span>
                        </div>
                      )}
                    </div>
                    
                    {plan.noRefunds && (
                      <Box sx={{ mb: 3, mt: 2 }}>
                        <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                          NO REFUNDS — Try the free plan first
                        </Typography>
                      </Box>
                    )}
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ mb: 4 }}>
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
                              mb: 2,
                              opacity: feature.included ? 1 : 0.5,
                              ml: feature.isSubfeature ? 3 : 0,
                            }}
                          >
                            {feature.included ? (
                              feature.isSubfeature ? null : (
                                <CheckCircleOutlineIcon 
                                  sx={{ 
                                    color: 'primary.main', 
                                    mr: 1.5, 
                                    fontSize: '1.2rem',
                                    mt: 0.2,
                                    flexShrink: 0
                                  }} 
                                />
                              )
                            ) : (
                              <CloseIcon 
                                sx={{ 
                                  color: 'text.disabled', 
                                  mr: 1.5, 
                                  fontSize: '1.2rem',
                                  mt: 0.2,
                                  flexShrink: 0
                                }} 
                              />
                            )}
                            <Typography variant="body2">
                              {feature.title}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    
                    {plan.growthPlans && plan.growthPlans.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                          GROW AS NEEDED:
                        </Typography>
                        <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                          {plan.growthPlans.map((option, idx) => (
                            <Box 
                              component="li" 
                              key={idx} 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mb: 1.5,
                              }}
                            >
                              <Typography variant="body2">{option}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {plan.tagline && (
                      <Box 
                        sx={{ 
                          mt: 3, 
                          p: 2, 
                          borderLeft: '3px solid',
                          borderLeftColor: 'primary.main',
                          bgcolor: 'rgba(99, 102, 241, 0.05)',
                          borderRadius: '0 4px 4px 0'
                        }}
                      >
                        <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: 600 }}>
                          {plan.tagline}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  <Box sx={{ p: 4, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={plan.buttonVariant}
                      color="primary"
                      href={plan.title === 'Custom Plan' ? "/contact" : "/register"}
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
                      {plan.buttonText}
                    </Button>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Carousel Navigation Dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          {pricingPlans.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                mx: 0.5,
                bgcolor: 'primary.main',
                opacity: 0.3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  opacity: 0.7
                }
              }}
              onClick={() => {
                const container = document.getElementById('pricing-carousel');
                if (container) {
                  const itemWidth = container.scrollWidth / pricingPlans.length;
                  container.scrollTo({ 
                    left: itemWidth * index, 
                    behavior: 'smooth' 
                  });
                }
              }}
            />
          ))}
        </Box>
        
        {/* Testimonial mini-section */}
      </Container>
    </Box>
  );
};

const FAQ = () => {
  const [expanded, setExpanded] = React.useState('panel1');
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FAQ data organized by categories
  const faqCategories = [
    {
      category: "Getting Started",
      icon: <AutoStoriesIcon />,
      questions: [
        {
          id: "panel1",
          question: "What makes Publish Jockey different from other publishing tools?",
          answer: "Publish Jockey combines the simplicity of markdown editing with professional LaTeX PDF generation, giving you the best of both worlds—easy authoring with beautiful, print-ready results. Unlike other tools, we focus specifically on book publishing with KDP-compatible outputs."
        },
        {
          id: "panel2",
          question: "Do I need to know LaTeX to use Publish Jockey?",
          answer: "Not at all! That's the beauty of Publish Jockey. You write in simple markdown, and our system handles all the complex LaTeX behind the scenes to generate professional PDFs. No LaTeX knowledge required."
        },
        {
          id: "panel3",
          question: "Can I import my existing manuscript?",
          answer: "Yes! Publish Jockey supports importing from Word documents (.docx), Markdown files, and Google Docs. Our smart conversion maintains your document structure while adapting it to our publishing format."
        },
        {
          id: "word-import",
          question: "What if I've already written my book in Microsoft Word?",
          answer: "No problem—just use <span style='color: #4F46E5;'>SplitDoctor</span> (<strong>available for registered users</strong>). Follow these steps:<br><br><ol style='padding-left: 20px;'><li style='margin-bottom: 12px;'><strong>Upload your Word document</strong> from your <span style='color: #4F46E5;'>desktop</span>.</li><li style='margin-bottom: 12px;'>Ensure your <span style='color: #4F46E5;'>chapters are marked using</span> <strong>Heading 1 (H1)</strong> styles. These are used to split the document into chapters.</li><li style='margin-bottom: 12px;'>Click \"<strong>Process File.</strong>\"</li><li style='margin-bottom: 12px;'>If processing is successful, you'll be able to download a <span style='color: #4F46E5;'>ZIP</span> file containing each chapter in Markdown format.</li><li style='margin-bottom: 12px;'><strong>Unzip the file</strong>, then import each chapter one by one into the app.</li><li style='margin-bottom: 12px;'><strong>Tables are fully supported</strong> and will be converted automatically.</li><li style='margin-bottom: 12px;'><strong>Image placeholders</strong> will be inserted automatically. You'll need to:<ul style='padding-left: 20px; margin-top: 8px;'><li style='margin-bottom: 8px;'>Upload each image manually using the toolbar.</li><li style='margin-bottom: 8px;'>Delete the placeholder once the image is uploaded.</li></ul></li><li style='margin-bottom: 12px;'><strong>Centering and right-aligned content</strong> may not transfer correctly. To fix this:<ul style='padding-left: 20px; margin-top: 8px;'><li style='margin-bottom: 8px;'>Select the content in the app.</li><li style='margin-bottom: 8px;'>Use the toolbar to re-center or right justify it as needed.</li></ul></li></ol>"
        },
        {
          id: "unused-sections",
          question: "Do I need to delete unused sections of my book?",
          answer: "No, there's no need to delete them. However, you're free to delete unused sections, repurpose (rename) existing ones, and add custom sections to fit your book's structure. The application is designed to be flexible—any sections you don't use will simply be ignored in the final output."
        }
      ]
    },
    {
      category: "Publishing & Exporting",
      icon: <ImportExportIcon />,
      questions: [
        {
          id: "panel16",
          question: "How long does it take to generate my professional manuscript?",
          answer: "After you make your final edits in the PublishJockey system, your manuscript is generated almost instantly. PDF files typically take about 15 seconds, while EPUB and Word documents are usually ready in under 2 seconds. Unlike other services, PublishJockey lets you immediately view your polished manuscript—so you know exactly what you're getting before you publish."
        },
        {
          id: "panel15",
          question: "Do you offer real-time previews of my book?",
          answer: "Yes! PublishJockey lets you preview your processed Markdown content in real time—either side-by-side with the editor or in a full standalone preview mode. This allows you to quickly see how your writing flows as you work.<br><br>Please note: certain formatting elements like tables, images, centered text, and right-justified content won't appear exactly as they will in the final export. However, rest assured—they'll display correctly in your finalized PDF, EPUB, or Word document."
        },
        {
          id: "panel4",
          question: "Is Publish Jockey compatible with Kindle Direct Publishing (KDP)?",
          answer: "Absolutely. Our export formats are specifically designed to meet KDP requirements. The PDF export is optimized for print publishing, and our EPUB option works seamlessly with KDP's digital publishing platform."
        },
        {
          id: "panel5",
          question: "What export formats are available?",
          answer: "Publish Jockey supports exporting to PDF (print-ready with proper bleed and trim settings), EPUB (for e-readers), and Microsoft Word (.docx) formats. All exports are optimized for their intended platforms and meet industry standards."
        },
        {
          id: "panel14",
          question: "Are there any limitations when exporting to Microsoft Word?",
          answer: "Yes, there are a few minor limitations to keep in mind:<br><br><ul style='padding-left: 20px;'><li>Images and tables will need to be manually centered.</li><li>An extra title page may appear and should be removed.</li><li>The table of contents won't update automatically—you'll need to refresh it within Word.</li><li>You can customize the heading levels as desired to control what appears in the table of contents.</li></ul><br>Keep in mind that Word export is offered as a convenience. Most publishers primarily require a PDF for print and an EPUB for digital distribution, which are the preferred professional formats."
        },
        {
          id: "panel11",
          question: "What is LaTeX?",
          answer: "LaTeX (pronounced Lay-tech) is a typesetting system commonly used for producing high-quality documents, especially those that include mathematical formulas, tables, and structured formatting. It's widely used in academic publishing, technical writing, and book production because it gives you precise control over layout and typography. In our app, we use LaTeX behind the scenes to ensure your final PDF looks clean, consistent, and professional."
        },
        {
          id: "panel12",
          question: "Why is LaTeX better than Microsoft Word?",
          answer: "LaTeX is better suited for professional publishing because it focuses on content structure and consistency rather than manual formatting. Unlike Microsoft Word, which can become cluttered with styles and layout adjustments, LaTeX separates content from presentation—ensuring cleaner formatting, especially for complex documents like books, academic papers, and technical manuals. It also handles references, tables, and large documents with greater stability and precision.<br><br><table style='width:100%; border-collapse: collapse; margin: 15px 0;'><tr style='background-color: #f5f5f5; font-weight: bold;'><th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Feature</th><th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>LaTeX</th><th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Microsoft Word</th></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Formatting Control</td><td style='border: 1px solid #ddd; padding: 8px;'>High, precise, code-based</td><td style='border: 1px solid #ddd; padding: 8px;'>Manual, WYSIWYG</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Document Structure</td><td style='border: 1px solid #ddd; padding: 8px;'>Structured, content-focused</td><td style='border: 1px solid #ddd; padding: 8px;'>Style-based, can get inconsistent</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Handling Large Documents</td><td style='border: 1px solid #ddd; padding: 8px;'>Excellent</td><td style='border: 1px solid #ddd; padding: 8px;'>Can slow down or crash</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Math & Equations</td><td style='border: 1px solid #ddd; padding: 8px;'>Best-in-class support</td><td style='border: 1px solid #ddd; padding: 8px;'>Limited equation editor</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Version Control</td><td style='border: 1px solid #ddd; padding: 8px;'>Easy with Git (text-based)</td><td style='border: 1px solid #ddd; padding: 8px;'>Difficult with binary formats</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>References & Citations</td><td style='border: 1px solid #ddd; padding: 8px;'>Built-in citation management</td><td style='border: 1px solid #ddd; padding: 8px;'>External tools needed</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Output Quality (PDF)</td><td style='border: 1px solid #ddd; padding: 8px;'>Professional typesetting</td><td style='border: 1px solid #ddd; padding: 8px;'>Depends on formatting</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Learning Curve</td><td style='border: 1px solid #ddd; padding: 8px;'>Steeper (requires some coding)</td><td style='border: 1px solid #ddd; padding: 8px;'>Easy to start, intuitive</td></tr></table>"
        },
        {
          id: "panel8",
          question: "How are images handled when importing documents?",
          answer: "When importing documents (like Word files), image placeholders will be inserted automatically, but you'll need to manually upload each image using the toolbar. This approach ensures proper image formatting and optimal file size management."
        },
        {
          id: "panel9",
          question: "What if my Word document includes tables?",
          answer: "Tables will be automatically converted to Markdown during the import process. However, we recommend keeping tables relatively small to ensure they display well within the limited space available in book layouts."
        },
        {
          id: "panel10",
          question: "What if I need to create tables from scratch?",
          answer: "You can easily create tables by importing a CSV file into the application. It will be automatically converted into a Markdown-formatted table. For best results, keep your tables compact due to the limited real estate in printed books."
        },
        {
          id: "panel13",
          question: "Can I use PublishJockey to publish textbooks or academic materials?",
          answer: "Not at this time. While PublishJockey is great for general book formatting, publishing textbooks—especially those with complex mathematical equations, footnotes, and academic references—requires additional functionality. However, if there is enough demand, we may consider expanding the application to support these features in the future."
        },
        {
          id: "image-caption",
          question: "How can I insert an image without displaying a caption?",
          answer: "To add an image without a visible caption, simply enter a single space in the caption field when uploading or inserting your image. This will ensure that no caption text appears below the image in your exported book."
        },
        {
          id: "image-resize",
          question: "How do I resize an image in my book?",
          answer: "To resize an image, set the scale factor to a value less than 1 (for example, 0.7 to make it 70% of the original size). The default scale is 1, but this may be too large for some books. You can adjust the scale factor at any time—there's no need to re-import your image. We recommend exporting and reviewing your book to ensure images appear as intended, and adjusting the scale as needed for best print results."
        }
      ]
    },
    {
      category: "Account & Security",
      icon: <SettingsIcon />,
      questions: [
        {
          id: "panel6",
          question: "How secure is my manuscript data?",
          answer: "Your manuscript security is our priority. All data is encrypted both in transit and at rest. You maintain complete ownership of your content, and we never share your manuscripts with third parties. The Professional plan also includes additional backup options."
        },
        {
          id: "panel7",
          question: "Can I try before I buy?",
          answer: "Yes! Our Free plan lets you try most of Publish Jockey's core features. You can create one book project and export with a watermark to see the quality of our system before upgrading to a paid plan."
        },
        {
          id: "terms-faq",
          question: "What are the Terms and Agreement?",
          answer: "By creating an account with PublishJockey, you agree to the following terms:<br><br><strong>Usage Rights</strong><br>PublishJockey grants you a limited, non-transferable license to use the platform for the purpose of creating, editing, and exporting manuscripts for personal or commercial use, subject to the terms outlined herein.<br><br><strong>Intellectual Property</strong><br>You retain all rights to the content you create or upload. However, by using the platform, you grant PublishJockey the right to process, display, and temporarily store your content for the sole purpose of providing the publishing service.<br><br><strong>Fair Use Policy</strong><br>The platform is designed to support a fair number of manuscript creations and exports per user, particularly for individual authors or small publishers. Users on free or basic plans are expected to operate within reasonable publishing limits.<br><br>Abuse of the system—such as attempting to bypass plan restrictions by repeatedly editing and republishing the same project to create multiple unique books—may result in limitations, account suspension, or removal from the platform.<br><br>We reserve the right to implement automatic and manual safeguards to protect the integrity of our service.<br><br><strong>Account Responsibility</strong><br>You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. If you suspect unauthorized access, you must notify us immediately.<br><br><strong>Service Changes and Availability</strong><br>We reserve the right to modify, pause, or discontinue any part of the platform with or without notice. We will do our best to notify users in advance of any major changes that affect core functionality.<br><br><strong>Data Storage and Privacy</strong><br>We do not store your complete manuscript files. Only your original Markdown input and any uploaded images are retained while your account is active. You may request account deletion and data removal at any time.<br><br><strong>Agreement to Terms</strong><br>By registering or creating an account, you acknowledge that you have read, understood, and agree to be bound by these terms."
        }
      ]
    }
  ];

  // Filter questions based on search term
  const filteredFaqs = searchTerm 
    ? faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqCategories;

  return (
    <Box 
      component="section" 
      id="faq" 
      sx={{ 
        py: { xs: 1, md: 1.4 },
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="subtitle1"
            component="p"
            color="primary"
            sx={{
              fontWeight: 600,
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            Questions & Answers
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 800,
              mb: 2,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            Everything you need to know about Publish Jockey
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box
          sx={{
            maxWidth: '600px',
            mx: 'auto',
            mb: 6,
            px: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'white',
              borderRadius: '50px',
              border: '1px solid',
              borderColor: 'divider',
              px: 3,
              py: 1.5,
              boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
            }}
          >
            <Box
              component="input"
              placeholder="Search the FAQs..."
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              sx={{
                border: 'none',
                width: '100%',
                outline: 'none',
                fontSize: '1rem',
                bgcolor: 'transparent'
              }}
            />
            <SearchIcon sx={{ color: 'text.secondary', ml: 1 }} />
          </Box>
        </Box>

        <Box sx={{ maxWidth: '800px', mx: 'auto', px: { xs: 2, md: 0 } }}>
          {filteredFaqs.map((category, categoryIndex) => (
            <Box key={categoryIndex} sx={{ mb: 6 }}>
              {/* Category Header */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 3
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 36,
                    height: 36,
                    mr: 2
                  }}
                >
                  {category.icon}
                </Avatar>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', md: '1.5rem' }
                  }}
                >
                  {category.category}
                </Typography>
              </Box>
              
              {/* Questions in Category */}
              {category.questions.map((faq, index) => (
                <Accordion
                  key={faq.id}
                  expanded={expanded === faq.id}
                  onChange={handleChange(faq.id)}
                  disableGutters
                  elevation={0}
                  sx={{
                    mb: 2,
                    border: '1px solid',
                    borderColor: expanded === faq.id ? 'primary.main' : 'divider',
                    borderRadius: '16px !important',
                    overflow: 'hidden',
                    position: 'relative',
                    '&:before': {
                      display: 'none'
                    },
                    transition: 'all 0.3s ease',
                    boxShadow: expanded === faq.id 
                      ? '0 8px 25px rgba(0,0,0,0.1)' 
                      : '0 2px 10px rgba(0,0,0,0.05)',
                    '&:hover': {
                      borderColor: expanded === faq.id ? 'primary.main' : 'primary.light',
                      boxShadow: expanded === faq.id 
                        ? '0 10px 30px rgba(0,0,0,0.15)' 
                        : '0 5px 15px rgba(0,0,0,0.08)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon 
                        sx={{
                          transition: 'transform 0.3s ease',
                          transform: expanded === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          color: expanded === faq.id ? 'primary.main' : 'text.secondary'
                        }} 
                      />
                    }
                    aria-controls={`${faq.id}-content`}
                    id={`${faq.id}-header`}
                    sx={{
                      px: 3,
                      py: 2,
                      bgcolor: expanded === faq.id ? 'rgba(99, 102, 241, 0.04)' : 'transparent',
                      '& .MuiAccordionSummary-content': {
                        m: 0
                      },
                      '&:hover': {
                        bgcolor: expanded === faq.id 
                          ? 'rgba(99, 102, 241, 0.06)'
                          : 'rgba(0, 0, 0, 0.02)'
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: expanded === faq.id ? 700 : 600,
                        color: expanded === faq.id ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      px: 3,
                      py: 3,
                      borderTop: '1px solid',
                      borderTopColor: 'divider',
                      bgcolor: 'white'
                    }}
                  >
                    <Typography 
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.7,
                        fontSize: '1rem'
                      }}
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                    
                    {/* Feedback Section */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'flex-end',
                        mt: 3,
                        borderTop: '1px solid',
                        borderTopColor: 'divider',
                        pt: 2
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          mr: 2,
                          fontSize: '0.85rem'
                        }}
                      >
                        Was this helpful?
                      </Typography>
                      <Button 
                        size="small" 
                        startIcon={<ThumbUpIcon sx={{ fontSize: '1rem' }} />}
                        sx={{ 
                          minWidth: 0, 
                          p: 1, 
                          mr: 1,
                          color: 'text.secondary',
                          '&:hover': { 
                            color: 'success.main',
                            bgcolor: 'rgba(84, 214, 44, 0.08)'
                          }
                        }}
                      >
                        Yes
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<ThumbDownIcon sx={{ fontSize: '1rem' }} />}
                        sx={{ 
                          minWidth: 0,
                          p: 1,
                          color: 'text.secondary',
                          '&:hover': { 
                            color: 'error.main',
                            bgcolor: 'rgba(255, 72, 66, 0.08)'
                          }
                        }}
                      >
                        No
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))}
        </Box>
        
        {/* Contact Section */}
        <Box
          sx={{
            textAlign: 'center',
            mt: 8,
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            bgcolor: 'white',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            maxWidth: '700px',
            mx: 'auto'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Can't find the answer you're looking for?
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 4 }}>
            Our support team is ready to help you with any questions or concerns.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<EmailIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.23)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }
            }}
          >
            Contact Support
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

const imageUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // Always save to uploads/admin/test for now
      const dir = path.join(__dirname, 'uploads', 'admin', 'test');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      // Use timestamp + original name for uniqueness
      const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
      cb(null, uniqueName);
    }
  })
});

export default PublishJockeyLanding; 