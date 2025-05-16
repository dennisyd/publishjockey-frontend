import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real implementation, you would make an API call here
      // For now, we'll just simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form after successful submission
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSuccessOpen(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        mb: 6
      }}>
        <Typography
          component="h1"
          variant="h2"
          color="text.primary"
          gutterBottom
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          Contact Us
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary" 
          align="center"
          sx={{ maxWidth: 600 }}
        >
          Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
        </Typography>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          bgcolor: '#f8fafc'
        }}
      >
        <Grid container>
          {/* Contact Form */}
          <Grid item xs={12} md={7} sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
              Send us a message
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 3, bgcolor: 'white', borderRadius: 1 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3, bgcolor: 'white', borderRadius: 1 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="subject"
                label="Subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={{ mb: 3, bgcolor: 'white', borderRadius: 1 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                multiline
                rows={4}
                id="message"
                label="Message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 4, bgcolor: 'white', borderRadius: 1 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </Box>
          </Grid>
          
          {/* Illustration */}
          <Grid 
            item 
            xs={12} 
            md={5} 
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 5,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                opacity: 0.1,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.3) 0%, transparent 70%)'
              }} 
            />
            
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 4,
                  mx: 'auto'
                }}
              >
                <EmailIcon sx={{ fontSize: 80, color: 'white' }} />
              </Box>
              
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                We're here to help
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                Our team is always ready to assist you with any questions or concerns about publishing your book.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                maxWidth: 300,
                mx: 'auto'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'white' }} />
                  <Typography>Fast response times</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'white' }} />
                  <Typography>Expert publishing advice</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'white' }} />
                  <Typography>Free consultation for authors</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Success and Error messages */}
      <Snackbar open={successOpen} autoHideDuration={6000} onClose={() => setSuccessOpen(false)}>
        <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
          Your message has been sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
      
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={() => setErrorOpen(false)}>
        <Alert onClose={() => setErrorOpen(false)} severity="error" sx={{ width: '100%' }}>
          Something went wrong. Please try again later.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactPage; 