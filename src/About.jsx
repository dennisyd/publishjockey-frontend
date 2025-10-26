import React from 'react'; // YD Dennis
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Button, 
  Card, 
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CodeIcon from '@mui/icons-material/Code';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';


// Timeline step icons
const timelineIcons = [
  <span role="img" aria-label="Writing">📝</span>,
  <CodeIcon fontSize="large" color="primary" />,
  <LightbulbIcon fontSize="large" color="primary" />,
  <RocketLaunchIcon fontSize="large" color="primary" />,
];

const About = () => {
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
      {/* Header */}
      <Box 
        component="header"
        sx={{ 
          bgcolor: 'white', 
          py: 2, 
          borderBottom: '1px solid #eaeaea',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Container maxWidth="lg">
          {/* Logo removed as requested */}
        </Container>
      </Box>

      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 8, md: 12 }, 
          pb: { xs: 6, md: 8 },
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          color: 'white',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1"
            sx={{ 
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Built by an Author, for Authors
          </Typography>
          <Typography 
            variant="h5"
            sx={{ 
              fontWeight: 400,
              mb: 5,
              opacity: 0.9,
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            PublishJockey was born from a $500 lesson.
          </Typography>
        </Container>
        {/* Decorative elements */}
        <Box 
          sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            top: '-100px',
            right: '5%',
            zIndex: 0
          }}
        />
      </Box>

      {/* The Story Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography 
          variant="h3" 
          component="h2"
          sx={{ 
            fontWeight: 700,
            mb: 6,
            textAlign: 'center'
          }}
        >
          The Story
        </Typography>

        <Grid container spacing={4} alignItems="stretch">
          {/* Left side: Narrative */}
          <Grid item xs={12} md={7}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                height: '100%',
                border: '1px solid #eaeaea',
                borderRadius: '12px'
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                From Frustrated Author to Founder
              </Typography>
              
              <Typography paragraph sx={{ mb: 2 }}>
                A little over a year ago, I published my first book on Amazon KDP. Like many first-time authors, I wasn't sure where to begin—so I hired someone to help. The cost? About $500. Most of that fee went toward generating a polished PDF file suitable for upload to Amazon. They also assisted with the book cover, but in hindsight, I could have outsourced that part for under $50.
              </Typography>

              <Typography paragraph sx={{ mb: 2 }}>
                Fast forward to recently—my spouse had written a new book, and we were back at square one. But this time, I wasn't willing to spend another $500.
              </Typography>

              <Typography paragraph sx={{ mb: 3 }}>
                As a programmer, I decided to code my way through the publishing process. I wrote a few Python scripts to handle formatting and document generation. It wasn't easy. Getting everything to work smoothly took time and a lot of troubleshooting. But once it clicked, a lightbulb went off.
              </Typography>

                              <Typography 
                paragraph 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '1.1rem',
                  p: 2,
                  borderLeft: '4px solid #4F46E5',
                  bgcolor: 'rgba(79, 70, 229, 0.08)',
                  borderRadius: '0 4px 4px 0'
                }}
              >
                <span role="img" aria-label="Books">📚</span> With over a million books published on Amazon each year—not to mention platforms like Google Books—why wasn't there a streamlined, affordable tool for authors like us?
              </Typography>

              <Typography variant="h6" sx={{ mt: 3, fontWeight: 600 }}>
                So I built one.
              </Typography>
            </Paper>
          </Grid>

          {/* Right side: Visual timeline */}
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                height: '100%',
                border: '1px solid #eaeaea',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ 
                  position: 'absolute', 
                  left: '24px', 
                  top: '24px', 
                  bottom: '24px', 
                  width: '2px', 
                  bgcolor: '#e0e0e0' 
                }} />
                
                {[
                  { title: 'First Book', text: 'Published on Amazon KDP but paid $500 for formatting' },
                  { title: 'New Challenge', text: 'My spouse wrote a book, needed a more affordable solution' },
                  { title: 'The Coding Journey', text: 'Created Python scripts to handle the formatting process' },
                  { title: 'PublishJockey Born', text: 'Built a platform to help other authors avoid the same struggles' }
                ].map((step, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 4, position: 'relative' }}>
                    <Box sx={{ 
                      width: 50, 
                      height: 50, 
                      borderRadius: '50%', 
                      bgcolor: 'white',
                      border: '2px solid #4F46E5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1
                    }}>
                      {timelineIcons[index]}
                    </Box>
                    <Box sx={{ ml: 3, flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {step.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {step.text}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* The Solution Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2"
            sx={{ 
              fontWeight: 700,
              mb: 2,
              textAlign: 'center'
            }}
          >
            Welcome to PublishJockey
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              textAlign: 'center', 
              mb: 6,
              maxWidth: '800px',
              mx: 'auto',
              color: 'text.secondary',
              fontWeight: 400
            }}
          >
            A smart SaaS platform that empowers independent authors
          </Typography>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            {[
              { title: 'Upload & Import', text: 'Upload chapters from Google Drive, Word, or Markdown files with ease' },
              { title: 'Organize Content', text: 'Organize your book section-by-section with our intuitive interface' },
              { title: 'Export Anywhere', text: 'Export your finished work as PDF, EPUB, or Word with clean formatting' },
              { title: 'Pro Quality', text: 'Enjoy pro-level publishing without the pro-level cost or complexity' }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    border: '1px solid #eaeaea',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px -10px rgba(79, 70, 229, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '12px',
                        bgcolor: 'rgba(79, 70, 229, 0.1)',
                        mb: 2
                      }}
                    >
                      <CheckCircleIcon color="primary" fontSize="large" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box 
            sx={{ 
              bgcolor: 'rgba(79, 70, 229, 0.05)',
              borderRadius: '12px',
              p: 4,
              textAlign: 'center',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              "There are other publishing tools—but none that do exactly what we do. PublishJockey fills that gap for independent authors, educators, and creators who want beautiful, ready-to-publish books without the headache."
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Author Impact Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
              Our Mission
            </Typography>
            <Typography paragraph sx={{ mb: 4 }}>
              We're here to help you go from manuscript to masterpiece—with clarity, simplicity, and the freedom to focus on what you do best: writing.
            </Typography>
            
            <List>
              {[
                'Make professional publishing accessible to everyone',
                'Eliminate technical barriers between authors and readers',
                'Provide beautiful formatting without expensive designers',
                'Support the independent publishing revolution'
              ].map((item, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                bgcolor: 'white', 
                p: 4, 
                borderRadius: '12px',
                border: '1px solid #eaeaea',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2, 
                  background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Join Our Growing Community
              </Typography>
              <Typography paragraph sx={{ mb: 4 }}>
                Connect with like-minded authors who are taking control of their publishing process
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                href="/register"
                sx={{ 
                  borderRadius: '50px',
                  px: 5,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(79, 70, 229, 0.23)',
                    bgcolor: '#4338ca'
                  }
                }}
              >
                Start Your Publishing Journey
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: '#4F46E5', 
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2"
            sx={{ 
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '2rem', md: '2.75rem' }
            }}
          >
            Try PublishJockey Free Today
          </Typography>
          <Typography 
            sx={{ 
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              opacity: 0.9,
              fontSize: '1.1rem'
            }}
          >
            Join thousands of authors who are taking control of their publishing process
          </Typography>
          <Button 
            variant="contained" 
            color="secondary"
            size="large"
            href="/register"
            sx={{ 
              borderRadius: '50px',
              px: 5,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              bgcolor: 'white',
              color: '#4F46E5',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

    </Box>
  );
};

export default About; 