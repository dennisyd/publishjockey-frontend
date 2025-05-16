import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Button, Divider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import Footer from '../components/Footer';

const steps = [
  {
    icon: <CloudUploadIcon sx={{ fontSize: 36 }} />, title: 'Import or Create',
    description: 'Start by importing your existing manuscript or create a new one from scratch using our intuitive markdown editor.'
  },
  {
    icon: <EditIcon sx={{ fontSize: 36 }} />, title: 'Edit and Format',
    description: 'Use our intuitive markdown editor to write and format your content with real-time previews as you work.'
  },
  {
    icon: <SettingsIcon sx={{ fontSize: 36 }} />, title: 'Preview and Refine',
    description: 'Preview how your book will look when published and make adjustments to layout and structure as needed.'
  },
  {
    icon: <ImportExportIcon sx={{ fontSize: 36 }} />, title: 'Export and Publish',
    description: 'Export your book in PDF or EPUB format, ready to upload to platforms like Amazon KDP or IngramSpark.'
  }
];

const HowItWorks = () => {
  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', pb: 8 }}>
      {/* Hero Header */}
      <Box sx={{ bgcolor: 'white', py: { xs: 2, md: 4 }, borderBottom: '1px solid #eaeaea' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
              How it Works
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontWeight: 800, mb: 2 }}>
              From manuscript to published book in four simple steps
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', fontWeight: 400 }}>
              Our process is designed to be simple, fast, and professional—no technical expertise required.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Steps Timeline */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={4} alignItems="flex-start">
          {steps.map((step, idx) => (
            <Grid item xs={12} md={3} key={idx}>
              <Card elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 15px 40px rgba(0,0,0,0.1)', transform: 'translateY(-8px)' } }}>
                <Avatar sx={{ width: 70, height: 70, bgcolor: 'primary.main', mb: 2, mx: 'auto' }}>{step.icon}</Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{step.title}</Typography>
                <Typography variant="body2" color="text.secondary">{step.description}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ textAlign: 'center', mt: { xs: 8, md: 12 } }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Ready to start publishing?
        </Typography>
        <Button
          href="/register"
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
      <Footer />
    </Box>
  );
};

export default HowItWorks; 