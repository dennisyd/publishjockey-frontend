import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  CircularProgress, 
  Alert,
  Divider,
  Button
} from '@mui/material';
import Footer from '../components/Footer';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const TestimonialsPage = () => {
  const { isAuthenticated } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/testimonials?approved=true');
        if (!res.ok) throw new Error('Failed to fetch testimonials');
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Helper to get initials from name
  function getInitials(name) {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.length === 1
      ? parts[0][0]
      : (parts[0][0] + parts[parts.length - 1][0]);
  }

  // Helper to pick a color based on name
  function getColor(name) {
    const colors = ['#4F46E5', '#6366F1', '#7C3AED', '#F59E42', '#10B981', '#F43F5E'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  // Helper to format date
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Sort testimonials by date (newest first)
  const sortedTestimonials = [...testimonials]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 2, md: 4 }, borderBottom: '1px solid #eaeaea' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
              Testimonials
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontWeight: 800, mb: 2 }}>
              What Our Users Are Saying
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', fontWeight: 400 }}>
              Real experiences from authors who have transformed their manuscripts with PublishJockey
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
            {error}
          </Alert>
        ) : sortedTestimonials.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No testimonials available yet. Be the first to share your experience!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {sortedTestimonials.map((testimonial) => (
              <Grid item xs={12} md={6} key={testimonial._id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                  }
                }}>
                  <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        flexGrow: 1,
                        fontStyle: 'italic',
                        color: 'text.secondary',
                        fontSize: '1.1rem',
                        lineHeight: 1.6
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                      {testimonial.avatarUrl ? (
                        <Avatar
                          src={testimonial.avatarUrl}
                          alt={testimonial.name}
                          sx={{ width: 48, height: 48, mr: 2 }}
                        />
                      ) : (
                        <Avatar
                          sx={{ width: 48, height: 48, mr: 2, bgcolor: getColor(testimonial.name), color: 'white', fontWeight: 700, fontSize: 22 }}
                        >
                          {getInitials(testimonial.name)}
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(testimonial.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* CTA to submit testimonial if authenticated */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          {isAuthenticated ? (
            <Button
              component={RouterLink}
              to="/submit-testimonial"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '50px',
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Share Your Story
            </Button>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you a PublishJockey user? Login to share your experience!
              </Typography>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="primary"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 600,
                  mr: 2
                }}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default TestimonialsPage; 