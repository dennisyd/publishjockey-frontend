import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Avatar, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAuth } from '../auth/AuthContext';

const Testimonials = () => {
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 8 }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  // Sort and limit to 10 most recent testimonials
  const sortedTestimonials = [...testimonials]
    .sort((a, b) => (b.createdAt || 0) > (a.createdAt || 0) ? 1 : -1)
    .slice(0, 10);

  // Carousel settings
  const settings = {
    dots: true,
    infinite: sortedTestimonials.length > 1, // Always infinite if more than 1
    speed: 500,
    slidesToShow: Math.min(3, sortedTestimonials.length),
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomArrow direction="right" />, // Custom arrow
    prevArrow: <CustomArrow direction="left" />, // Custom arrow
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(2, sortedTestimonials.length),
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(2, sortedTestimonials.length),
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  // Custom Arrow component for carousel
  function CustomArrow({ className, style, onClick, direction }) {
    return (
      <button
        className={className}
        style={{
          ...style,
          display: 'block',
          background: '#4F46E5',
          borderRadius: '50%',
          border: 'none',
          width: 36,
          height: 36,
          zIndex: 2,
          color: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          [direction === 'left' ? 'left' : 'right']: -18,
        }}
        onClick={onClick}
        aria-label={direction === 'left' ? 'Previous testimonial' : 'Next testimonial'}
      >
        {direction === 'left' ? '<' : '>'}
      </button>
    );
  }

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

  return (
    <Box sx={{ py: 8, bgcolor: '#f9fafb' }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" component="h2" align="center" sx={{ mb: 6, fontWeight: 700 }}>
          What Our Users Say
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>
          <Slider {...settings}>
            {sortedTestimonials.map((testimonial) => (
              <Box key={testimonial._id} px={{ xs: 0.5, sm: 2 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white', mx: 1 }}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          {isAuthenticated && (
            <Typography
              component={RouterLink}
              to="/submit-testimonial"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Share Your Story →
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Testimonials; 