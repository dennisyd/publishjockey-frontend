import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';

const TestimonialSubmissionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    testimonial: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.role || !formData.testimonial) {
      setSnackbar({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Real API call to submit testimonial
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.role, // Map 'role' to 'email' for compatibility, or change as needed
          text: formData.testimonial
        })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Submission failed');
      }
      setSnackbar({
        open: true,
        message: 'Thank you for your testimonial! It will be reviewed by our team before publishing.',
        severity: 'success'
      });
      // Reset form
      setFormData({
        name: '',
        role: '',
        testimonial: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while submitting your testimonial. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Share Your Experience
        </Typography>
        <Typography variant="body1" paragraph align="center" color="text.secondary">
          We'd love to hear about your experience with Publish Jockey. Your testimonial will be reviewed by our team before being published on our site.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 4 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Your Name"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            autoFocus
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="role"
            label="Your Role (e.g., 'Fantasy Author', 'Non-Fiction Writer')"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={6}
            id="testimonial"
            label="Your Testimonial"
            name="testimonial"
            value={formData.testimonial}
            onChange={handleChange}
            placeholder="Share your experience with Publish Jockey. What did you like about it? How did it help with your book publishing process?"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit Testimonial"
            )}
          </Button>
        </Box>
      </Paper>
      
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
    </Container>
  );
};

export default TestimonialSubmissionForm; 