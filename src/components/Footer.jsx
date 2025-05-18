import React from 'react';
import { Box, Container, Grid, Typography, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PublishJockeyLogo from '../assets/publishjockey_logo.png';

const Footer = () => {
  const navigate = useNavigate();

  // Function to handle navigation and scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <Box component="footer" sx={{ bgcolor: '#1f2937', color: 'white', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Box component="img" src={PublishJockeyLogo} alt="PublishJockey Logo" sx={{ height: '50px', mb: 2 }} />
            <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: '300px' }}>
              From manuscript to masterpiece—with clarity, simplicity, and freedom.
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={4}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Product
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Box 
                      component="a" 
                      href="/features"
                      onClick={(e) => { e.preventDefault(); handleNavigation('/features'); }}
                      sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                    >
                      Features
                    </Box>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Box 
                      component="a" 
                      href="/pricing"
                      onClick={(e) => { e.preventDefault(); handleNavigation('/pricing'); }}
                      sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                    >
                      Pricing
                    </Box>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Box 
                      component="a" 
                      href="/how-it-works"
                      onClick={(e) => { e.preventDefault(); handleNavigation('/how-it-works'); }}
                      sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                    >
                      How it Works
                    </Box>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Box 
                      component="a" 
                      href="/testimonials"
                      onClick={(e) => { e.preventDefault(); handleNavigation('/testimonials'); }}
                      sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                    >
                      Testimonials
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={4}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Company
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Box 
                      component="a" 
                      href="/about"
                      onClick={(e) => { e.preventDefault(); handleNavigation('/about'); }}
                      sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                    >
                      About
                    </Box>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Box 
                      component="a" 
                      href="/submit-testimonial"
                      onClick={(e) => { e.preventDefault(); handleNavigation('/submit-testimonial'); }}
                      sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                    >
                      Share Your Story
                    </Box>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Box 
                      component="a" 
                      href="/blog"
                      onClick={(e) => { e.preventDefault(); handleNavigation('/blog'); }}
                      sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                    >
                      Blog
                    </Box>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Box 
                      component={RouterLink} 
                      to="/contact" 
                      sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', '&:hover': { opacity: 1 } }}
                    >
                      Contact
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={4}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Legal
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Box 
                      component="a" 
                      href="/privacy"
                      onClick={(e) => { e.preventDefault(); handleNavigation('/privacy'); }}
                      sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                    >
                      Privacy
                    </Box>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Box 
                      component="a" 
                      href="/terms"
                      onClick={(e) => { e.preventDefault(); handleNavigation('/terms'); }}
                      sx={{ color: 'white', opacity: 0.8, textDecoration: 'none', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                    >
                      Terms
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
        <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center' }}>
          © {new Date().getFullYear()} <Box component="img" src={PublishJockeyLogo} alt="PublishJockey Logo" sx={{ height: 20, display: 'inline', verticalAlign: 'middle', mx: 1 }} />. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 