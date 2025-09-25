import React from 'react'; // Yancy D. Dennis
import { sanitizeHtml } from './utils/sanitizeHtml';
import { Button, Container, Typography, Box, Grid, Card, CardContent, Avatar, Divider, Accordion, AccordionSummary, AccordionDetails, AppBar, IconButton, Menu, MenuItem } from '@mui/material';
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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CopyrightIcon from '@mui/icons-material/Copyright';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import SecurityIcon from '@mui/icons-material/Security';
import PublicIcon from '@mui/icons-material/Public';
import PreviewIcon from '@mui/icons-material/Preview';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
// Import logo
import PublishJockeyLogo from './publishjockey_logo.png';
import Testimonials from './components/Testimonials';
import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LAUNCH_OFFER_CONFIG, isLaunchOfferActive } from './config/launchOffer';
import LaunchOfferCountdown from './components/LaunchOfferCountdown';



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
      paddingBottom: '0' // Changed from 70px to 0
    }}>
      <LandingHeader openTerms={handleOpenTerms} />
      
      {/* Hero Section */}
      <Hero handleRegister={handleRegister} />
      
      {/* Book Showcase */}
      <BookShowcase />
      
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

// Ticker removed for cleaner homepage design

const LandingHeader = ({ openTerms }) => {
  const { currentUser, logout } = useAuth();

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
              {currentUser ? (
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
                    <MenuItem onClick={() => { handleProductMenuClose(); window.location.href = '/pricing'; }}>
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
                    href="/pricing"
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
                href="/#testimonials"
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
                                     <Button 
                     href="/affiliate-signup"
                     sx={{ 
                       color: 'text.primary',
                       textTransform: 'none',
                       fontWeight: 600
                     }}
                   >
                     Affiliate Program
                   </Button>
                  {currentUser && (
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
              {currentUser ? (
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
                      {(currentUser?.name || currentUser?.email || 'A').charAt(0).toUpperCase()}
                    </Avatar>
                    <span style={{ fontWeight: 500, fontSize: 14, marginLeft: 8, color: '#222', whiteSpace: 'nowrap' }}>
                      {currentUser?.name || currentUser?.email || 'Account'}
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
  // Use launch offer if active
  const launchOfferActive = isLaunchOfferActive();
  
  return (
    <Box
      id="hero"
      sx={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 4, md: 6 },
        pb: { xs: 6, md: 8 },
        minHeight: '70vh'
      }}
    >
      {/* Subtle pattern overlay */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)
          `,
          zIndex: 0
        }}
      />

      
      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              {/* Main heading - tighter spacing */}
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '3.2rem' }, 
                  fontWeight: 700,
                  lineHeight: 1.1,
                  mb: 1.5,
                  color: 'white',
                  maxWidth: '500px'
                }}
              >
                Publish Bookstore-Quality Books in Minutes.
              </Typography>

              {/* Subtitle - tighter spacing */}
              <Typography 
                variant="body1" 
                component="p" 
                sx={{ 
                  fontSize: { xs: '1rem', md: '1.1rem' }, 
                  fontWeight: 400, 
                  opacity: 0.9, 
                  mb: 1.2,
                  lineHeight: 1.4,
                  maxWidth: '450px'
                }}
              >
                From manuscript to polished, print-ready in minutes—no formatting headaches.
              </Typography>

              {/* Registration info - more prominent */}
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '0.9rem', md: '0.95rem' },
                  fontWeight: 600,
                  color: '#d32f2f', // Red color for attention
                  display: 'block',
                  mt: 1.5,
                  mb: 1.5,
                  maxWidth: '450px'
                }}
              >
                Registered Users print 12 pages FREE!
              </Typography>

              {/* Feature highlight - tighter spacing */}
              <Typography 
                variant="body2" 
                component="p" 
                sx={{ 
                  fontSize: { xs: '0.9rem', md: '1rem' }, 
                  fontWeight: 500, 
                  opacity: 0.8, 
                  mb: 0.5,
                  lineHeight: 1.3,
                  maxWidth: '450px'
                }}
              >
                <strong>Instant Preview</strong> • PDF 26.7s • EPUB 5s • DOCX 5s¹
              </Typography>

              {/* Speed verification footnote - much closer to speed metrics */}
              <Typography 
                variant="caption" 
                component="p" 
                sx={{ 
                  fontSize: { xs: '0.75rem', md: '0.8rem' }, 
                  fontWeight: 400, 
                  opacity: 0.6, 
                  mb: 1.5,
                  lineHeight: 1.2,
                  maxWidth: '450px'
                }}
              >
                ¹ Speed verified on a 60,733-word book (server benchmark). Exports auto-delete after 15 minutes.
              </Typography>

              {/* New features line - Word transformation process */}
              <Typography 
                variant="body2" 
                component="p" 
                sx={{ 
                  fontSize: { xs: '0.9rem', md: '1rem' }, 
                  fontWeight: 500, 
                  opacity: 0.8, 
                  mb: 1.2,
                  lineHeight: 1.3,
                  maxWidth: '450px'
                }}
              >
                <strong>Word/Google Docs/Markdown → Book</strong> (auto-split) • Images • Tables • Built-in Editor
              </Typography>

              {/* Language support - tighter spacing */}
              <Typography 
                variant="body2" 
                component="p" 
                sx={{ 
                  fontSize: { xs: '0.9rem', md: '1rem' }, 
                  fontWeight: 500, 
                  opacity: 0.8, 
                  mb: 2.5,
                  lineHeight: 1.3,
                  maxWidth: '450px'
                }}
              >
                Publish in <strong>80+ languages</strong> • Publisher-grade typesetting
              </Typography>

              {/* CTA Buttons */}
              <Box sx={{ display: 'flex', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap', mb: 2 }}>
                <Button 
                  href="/register" 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: '#2563eb', 
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '8px',
                    px: 3,
                    py: 1.2,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                    '&:hover': {
                      bgcolor: '#1d4ed8',
                      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.6)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  Publish Now!
                </Button>
                <Button 
                  href="#how-it-works" 
                  variant="outlined"
                  size="large"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.6)', 
                    color: 'white',
                    fontWeight: 500,
                    borderRadius: '8px',
                    px: 3,
                    py: 1.2,
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  See How It Works
                </Button>
              </Box>

            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Professional book cover - smaller size */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}>
              {/* Book cover with 3D effect - showing page edges (better proportions) */}
              <Box sx={{
                width: '220px',
                height: '250px',
                position: 'relative',
                transform: 'perspective(1200px) rotateY(-15deg) rotateX(5deg)',
                transformOrigin: 'center center',
                mb: 3,
                '&:hover': {
                  transform: 'perspective(1200px) rotateY(-10deg) rotateX(2deg)',
                  transition: 'all 0.4s ease'
                }
              }}>
                {/* Page layer 1 - deepest (thicker) */}
                <Box sx={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  width: '100%',
                  height: '100%',
                  bgcolor: '#F0EBE0',
                  borderRadius: '6px',
                  zIndex: -6,
                  border: '1px solid #DDD4C4',
                  boxShadow: '3px 3px 10px rgba(0,0,0,0.15)'
                }} />
                
                {/* Page layer 2 */}
                <Box sx={{
                  position: 'absolute',
                  top: '9px',
                  left: '9px',
                  width: '100%',
                  height: '100%',
                  bgcolor: '#F3EEE3',
                  borderRadius: '6px',
                  zIndex: -5,
                  border: '1px solid #DFD6C6',
                  boxShadow: '3px 3px 10px rgba(0,0,0,0.15)'
                }} />
                
                {/* Page layer 3 */}
                <Box sx={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  width: '100%',
                  height: '100%',
                  bgcolor: '#F6F1E6',
                  borderRadius: '6px',
                  zIndex: -4,
                  border: '1px solid #E1D8C8',
                  boxShadow: '3px 3px 10px rgba(0,0,0,0.15)'
                }} />
                
                {/* Page layer 4 */}
                <Box sx={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  width: '100%',
                  height: '100%',
                  bgcolor: '#F8F4E9',
                  borderRadius: '6px',
                  zIndex: -3,
                  border: '1px solid #E3DACA',
                  boxShadow: '3px 3px 10px rgba(0,0,0,0.15)'
                }} />
                
                {/* Page layer 5 */}
                <Box sx={{
                  position: 'absolute',
                  top: '2px',
                  left: '2px',
                  width: '100%',
                  height: '100%',
                  bgcolor: '#FAF6EB',
                  borderRadius: '6px',
                  zIndex: -2,
                  border: '1px solid #E5DCCC',
                  boxShadow: '3px 3px 10px rgba(0,0,0,0.15)'
                }} />
                
                {/* Page edge lines on left side */}
                <Box sx={{
                  position: 'absolute',
                  left: '3px',
                  top: '3px',
                  bottom: '3px',
                  width: '1px',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 100%)',
                  zIndex: -1
                }} />
                <Box sx={{
                  position: 'absolute',
                  left: '5px',
                  top: '5px',
                  bottom: '5px',
                  width: '1px',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.08) 100%)',
                  zIndex: -1
                }} />
                <Box sx={{
                  position: 'absolute',
                  left: '7px',
                  top: '7px',
                  bottom: '7px',
                  width: '1px',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.03) 50%, rgba(0,0,0,0.06) 100%)',
                  zIndex: -1
                }} />
                <Box sx={{
                  position: 'absolute',
                  left: '9px',
                  top: '9px',
                  bottom: '9px',
                  width: '1px',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.04) 100%)',
                  zIndex: -1
                }} />
                
                {/* Bottom wedge shadow for grounding */}
                <Box sx={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: '5px',
                  right: '5px',
                  height: '8px',
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 100%)',
                  borderRadius: '0 0 8px 8px',
                  filter: 'blur(3px)',
                  zIndex: -8
                }} />
                
                {/* Main book shadow */}
                <Box sx={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  width: '100%',
                  height: '100%',
                  bgcolor: 'rgba(0,0,0,0.4)',
                  borderRadius: '6px',
                  filter: 'blur(15px)',
                  zIndex: -10
                }} />
                
                {/* Main book cover - enhanced realism with finishing touches */}
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `
                    linear-gradient(135deg, #FDFBF6 0%, #F8F4E8 30%, #F2EBDD 100%),
                    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6) 0%, transparent 40%),
                    radial-gradient(circle at 80% 80%, rgba(0,0,0,0.03) 0%, transparent 50%),
                    radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)
                  `,
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 2.5,
                  boxShadow: `
                    rgba(16, 24, 40, 0.35) 0px 16px 32px,
                    rgba(16, 24, 40, 0.15) 0px 4px 16px,
                    inset 0 1px 0 rgba(255,255,255,0.4),
                    inset 0 -2px 0 rgba(0,0,0,0.08),
                    inset 0 2px 4px rgba(0,0,0,0.06)
                  `,
                  border: '1px solid #E8E0CC',
                  position: 'relative',
                  zIndex: 10,
                  color: '#1F2937',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: `
                      linear-gradient(180deg, #D4C5A9 0%, #C4B59D 50%, #B8A88C 100%),
                      linear-gradient(90deg, rgba(255,255,255,0.3) 0%, transparent 50%)
                    `,
                    borderRadius: '8px 0 0 8px',
                    zIndex: 15,
                    boxShadow: `
                      inset -2px 0 4px rgba(0,0,0,0.2),
                      inset 1px 0 0 rgba(255,255,255,0.4)
                    `
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '12px',
                    left: '20px',
                    right: '12px',
                    bottom: '12px',
                    border: '1px solid rgba(31, 41, 55, 0.08)',
                    borderRadius: '4px',
                    pointerEvents: 'none',
                    zIndex: 12
                  }
                }}>
                  {/* Book title - enhanced typography */}
                  <Typography sx={{ 
                    fontSize: '24px', 
                    fontWeight: 700, 
                    textAlign: 'center',
                    mb: 2,
                    lineHeight: 1.1,
                    color: '#1F2937',
                    letterSpacing: '-0.5px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    fontFamily: '"Georgia", "Times New Roman", serif'
                  }}>
                    Your Book
                  </Typography>
                  
                  {/* Decorative line - more elegant */}
                  <Box sx={{ 
                    width: '80px', 
                    height: '1px', 
                    background: 'linear-gradient(90deg, transparent 0%, #1F2937 20%, #1F2937 80%, transparent 100%)', 
                    opacity: 0.4,
                    mb: 2
                  }} />
                  
                  {/* Author - refined styling */}
                  <Typography sx={{ 
                    fontSize: '16px', 
                    fontWeight: 400,
                    color: '#1F2937',
                    opacity: 0.7,
                    fontStyle: 'italic',
                    letterSpacing: '0.5px',
                    fontFamily: '"Georgia", "Times New Roman", serif'
                  }}>
                    Author
                  </Typography>

                  {/* Format badges */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: 0.5
                  }}>
                    <Box sx={{
                      bgcolor: '#ef4444',
                      color: 'white',
                      fontSize: '8px',
                      px: 0.8,
                      py: 0.4,
                      borderRadius: '3px',
                      fontWeight: 600
                    }}>
                      PDF
                    </Box>
                    <Box sx={{
                      bgcolor: '#8b5cf6',
                      color: 'white',
                      fontSize: '8px',
                      px: 0.8,
                      py: 0.4,
                      borderRadius: '3px',
                      fontWeight: 600
                    }}>
                      EPUB
                    </Box>
                    <Box sx={{
                      bgcolor: '#0ea5e9',
                      color: 'white',
                      fontSize: '8px',
                      px: 0.8,
                      py: 0.4,
                      borderRadius: '3px',
                      fontWeight: 600
                    }}>
                      DOCX
                    </Box>
                  </Box>
                </Box>

                {/* Book spine */}
                <Box sx={{
                  position: 'absolute',
                  left: '-5px',
                  top: '0',
                  width: '5px',
                  height: '100%',
                  bgcolor: '#1e293b',
                  borderRadius: '2px 0 0 2px',
                  zIndex: 0
                }} />

                {/* Premium gold ribbon callout - refined styling */}
                <Box sx={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-15px',
                  background: 'linear-gradient(135deg, #E6B800 0%, #CC9900 50%, #B8860B 100%)',
                  borderRadius: '6px',
                  px: { xs: 1.5, md: 2.5 },
                  py: { xs: 0.8, md: 1.2 },
                  border: '1px solid #996600',
                  zIndex: 10,
                  transform: { xs: 'rotate(6deg)', md: 'rotate(7deg)' },
                  height: { xs: '32px', md: '38px' },
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: `
                    0 3px 12px rgba(0,0,0,0.25),
                    0 1px 4px rgba(0,0,0,0.15),
                    inset 0 1px 0 rgba(255,255,255,0.4),
                    inset 0 -1px 0 rgba(0,0,0,0.1)
                  `,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)',
                    borderRadius: '6px 6px 0 0'
                  }
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '0.7rem', md: '0.8rem' },
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      color: '#FFFFFF',
                      textShadow: '0 1px 3px rgba(0,0,0,0.4), 0 0 1px rgba(0,0,0,0.3)',
                      letterSpacing: '0.2px',
                      lineHeight: 1
                    }}
                  >
                    PublishJockey — In a League of Its Own
                  </Typography>
                </Box>
              </Box>

              {/* Language indicators - static per page load */}
              <Box sx={{
                position: 'absolute',
                right: '5px',
                top: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5
              }}>
                {(() => {
                  // All your working languages (excluding English)
                  const otherLanguages = [
                    'French', 'German', 'Spanish', 'Portuguese', 'Italian', 'Russian', 
                    'Polish', 'Dutch', 'Swedish', 'Hindi', 'Bengali', 'Tamil', 
                    'Ukrainian', 'Nepali', 'Swahili', 'Hausa', 'Yoruba', 'Zulu', 
                    'Malagasy', 'Czech', 'Finnish', 'Norwegian', 'Romanian', 'Croatian'
                  ];
                  
                  // Randomly select 5 languages for this page load
                  const shuffled = [...otherLanguages];
                  for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                  }
                  const selectedLanguages = shuffled.slice(0, 5);
                  
                  // Always show English first, then 5 random languages, then "+75 more"
                  const displayItems = ['English', ...selectedLanguages, '+75 more'];
                  
                  return displayItems.map((lang, index) => (
                    <Box 
                      key={`${lang}-${index}`}
                      sx={{
                        bgcolor: lang === '+50 more' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.95)',
                        color: '#1e3a8a',
                        fontSize: lang === '+50 more' ? '9px' : '10px',
                        fontWeight: lang === 'English' ? 700 : 600,
                        px: 1.5,
                        py: 0.8,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        position: 'absolute',
                        top: `${index * 35}px`,
                        whiteSpace: 'nowrap',
                        minWidth: '60px',
                        ...(lang === 'English' && {
                          border: '1px solid rgba(30, 58, 138, 0.3)',
                          boxShadow: '0 4px 16px rgba(30, 58, 138, 0.3)'
                        })
                      }}
                    >
                      {lang}
                    </Box>
                  ));
                })()}
              </Box>

              {/* Bottom stats directly under the book */}
              <Box sx={{ 
                bgcolor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                py: 2,
                px: 3,
                mt: 1
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 2
                }}>
                  <Typography sx={{ 
                    fontWeight: 600, 
                    color: 'white',
                    fontSize: '0.9rem'
                  }}>
                    Minutes not Weeks
                  </Typography>
                  <Typography sx={{ 
                    fontWeight: 600, 
                    color: 'white',
                    fontSize: '0.9rem'
                  }}>
                    Professional Quality
                  </Typography>
                  <Typography sx={{ 
                    fontWeight: 600, 
                    color: 'white',
                    fontSize: '0.9rem'
                  }}>
                    {launchOfferActive ? 'Starting at $31' : 'Starting at $46'}
                  </Typography>
                </Box>

                {/* Unlimited features - new line below stats */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  py: 1.5,
                  px: 2,
                  mt: 1
                }}>
                  <Typography sx={{ 
                    color: 'white', 
                    fontWeight: 600, 
                    fontSize: '0.85rem',
                    textAlign: 'center'
                  }}>
                    <strong>Unlimited Revisions</strong> • <strong>Unlimited Exports</strong>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const BookShowcase = () => {
  return (
    <Box sx={{ 
      py: { xs: 8, md: 10 }, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <Box 
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          top: '-200px',
          right: '-100px',
          zIndex: 0
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 800,
              mb: 2,
              color: 'white'
            }}
          >
            See PublishJockey in Action
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'white',
              opacity: 0.85,
              mb: 2,
              fontWeight: 500,
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
            Formatted 100% using PublishJockey — no designers, no extra tools.
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4
        }}>
          {/* Book Cover */}
          <Box sx={{ 
            position: 'relative',
            transform: 'rotate(-5deg)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'rotate(-2deg) scale(1.05)'
            }
          }}>
            <Box sx={{ 
              width: { xs: '166px', md: '233px' }, // 1:1.5 aspect ratio (e.g., 233x350)
              height: { xs: '250px', md: '350px' },
              borderRadius: '8px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              position: 'relative',
              background: 'white',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '10px',
                left: '10px',
                right: '10px',
                bottom: '10px',
                border: '2px solid rgba(0,0,0,0.1)',
                borderRadius: '4px',
                zIndex: 1
              }
            }}>
              <img 
                src="/images/demo/vanquish_KDP_1751687866247.jpg"
                alt="Vanquish - Book published with PublishJockey"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  display: 'block',
                  imageRendering: 'auto',
                  background: 'white'
                }}
                onError={(e) => {
                  console.log('Vanquish image failed to load, using fallback');
                  e.target.style.display = 'none';
                  // Create a fallback placeholder
                  const fallback = document.createElement('div');
                  fallback.style.cssText = `
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-family: 'Arial', sans-serif;
                    font-size: 14px;
                    text-align: center;
                    padding: 20px;
                    box-sizing: border-box;
                  `;
                  fallback.textContent = 'Book Cover Demo Image';
                  e.target.parentNode.appendChild(fallback);
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  textAlign: 'center',
                  fontStyle: 'italic',
                  color: 'rgba(0,0,0,0.55)',
                  mt: 1,
                  fontSize: '0.95rem'
                }}
              >
                Free Cover Created using ChatGPT & Upscale Tool on this site
              </Typography>
            </Box>
          </Box>

          {/* Book Details */}
          <Box sx={{ 
            maxWidth: '500px',
            color: 'white'
          }}>
            <Typography 
              variant="h4" 
              component="h3" 
              sx={{ 
                fontWeight: 700,
                mb: 2
              }}
            >
              Published on Amazon
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                opacity: 0.9,
                lineHeight: 1.6
              }}
            >
              This book was formatted and published using PublishJockey. See how our platform transforms your manuscript into a professional, print-ready book that meets Amazon's strict formatting requirements.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                What this book demonstrates:
              </Typography>
              <Box component="ul" sx={{ pl: 2, opacity: 0.9 }}>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  Professional typesetting and layout
                </Typography>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  Proper margins and spacing for print
                </Typography>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  Clean, readable typography
                </Typography>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  KDP-ready formatting standards
                </Typography>
              </Box>
            </Box>

            <Button 
              href="https://tinyurl.com/2pxyaucz"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: 'white',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s'
                }
              }}
            >
              View PDF and EPUB Sample on Amazon
            </Button>
          </Box>
        </Box>
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
                    Professional Typesetting
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Create beautifully typeset PDFs with publisher-quality formatting - no technical knowledge required.
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
  // Use launch offer if active
  const launchOfferActive = isLaunchOfferActive();

  // Define pricing data
  let pricingPlans = [
    {
      title: 'Free',
      subtitle: 'Perfect for trying out Publish Jockey before committing.',
      free: true,
      features: [
        { title: '1 book project', included: true },
        { title: 'Export limited to first 12 pages', included: true },
        { title: 'Export to PDF, Word, and EPUB', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Advanced editing tools', included: true },
      ],
      buttonText: 'Register Free',
      buttonVariant: 'outlined'
    }
  ];

  if (launchOfferActive) {
    // Add all launch offer plans
    Object.entries(LAUNCH_OFFER_CONFIG.pricing).forEach(([key, plan]) => {
      pricingPlans.push({
        ...plan,
        price: plan.price,
        originalPrice: plan.originalPrice,
        launchOffer: true
      });
    });
  } else {
    // Fallback to regular plans - show most popular first
    const regularPlans = [
      {
        title: '✍️ Single Book',
        subtitle: 'Perfect for authors publishing their first book with professional-quality output.',
        oneTime: true,
        price: 93,
        perBookCost: 93,
        booksIncluded: 1,
        noRefunds: true,
        features: [
          { title: '1 book project', included: true },
          { title: 'Advanced markdown editor', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Email support', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '10 images included', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get Started',
        buttonVariant: 'contained',
        popular: true
      },
      {
        title: '5 Book Pack',
        subtitle: 'Great value for multiple books (3-year validity).',
        oneTime: true,
        price: 349,
        perBookCost: 70,
        booksIncluded: 5,
        noRefunds: true,
        features: [
          { title: '5 book projects', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Email support', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '50 images included', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get 5 Books',
        buttonVariant: 'outlined'
      },
      {
        title: '10 Book Pack',
        subtitle: 'Publish up to 10 books (3-year validity).',
        oneTime: true,
        price: 599,
        perBookCost: 60,
        booksIncluded: 10,
        noRefunds: true,
        features: [
          { title: '10 book projects', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Email support', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '100 images included', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get 10 Books',
        buttonVariant: 'outlined'
      },
      {
        title: '20 Book Pack',
        subtitle: 'Publish up to 20 books (3-year validity).',
        oneTime: true,
        price: 999,
        perBookCost: 50,
        booksIncluded: 20,
        noRefunds: true,
        features: [
          { title: '20 book projects', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Email support', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '200 images included', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get 20 Books',
        buttonVariant: 'outlined'
      }
    ];

    // Add ebook plans
    const ebookPlans = [
      {
        title: '📖 Ebook Single',
        subtitle: 'Ebook-focused plan with 50-page limit (3-year validity).',
        oneTime: true,
        price: 46,
        perBookCost: 46,
        booksIncluded: 1,
        noRefunds: true,
        features: [
          { title: '1 book project', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Email support', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '11 images included', included: true },
          { title: '50-page limit', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get Ebook Single',
        buttonVariant: 'outlined'
      },
      {
        title: '📖 Ebook 5 Pack',
        subtitle: 'Ebook-focused plan for multiple books (3-year validity).',
        oneTime: true,
        price: 174,
        perBookCost: 35,
        booksIncluded: 5,
        noRefunds: true,
        features: [
          { title: '5 book projects', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Email support', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '55 images included', included: true },
          { title: '50-page limit', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get Ebook 5 Pack',
        buttonVariant: 'outlined'
      },
      {
        title: '📖 Ebook 10 Pack',
        subtitle: 'Ebook-focused plan for serious authors (3-year validity).',
        oneTime: true,
        price: 299,
        perBookCost: 30,
        booksIncluded: 10,
        noRefunds: true,
        features: [
          { title: '10 book projects', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Email support', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '110 images included', included: true },
          { title: '50-page limit', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get Ebook 10 Pack',
        buttonVariant: 'outlined'
      },
      {
        title: '📖 Ebook 20 Pack',
        subtitle: 'Ebook-focused plan for prolific authors (3-year validity).',
        oneTime: true,
        price: 499,
        perBookCost: 25,
        booksIncluded: 20,
        noRefunds: true,
        features: [
          { title: '20 book projects', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Email support', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '220 images included', included: true },
          { title: '50-page limit', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get Ebook 20 Pack',
        buttonVariant: 'outlined'
      }
    ];

    // Add premium plans
    const premiumPlans = [
      {
        title: 'Power User',
        subtitle: 'For prolific authors (1-year validity).',
        oneTime: true,
        price: 2250,
        perBookCost: 45,
        booksIncluded: 50,
        noRefunds: true,
        features: [
          { title: '50 book projects', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Priority support', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '500 images included', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get Power User',
        buttonVariant: 'outlined'
      },
      {
        title: 'Agency',
        subtitle: 'For publishing agencies (1-year validity).',
        oneTime: true,
        price: 3500,
        perBookCost: 35,
        booksIncluded: 100,
        noRefunds: true,
        features: [
          { title: '100 book projects', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Priority support', included: true },
          { title: 'Dedicated account manager', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '1000 images included', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get Agency',
        buttonVariant: 'outlined'
      }
    ];

    // Add ebook premium plans
    const ebookPremiumPlans = [
      {
        title: '📖 Ebook Power User',
        subtitle: 'Ebook-focused plan for prolific authors (1-year validity).',
        oneTime: true,
        price: 1125,
        perBookCost: 23,
        booksIncluded: 50,
        noRefunds: true,
        features: [
          { title: '50 book projects', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Priority support', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '550 images included', included: true },
          { title: '50-page limit', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get Ebook Power User',
        buttonVariant: 'outlined'
      },
      {
        title: '📖 Ebook Agency',
        subtitle: 'Ebook-focused plan for publishing agencies (1-year validity).',
        oneTime: true,
        price: 1750,
        perBookCost: 18,
        booksIncluded: 100,
        noRefunds: true,
        features: [
          { title: '100 book projects', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Priority support', included: true },
          { title: 'Dedicated account manager', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '1100 images included', included: true },
          { title: '50-page limit', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get Ebook Agency',
        buttonVariant: 'outlined'
      }
    ];

    // Add full-service plans
    const fullServicePlans = [
      {
        title: '🎨 Full Service',
        subtitle: 'Complete publishing package with custom cover designs (Final PDF and eBook delivery within 72 hours of cover approval).',
        oneTime: true,
        price: 499,
        perBookCost: 499,
        booksIncluded: 1,
        noRefunds: true,
        features: [
          { title: '1 book project', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Email support', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '11 images included', included: true },
          { title: '3 custom cover designs', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get Full Service',
        buttonVariant: 'outlined'
      },
      {
        title: '🎨 Full Service Plus',
        subtitle: 'Complete package with custom covers and KDP setup guidance (Final PDF and eBook delivery within 72 hours of cover approval).',
        oneTime: true,
        price: 599,
        perBookCost: 599,
        booksIncluded: 1,
        noRefunds: true,
        features: [
          { title: '1 book project', included: true },
          { title: 'Full book export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Email support', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '11 images included', included: true },
          { title: '3 custom cover designs', included: true },
          { title: '30-minute guided KDP Amazon setup session', included: true },
          { title: '$100 value: Upscaled cover images for KDP', included: true }
        ],
        buttonText: 'Get Full Service Plus',
        buttonVariant: 'outlined'
      }
    ];

    // Add add-ons
    const addOnPlans = [
      {
        title: 'Additional Books',
        subtitle: 'Add more books to your account at a great value.',
        price: 37,
        booksIncluded: 1,
        perBookCost: 37,
        noRefunds: true,
        features: [
          { title: '1 additional book project', included: true },
          { title: 'Export to PDF, Word, and EPUB', included: true },
          { title: 'AI-assisted formatting', included: true },
          { title: 'Advanced editing tools', included: true },
          { title: 'Watermark-free output', included: true },
          { title: 'Email support', included: true },
          { title: 'Word document splitting by H1 sections', included: true },
          { title: '+10 additional images', included: true }
        ],
        buttonText: 'Add Book',
        buttonVariant: 'outlined'
      },
      {
        title: 'Image Upgrade',
        subtitle: 'Add 100 images to your allowance.',
        price: 25,
        booksIncluded: 0,
        perBookCost: 25,
        noRefunds: true,
        features: [
          { title: '+100 additional images', included: true },
          { title: 'Works with any plan', included: true },
          { title: 'No expiration', included: true },
          { title: 'Immediate activation', included: true }
        ],
        buttonText: 'Add 100 Images',
        buttonVariant: 'outlined'
      }
    ];

    pricingPlans.push(...regularPlans, ...ebookPlans, ...premiumPlans, ...ebookPremiumPlans, ...fullServicePlans, ...addOnPlans);
  }

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
          {launchOfferActive && <LaunchOfferCountdown />}
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
                  transform: plan.launchOffer ? 'scale(1.08)' : plan.popular ? 'scale(1.05)' : 'scale(1)',
                  zIndex: plan.launchOffer ? 3 : plan.popular ? 2 : 1,
                  mb: plan.launchOffer ? 4 : 0, // Add bottom margin for launch offer cards
                }}
              >
                <Card
                  elevation={plan.launchOffer ? 12 : plan.popular ? 8 : 1}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'visible',
                    transition: 'all 0.3s ease',
                    border: plan.launchOffer ? '3px solid' : plan.popular ? '2px solid' : '1px solid',
                    borderColor: plan.launchOffer ? 'error.main' : plan.popular ? 'primary.main' : 'divider',
                    transform: plan.launchOffer ? 'scale(1.08)' : plan.popular ? 'scale(1.05)' : 'scale(1)',
                    zIndex: plan.launchOffer ? 3 : plan.popular ? 2 : 1,
                    '&:hover': {
                      transform: plan.launchOffer ? 'translateY(-12px) scale(1.08)' : plan.popular ? 'translateY(-8px) scale(1.05)' : 'translateY(-8px) scale(1)',
                      boxShadow: plan.launchOffer ? '0 20px 80px -12px rgba(255,0,0,0.4)' : plan.popular ? '0 16px 70px -12px rgba(0,0,0,0.3)' : '0 12px 40px -12px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  {plan.launchOffer && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -16,
                        left: 20,
                        bgcolor: 'error.main',
                        color: 'white',
                        borderRadius: '20px',
                        px: 2,
                        py: 0.5,
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        animation: 'pulse 2s infinite',
                        zIndex: 4
                      }}
                    >
                      🚀 LAUNCH OFFER
                    </Box>
                  )}
                  {plan.popular && !plan.launchOffer && (
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
                  
                  <CardContent sx={{ p: 4, flexGrow: 1, pt: plan.launchOffer ? 6 : 4 }}>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1, mt: plan.launchOffer ? 2 : 0 }}>
                      {plan.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: '40px' }}>
                      {plan.subtitle}
                    </Typography>
                    
                    {/* Pricing */}
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      {plan.launchOffer ? (
                        // Launch offer pricing with original price strikethrough
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                            <Typography 
                              variant="h4" 
                              sx={{ 
                                textDecoration: 'line-through', 
                                color: 'text.disabled',
                                mr: 2,
                                fontSize: '1.5rem'
                              }}
                            >
                              ${plan.originalPrice}
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: 'error.main' }}>
                              ${plan.price}
                            </Typography>
                          </Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'error.dark', 
                              fontWeight: 600,
                              bgcolor: 'error.light',
                              px: 2,
                              py: 0.5,
                              borderRadius: 1,
                              display: 'inline-block'
                            }}
                          >
                            Save ${plan.savings}!
                          </Typography>
                          {plan.oneTime && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              /one-time
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        // Regular pricing
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {!plan.free && (
                            <Typography variant="h4" sx={{ color: 'text.secondary', mr: 0.5 }}>$</Typography>
                          )}
                          <Typography variant="h3" sx={{ fontWeight: 700 }}>
                            {plan.free ? 'Free' : plan.customPrice ? 'Custom' : plan.price}
                          </Typography>
                          {plan.oneTime && (
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              /one-time
                            </Typography>
                          )}
                          {!plan.customPrice && !plan.free && !plan.oneTime && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {plan.booksIncluded} {plan.booksIncluded === 1 ? 'book' : 'books'} @ <Box component="span" sx={{ fontWeight: 700 }}>${plan.perBookCost}</Box> per book
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                    
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

  // FAQ data organized by categories - Yancy Dennis
  const faqCategories = [
    {
      category: "Getting Started",
      icon: <AutoStoriesIcon />,
      questions: [
        {
          id: "panel1",
          question: "What makes Publish Jockey different from other publishing tools?",
          answer: "Publish Jockey gives you the simplicity of easy, distraction-free writing, with professional book formatting that matches the standards of major publishers like those on Amazon or in bookstores. Your manuscript is instantly turned into a polished, print-ready book—no complicated setup required."
        },
        {
          id: "competitor-comparison",
          question: "How does PublishJockey compare to other publishing platforms?",
          answer: "We've created a detailed comparison showing how PublishJockey outperforms the competition in features, pricing, and speed:<br><br><div style='text-align: center; margin: 20px 0;'><img src='/publishing_platform_comparison.svg' alt='PublishJockey vs Competitors Comparison Table' style='max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);' /></div><br>Key advantages that set us apart:<br><br><ul style='padding-left: 20px;'><li><strong>80+ Languages:</strong> We support Hindi, Tamil, Bengali, African languages, and more—while other platforms typically support only 1-10 languages.</li><li><strong>Unbeatable Value:</strong> All 3 formats (PDF, EPUB, Word) for $63 promo vs other services charging $147-$349.</li><li><strong>Lightning Speed:</strong> EPUB and Word exports in 5 seconds, PDF in ~30 seconds vs other platforms taking minutes to days.</li><li><strong>Complete Toolkit:</strong> Built-in editor, CSV table import, Word import, and cover generation—features competitors charge extra for or don't offer.</li><li><strong>Bookstore-Quality Formatting:</strong> Professional formatting technology that makes your book look like it belongs on the shelves at Barnes & Noble or any major bookstore.</li></ul>"
        },
        {
          id: "panel2",
          question: "Do I need to know any special formatting or coding?",
          answer: "Not at all! Just write your book using simple, familiar tools. Publish Jockey handles all the advanced typesetting and layout automatically, so your final book always looks clean, consistent, and professionally published."
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
        },
        {
          id: "language-selection",
          question: "Should I select my native language before creating my book?",
          answer: "Yes, we <strong>highly recommend</strong> selecting your native language before creating your book project. Here's why:<br><br><ul style='padding-left: 20px;'><li><strong>Book Structure:</strong> Your book outline (chapters, copyright page, etc.) will appear in your native language from the start.</li><li><strong>Copyright Generation:</strong> The copyright notice will be automatically generated in your language with proper legal terminology.</li><li><strong>Better Experience:</strong> All book sections and templates will be localized for your language.</li></ul><br><strong>What if I forgot to select my language?</strong><br>Don't worry! The service still works perfectly, but:<br><br><ul style='padding-left: 20px;'><li>Your book outline will show in English initially</li><li>You'll need to manually select your copyright language</li><li>You can change your language anytime in settings, and the system will automatically correct the structure and copyright</li></ul><br>We support <strong>60+ languages</strong> including regional variants like Northern/Southern Sotho and African Portuguese, so you can always find the perfect match for your book!"
        }
      ]
    },
    {
      category: "Publishing & Exporting",
      icon: <ImportExportIcon />,
      questions: [
        {
          id: "panel-imagemagic",
          question: "What can I do if my AI-generated book cover is too low resolution for KDP?",
          answer: "This is a common problem with AI image generators. While they create beautiful cover designs, they often produce images at resolutions too low for professional publishing. That's exactly why we built ImageMagic! This tool automatically upscales your .png or .jpg files to meet the high-resolution requirements for Amazon KDP (and other publishing platforms). Simply upload your low-resolution AI-generated image, select a book size (or let it auto-detect), and ImageMagic will increase the resolution to 300 DPI - making your cover print-ready without any visible quality loss."
        },
        {
          id: "panel16",
          question: "How long does it take to generate my professional manuscript?",
                  answer: "After you make your final edits in the PublishJockey system, your manuscript is generated almost instantly. PDF files typically take less than 60 seconds, while EPUB and Word documents are usually ready in under 5 seconds. Unlike other services, PublishJockey lets you immediately view your polished manuscript—so you know exactly what you're getting before you publish."
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
          question: "Why does my finished book look so professional?",
          answer: "Behind the scenes, we use advanced publishing technology—the same approach used by large publishing houses—to ensure your book is formatted to the highest industry standards. You get beautiful results without worrying about the technical side."
        },
        {
          id: "panel12",
          question: "How does Publish Jockey compare to Microsoft Word for book publishing?",
          answer: "While Word is great for writing, it wasn't designed for professional book publishing. Publish Jockey uses advanced typesetting technology that ensures consistent formatting, proper page layouts, and print-ready quality. Our system handles the complex formatting automatically, so you can focus on your content while getting results that match industry standards.<br><br><table style='width:100%; border-collapse: collapse; margin: 15px 0;'><tr style='background-color: #f5f5f5; font-weight: bold;'><th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Feature</th><th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Publish Jockey</th><th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Microsoft Word</th></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Book Formatting</td><td style='border: 1px solid #ddd; padding: 8px;'>Professional, consistent</td><td style='border: 1px solid #ddd; padding: 8px;'>Manual, can be inconsistent</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Print-Ready Output</td><td style='border: 1px solid #ddd; padding: 8px;'>Automatic, optimized</td><td style='border: 1px solid #ddd; padding: 8px;'>Requires manual setup</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Large Document Handling</td><td style='border: 1px solid #ddd; padding: 8px;'>Excellent performance</td><td style='border: 1px solid #ddd; padding: 8px;'>Can slow down or crash</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>KDP Compatibility</td><td style='border: 1px solid #ddd; padding: 8px;'>Built-in optimization</td><td style='border: 1px solid #ddd; padding: 8px;'>Requires conversion</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Consistency</td><td style='border: 1px solid #ddd; padding: 8px;'>Automatic across chapters</td><td style='border: 1px solid #ddd; padding: 8px;'>Manual style management</td></tr><tr><td style='border: 1px solid #ddd; padding: 8px;'>Learning Curve</td><td style='border: 1px solid #ddd; padding: 8px;'>Simple, focused on writing</td><td style='border: 1px solid #ddd; padding: 8px;'>Familiar but complex for books</td></tr></table>"
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
          answer: "We're actively developing enhanced academic publishing features! While our current platform excels at general book formatting, we recognize the unique needs of academic publishing. Enhanced support for thesis, dissertations, and textbooks—including complex mathematical equations, advanced footnoting, bibliography management, and academic citation styles—is currently in development. Stay tuned for these exciting new capabilities!"
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
        },
        {
          id: "fancy-title-styles",
          question: "What are the fancy title style options for my book?",
          answer: "Publish Jockey offers 10 publisher-inspired title styles to give your chapters a professional, elegant appearance:<br><br><ul style='padding-left: 20px;'><li><strong>Standard:</strong> Clean, simple chapter headers</li><li><strong>Classic Literature:</strong> Traditional book styling inspired by literary classics</li><li><strong>Modern Minimalist:</strong> Contemporary, clean design</li><li><strong>Academic Press:</strong> Professional academic formatting</li><li><strong>Classical Ornate:</strong> Elegant decorative styling</li><li><strong>Technical Programming:</strong> Clean, code-friendly formatting</li><li><strong>Magazine Style:</strong> Modern publication design</li><li><strong>Luxury Fashion:</strong> Sophisticated, high-end styling</li><li><strong>Small Caps Elegance:</strong> Refined small capitals design</li><li><strong>Decorative Script:</strong> Artistic script-style headers</li></ul><br>These styles automatically format your chapter titles with professional typography, spacing, and design elements that match the aesthetic of major publishing houses."
        },
        {
          id: "drop-caps",
          question: "What are drop caps and which languages support them?",
          answer: "Drop caps are large decorative letters that begin the first paragraph of a chapter, creating an elegant, traditional book appearance. Publish Jockey offers 4 drop cap styles:<br><br><ul style='padding-left: 20px;'><li><strong>None:</strong> Standard paragraph opening</li><li><strong>Traditional:</strong> Classic large letter design</li><li><strong>Raised:</strong> Elevated letter above the baseline</li><li><strong>Decorated:</strong> Ornamental styling with embellishments</li></ul><br><strong>Supported Languages:</strong> Drop caps are currently available for English, French, Italian, Spanish, Portuguese, and German. These languages have been specifically tested and optimized for proper drop cap rendering with our XeLaTeX publishing system.<br><br>Drop caps add a sophisticated, professional touch that's commonly seen in high-quality published books and literary works."
        }
      ]
    },
    {
      category: "Pricing & Plans",
      icon: <AttachMoneyIcon />,
      questions: [
        {
          id: "pricing-trial",
          question: "What happens after my free trial or free book is complete?",
          answer: "You can choose to upgrade to a paid plan for unlimited exports, or keep your account and work on new projects with limited features. We'll never charge you automatically—upgrade only if you're ready!"
        },
        {
          id: "pricing-flexible",
          question: "Can I pay per book, or do I have to subscribe?",
          answer: "We offer both flexible single-book licenses and subscription options for frequent authors or small publishers. You can purchase individual books as needed, or choose our annual subscription for multiple projects."
        },
        {
          id: "panel7",
          question: "Can I try before I buy?",
          answer: "Yes! Our Free plan lets you try most of Publish Jockey's core features. You can create one book project and export with a watermark to see the quality of our system before upgrading to a paid plan."
        },
        {
          id: "ebook-word-limit",
          question: "Are there any content limits for ebook subscriptions?",
          answer: "Yes, ebook subscription plans have a 10,000-word limit per book to ensure optimal quality and performance. This gives you approximately 40 pages of content—perfect for most ebooks! If you exceed this limit, the export will be disabled until you reduce your content. Print subscription plans have no word limits."
        }
      ]
    },
    {
      category: "Book Ownership & Rights",
      icon: <CopyrightIcon />,
      questions: [
        {
          id: "ownership-rights",
          question: "Who owns the books I create with Publish Jockey?",
          answer: "You always retain 100% rights and ownership of your books and content. We never claim any publishing rights or royalties—everything you create belongs to you."
        }
      ]
    },
    {
      category: "Publishing on Amazon KDP",
      icon: <ShoppingCartIcon />,
      questions: [
        {
          id: "kdp-help",
          question: "Can you help me publish directly to Amazon KDP?",
          answer: "While we provide KDP-ready files, you will need to upload your manuscript and cover to Amazon KDP yourself. We include step-by-step instructions and resources to make the process easy, and our support team is happy to answer questions."
        },
        {
          id: "panel4",
          question: "Is Publish Jockey compatible with Kindle Direct Publishing (KDP)?",
          answer: "Absolutely. Our export formats are specifically designed to meet KDP requirements. The PDF export is optimized for print publishing, and our EPUB option works seamlessly with KDP's digital publishing platform."
        }
      ]
    },
    {
      category: "Support & Community",
      icon: <PeopleIcon />,
      questions: [
        {
          id: "community-forum",
          question: "Is there a community or forum where I can connect with other authors?",
          answer: "We're building a community of self-publishers and indie authors—watch for links to our Discord/Facebook group soon!"
        }
      ]
    },
    {
      category: "Future Features & Roadmap",
      icon: <TimelineIcon />,
      questions: [
        {
          id: "future-features",
          question: "Are you planning to add more features (e.g., audiobook support, advanced templates, more import/export formats)?",
          answer: "Yes! We're constantly improving based on user feedback. Currently in development: enhanced support for thesis and dissertation formatting with advanced academic features including bibliography management, citation styles, and complex document structures. Share your suggestions with us—your vote matters!"
        }
      ]
    },
    {
      category: "Real Output Samples",
      icon: <PreviewIcon />,
      questions: [
        {
          id: "sample-output",
          question: "Can I see a real book created with Publish Jockey before I sign up?",
          answer: "Absolutely! We have public sample links—see our Amazon book listing or download a free epub sample to check the real output quality."
        }
      ]
    },
    {
      category: "Data & Privacy",
      icon: <SecurityIcon />,
      questions: [
        {
          id: "data-retention",
          question: "How long do you keep my manuscript files?",
          answer: "Your projects are stored as long as your account is active. You can export or delete your content at any time, and request complete data removal for privacy."
        },
        {
          id: "panel6",
          question: "How secure is my manuscript data?",
          answer: "Your manuscript security is our priority. All data is encrypted both in transit and at rest. You maintain complete ownership of your content, and we never share your manuscripts with third parties. The Annual Subscription plan also includes additional backup options."
        }
      ]
    },
    {
      category: "Accessibility & International",
      icon: <PublicIcon />,
      questions: [
        {
          id: "international-use",
          question: "Can I use Publish Jockey if I'm outside the US?",
          answer: "Yes, our platform is global! We support multiple currencies and common book formats accepted by major platforms worldwide."
        },
        {
          id: "language-support",
          question: "What languages does Publish Jockey support?",
          answer: "Publish Jockey supports multiple languages for both the user interface and document export. Here's our current language support:<br><br><strong>Interface Languages (UI):</strong><br>• English (en) - Primary language<br>• Spanish (es) - Español<br>• German (de) - Deutsch<br>• French (fr) - Français<br>• Italian (it) - Italiano<br>• Russian (ru) - Русский<br>• Arabic (ar) - العربية<br>• Hebrew (he) - עברית<br>• Yiddish (yi) - יידיש<br>• Indonesian (id) - Bahasa Indonesia<br>• Hindi (hi) - हिन्दी<br>• Tamil (ta) - தமிழ்<br><br><strong>Document Export Languages:</strong><br>• <strong>Latin-based languages:</strong> English, Spanish, German, French, Italian, Indonesian<br>• <strong>Cyrillic languages:</strong> Russian<br>• <strong>Right-to-Left (RTL) languages:</strong> Arabic, Hebrew, Yiddish<br>• <strong>Devanagari script:</strong> Hindi<br>• <strong>Tamil script:</strong> Tamil<br><br>Each language has optimized font support and proper text direction handling for professional publishing."
        },
        {
          id: "rtl-language-limitations",
          question: "Are there any limitations with Arabic, Hebrew, or Yiddish?",
          answer: "Yes, there are important limitations for Right-to-Left (RTL) languages:<br><br><strong>Pure Language Content:</strong> For best results with Arabic, Hebrew, and Yiddish, we recommend using pure language content only. Mixed content (English text, URLs, email addresses) may not display correctly in the exported PDF.<br><br><strong>Font Selection:</strong> RTL languages use automatically selected fonts optimized for each language. Font selection is limited to ensure proper rendering.<br><br><strong>Text Direction:</strong> These languages are automatically set to right-to-left text direction in exports.<br><br><strong>Recommendation:</strong> If your content includes mixed languages, consider creating separate documents or using Latin-based languages for mixed content."
        },
        {
          id: "font-support",
          question: "What fonts are available for different languages?",
          answer: "Font availability varies by language group. <strong>Note:</strong> Our platform uses professional Linux-based fonts rather than Windows/Mac fonts you might be familiar with. These fonts are specifically chosen for their quality and cross-platform compatibility.<br><br><strong>Latin-based languages (English, Spanish, German, French, Italian, Indonesian):</strong><br>• <strong>Professional Book Fonts:</strong> Latin Modern Roman (high-quality academic typography), Nimbus Roman (similar to Times New Roman)<br>• <strong>Standard Fonts:</strong> Liberation Serif (Linux equivalent of Times New Roman), Liberation Sans (Linux equivalent of Arial), DejaVu Serif, DejaVu Sans<br>• <strong>TeX Fonts:</strong> TeX Gyre Termes, TeX Gyre Pagella, Linux Libertine<br><br><strong>Russian (Cyrillic):</strong><br>• Liberation Serif (Cyrillic), Times New Roman (Cyrillic), DejaVu Serif (Cyrillic)<br><br><strong>Arabic:</strong><br>• Noto Sans Arabic (automatically selected)<br><br><strong>Hebrew:</strong><br>• Noto Sans Hebrew, Noto Serif Hebrew, Noto Rashi Hebrew (automatically selected)<br><br><strong>Yiddish:</strong><br>• Noto Sans Hebrew, Noto Serif Hebrew (automatically selected)<br><br><strong>Hindi (Devanagari):</strong><br>• Noto Sans Devanagari (automatically selected)<br><br><strong>Tamil:</strong><br>• Noto Sans Tamil, Noto Serif Tamil (automatically selected)<br><br><strong>Why Linux Fonts?</strong> Our platform uses professional Linux fonts because they offer excellent quality, are free and open-source, and provide consistent rendering across all devices and platforms. Latin Modern Roman and Nimbus Roman are particularly excellent for book publishing and academic work."
        },
        {
          id: "language-switching",
          question: "How do I change the interface language?",
          answer: "You can change the interface language in two ways:<br><br><strong>From the Navigation Bar:</strong> Look for the language selector in the top navigation bar. Click on it to see all available languages and select your preferred language.<br><br><strong>From Settings:</strong> Go to your account Settings page and find the 'Language & Font Settings' section. Select your preferred interface language from the dropdown menu.<br><br>The language change takes effect immediately and will be remembered for future visits. Note that changing the interface language does not affect the language of your document content."
        },
        {
          id: "book-structure-localization",
          question: "How does language switching affect my book's chapter structure?",
          answer: "Here's how language switching works with your book's chapter structure:<br><br><strong>New Projects:</strong> When you create a new book, the default chapter names (like 'Chapter 1', 'Title Page', etc.) will automatically appear in your selected interface language.<br><br><strong>Existing Projects:</strong> For existing books, the chapter structure is loaded based on the language you had selected when you first accessed the project. If you want the default chapter names to appear in a different language, you should:<br><br>1. <strong>Select your preferred language first</strong> (from the navigation bar or Settings)<br>2. <strong>Then load or create your project</strong><br><br><strong>Language Switching After Loading:</strong> Changing the interface language after a project is loaded will not automatically update existing chapter names. This is by design to preserve any custom chapter names you may have added.<br><br><strong>Custom Chapters:</strong> Any chapters you've added or renamed yourself will always remain unchanged, regardless of language switching. Only the default system chapter names are affected by language selection."
        }
      ]
    },
    {
      category: "Account & Security",
      icon: <SettingsIcon />,
      questions: [
        {
          id: "terms-faq",
          question: "What are the Terms and Agreement?",
          answer: "By creating an account with PublishJockey, you agree to the following terms:<br><br><strong>Usage Rights</strong><br>PublishJockey grants you a limited, non-transferable license to use the platform for the purpose of creating, editing, and exporting manuscripts for personal or commercial use, subject to the terms outlined herein.<br><br><strong>Intellectual Property</strong><br>You retain all rights to the content you create or upload. However, by using the platform, you grant PublishJockey the right to process, display, and temporarily store your content for the sole purpose of providing the publishing service.<br><br><strong>Fair Use Policy</strong><br>The platform is designed to support a fair number of manuscript creations and exports per user, particularly for individual authors or small publishers. Users on free or basic plans are expected to operate within reasonable publishing limits.<br><br>Abuse of the system—such as attempting to bypass plan restrictions by repeatedly editing and republishing the same project to create multiple unique books—may result in limitations, account suspension, or removal from the platform.<br><br>We reserve the right to implement automatic and manual safeguards to protect the integrity of our service.<br><br><strong>Account Responsibility</strong><br>You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. If you suspect unauthorized access, you must notify us immediately.<br><br><strong>Service Changes and Availability</strong><br>We reserve the right to modify, pause, or discontinue any part of the platform with or without notice. We will do our best to notify users in advance of any major changes that affect core functionality.<br><br><strong>Data Storage and Privacy</strong><br>We do not store your complete manuscript files. Only your original Markdown input and any uploaded images are retained while your account is active. You may request account deletion and data removal at any time.<br><br><strong>Agreement to Terms</strong><br>By registering or creating an account, you acknowledge that you have read, understood, and agree to be bound by these terms."
        },
        {
          id: "fair-use-notice",
          question: "What is the Fair Use Protection notice?",
          answer: "The Fair Use Protection notice is a system that helps maintain the integrity of our platform. Here's what it means:<br><br><strong>Purpose:</strong> Our AI-powered system monitors book content to ensure compliance with our fair use policy. Each license purchase entitles you to create and publish a single book.<br><br><strong>Book Changes:</strong> Making substantial changes to transform a project into a completely different book will require an additional purchase. This ensures fair usage of the platform across all users.<br><br><strong>Manual Downloads:</strong> For security reasons, files must be manually downloaded by clicking the download button after export.<br><br>You'll see a compact version of this notice in your dashboard to remind you of these policies. This helps us maintain a sustainable platform while protecting the rights of all users."
        },
        {
          id: "language-disclaimer",
          question: "What is the Language Support Disclaimer?",
          answer: "Publish Jockey provides comprehensive language support, but users have important responsibilities:<br><br><strong>Content Responsibility:</strong> You are responsible for ensuring your content is appropriate, accurate, and compliant with all applicable laws and regulations in your target markets.<br><br><strong>RTL Language Limitations:</strong> For Arabic, Hebrew, and Yiddish, we recommend using pure language content only. Mixed content may not render correctly. This limitation is clearly communicated in the export interface.<br><br><strong>Font and Rendering:</strong> While we optimize fonts for each language, final rendering may vary depending on the viewing platform and device. Test your exports thoroughly before publishing.<br><br><strong>Cultural Sensitivity:</strong> Ensure your content respects cultural norms and sensitivities of your target audience. We provide tools but cannot guarantee cultural appropriateness.<br><br><strong>Professional Review:</strong> For important publications, we recommend having your content reviewed by native speakers or professional translators.<br><br><strong>Platform Compatibility:</strong> Different publishing platforms may have varying support for certain languages and fonts. Verify compatibility with your chosen publishing platform.<br><br>By using our language features, you acknowledge these limitations and accept responsibility for your content's appropriateness and accuracy."
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
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer) }}
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

export default PublishJockeyLanding; 