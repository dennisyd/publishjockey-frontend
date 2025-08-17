import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CodeIcon from '@mui/icons-material/Code';
import TocIcon from '@mui/icons-material/Toc';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Footer from '../components/Footer';

const Features = () => {
  return (
    <Box 
      className="scroll-container"
      sx={{ 
        bgcolor: '#f9fafb', 
        minHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        height: 'auto',
        position: 'relative'
      }}
    >
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 1.2, md: 2 } }}>
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
              Features
            </Typography>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                mb: 2,
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Everything you need to create professional books
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ 
                maxWidth: '700px',
                mx: 'auto',
                fontWeight: 400
              }}
            >
              Powerful tools designed specifically for authors who want to publish beautiful books without the technical hassle
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
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
                <Typography variant="body1" color="text.secondary" paragraph>
                  Our editor provides a distraction-free writing environment with real-time preview, making it easy to focus on your content while ensuring it looks exactly how you want it.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Real-time preview as you type</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Syntax highlighting for easy editing</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Auto-save functionality</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Support for all standard markdown syntax</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Keyboard shortcuts for power users</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
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
                <Typography variant="body1" color="text.secondary" paragraph>
                  Our system handles all the complex typesetting rules behind the scenes, ensuring your book meets professional publishing standards.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Print-ready PDFs in seconds</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Professional typography and spacing</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Multiple book sizes supported</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Automatic widow and orphan control</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Customizable margins and page layouts</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
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
                <Typography variant="body1" color="text.secondary" paragraph>
                  Our system intelligently analyzes your document's headings and creates a properly formatted table of contents that meets publishing standards.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Auto-generated from headings</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Customizable depth and formatting</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Clickable in digital formats</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Automatic page number updates</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Multiple style options</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
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
                <Typography variant="body1" color="text.secondary" paragraph>
                  Our smart conversion system preserves your document structure, headings, lists, and basic formatting, making it easy to transition from your existing workflow.
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Batch import support</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                    <Typography variant="body2">Automatic chapter detection</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mt: { xs: 8, md: 12 } }}>
          <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 700 }}>
            Ready to start publishing?
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Get Started Free
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Features; 