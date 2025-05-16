import React from 'react';
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
  Avatar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PublishJockeyLogo from '../publishjockey_logo.png';

const Blog = () => {
  // Blog post data
  const blogPosts = [
    {
      id: 'manuscript-to-print-ready',
      title: 'How to Turn Your Manuscript Into a Print-Ready Book in Minutes',
      excerpt: 'A step-by-step guide to transforming your raw manuscript into a professionally formatted book using PublishJockey.',
      imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      date: 'May  9, 2025',
      author: 'The PublishJockey Team',
      authorAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
      category: 'Publishing Tips',
      readTime: '5 min read'
    },
    {
      id: 'book-formatting-truth',
      title: 'The Truth About Book Formatting: What Self-Publishers Need to Know',
      excerpt: 'Discover the hidden challenges of book formatting and why modern tools are transforming the self-publishing landscape.',
      imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      date: 'January 28, 2025',
      author: 'Emma Richardson',
      authorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
      category: 'Publishing Insights',
      readTime: '8 min read'
    },
    {
      id: 'markdown-for-authors',
      title: 'Markdown for Authors: Why It\'s Simpler Than You Think',
      excerpt: 'Demystifying Markdown for non-technical writers and showing why it\'s the perfect tool for modern book creation.',
      imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1170&q=80',
      date: 'May 1, 2025',
      author: 'The PublishJockey Team',
      authorAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
      category: 'Writing Tools',
      readTime: '6 min read'
    },
    {
      id: 'pdf-epub-docx-formats',
      title: 'PDF, EPUB, DOCX: Which Format Do You Really Need?',
      excerpt: 'A clear guide to the most common publishing formats—what they are, when to use them, and how to choose the right one for your book.',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      date: 'May 2, 2025',
      author: 'The PublishJockey Team',
      authorAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
      category: 'Publishing Formats',
      readTime: '7 min read'
    }
  ];

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

        {/* Newsletter Signup */}
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
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1f2937', color: 'white', py: 4, mt: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box component="img" src={PublishJockeyLogo} alt="Publish Jockey Logo" sx={{ height: '50px', mb: 2 }} />
              <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: '300px' }}>
                From manuscript to masterpiece—with clarity, simplicity, and freedom.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Product
                  </Typography>
                  <Box component="nav">
                    <Typography component={RouterLink} to="/#features" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Features
                    </Typography>
                    <Typography component={RouterLink} to="/#pricing" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Pricing
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Company
                  </Typography>
                  <Box component="nav">
                    <Typography component={RouterLink} to="/about" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      About
                    </Typography>
                    <Typography component={RouterLink} to="/blog" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Blog
                    </Typography>
                    <Typography component={RouterLink} to="/contact" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Contact
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Resources
                  </Typography>
                  <Box component="nav">
                    <Typography component="a" href="#" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Help Center
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Legal
                  </Typography>
                  <Box component="nav">
                    <Typography component="a" href="/privacy" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Privacy
                    </Typography>
                    <Typography component="a" href="/terms" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mb: 1, textDecoration: 'none', '&:hover': { color: 'white' } }}>
                      Terms
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center' }}>
            © {new Date().getFullYear()} PublishJockey. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Blog; 