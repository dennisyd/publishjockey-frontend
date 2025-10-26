import React from 'react';
import { Container, Box, Typography, Link, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TestimonialSubmissionForm from '../components/TestimonialSubmissionForm';

const SubmitTestimonial = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ py: 2, px: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          component={Link} 
          href="/" 
          color="inherit"
          sx={{ textTransform: 'none' }}
        >
          Back to Home
        </Button>
      </Box>
      
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
          Submit Your Testimonial
        </Typography>
        
        <TestimonialSubmissionForm />
      </Container>
    </Box>
  );
};

export default SubmitTestimonial; 