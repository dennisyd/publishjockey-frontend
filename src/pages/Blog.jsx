import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Breadcrumbs,
  Link,
  Divider,
  Avatar,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default images for blog posts
  const defaultImages = {
    'Publishing Tips': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'Cover Design': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    'Publishing Insights': 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'Writing Tools': 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1170&q=80',
    'Publishing Formats': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'
  };

  const defaultAuthorAvatar = 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80';

  // Fetch blog posts from backend
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${apiBaseUrl}/blog`);
        const result = await response.json();
        
        if (result.success && result.data) {
          // Transform backend data to match frontend format
          const transformedPosts = result.data.map(post => ({
            id: post.slug || post.id,
            title: post.title,
            excerpt: post.excerpt || post.description,
            imageUrl: post.imageUrl || defaultImages[post.category] || defaultImages['Publishing Tips'],
            date: new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            author: post.author,
            authorAvatar: post.authorAvatar || defaultAuthorAvatar,
            category: post.category,
            readTime: post.readTime || '5 min read'
          }));
          setBlogPosts(transformedPosts);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Fallback to hardcoded data if fetch fails
        setBlogPosts([
          {
            id: 'manuscript-to-print-ready',
            title: 'How to Turn Your Manuscript Into a Print-Ready Book in Minutes',
            excerpt: 'A step-by-step guide to transforming your raw manuscript into a professionally formatted book using PublishJockey.',
            imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            date: 'May  9, 2025',
            author: 'The PublishJockey Team',
            authorAvatar: defaultAuthorAvatar,
            category: 'Publishing Tips',
            readTime: '5 min read'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [defaultImages]);

  // Always show the anchor article on top, others below
  const anchorId = 'manuscript-to-print-ready';
  const anchorArticle = blogPosts.find(post => post.id === anchorId);
  const otherArticles = blogPosts.filter(post => post.id !== anchorId);

  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: 8,
        backgroundImage: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            PublishJockey Blog
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: '700px', mb: 3, opacity: 0.9 }}>
            Insights, tutorials, and tips to help you navigate the world of self-publishing
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'white' }}>
            <Link component={RouterLink} to="/" sx={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              Home
            </Link>
            <Typography color="white">Blog</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Blog Posts Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
          {/* Featured Anchor Article */}
          {anchorArticle && (
            <Grid item xs={12}>
              <Card sx={{ 
                display: { xs: 'block', md: 'flex' }, 
                mb: 4, 
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }}>
                <CardMedia
                  component="img"
                  sx={{ 
                    width: { xs: '100%', md: '40%' },
                    height: { xs: '200px', md: 'auto' }
                  }}
                  image={anchorArticle.imageUrl}
                  alt={anchorArticle.title}
                />
                <CardContent sx={{ p: { xs: 3, md: 4 }, flex: '1 1 auto' }}>
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    {anchorArticle.category}
                  </Typography>
                  <Typography variant="h4" component="h2" sx={{ fontWeight: 700, my: 1 }}>
                    {anchorArticle.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {anchorArticle.excerpt}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar src={anchorArticle.authorAvatar} sx={{ width: 40, height: 40, mr: 1 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {anchorArticle.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {anchorArticle.date} · {anchorArticle.readTime}
                      </Typography>
                    </Box>
                  </Box>

                  <Button 
                    component={RouterLink} 
                    to={`/blog/${anchorArticle.id}`} 
                    variant="outlined" 
                    color="primary"
                    sx={{ 
                      mt: 1,
                      borderRadius: '50px',
                      py: 1,
                      px: 3,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Read Full Article
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Other Articles */}
          {otherArticles.map((post) => (
            <Grid item xs={12} md={4} key={post.id}>
              <Card sx={{ height: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.08)' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={post.imageUrl}
                  alt={post.title}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    {post.category}
                  </Typography>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {post.excerpt}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={post.authorAvatar} sx={{ width: 30, height: 30, mr: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {post.date}
                      </Typography>
                    </Box>
                    <RouterLink to={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
                      <Typography variant="button" color="primary" sx={{ fontWeight: 600 }}>
                        Read More
                      </Typography>
                    </RouterLink>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          </Grid>
        )}

        {/* Newsletter Signup */}
        {!loading && (
          <Box sx={{ 
          mt: 8, 
          bgcolor: 'white', 
          borderRadius: 3, 
          p: { xs: 3, md: 5 },
          boxShadow: '0 5px 20px rgba(0,0,0,0.07)'
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Get Publishing Tips in Your Inbox
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 2, md: 0 } }}>
                Subscribe to our newsletter for the latest publishing tips, tutorials, and industry news
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box 
                  component="input"
                  placeholder="Your email address"
                  sx={{ 
                    flex: 1,
                    p: 2,
                    borderRadius: '50px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    '&:focus': {
                      outline: 'none',
                      borderColor: 'primary.main'
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ 
                    borderRadius: '50px',
                    px: 3,
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Blog; 