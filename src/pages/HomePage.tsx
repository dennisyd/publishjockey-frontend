import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LockIcon from '@mui/icons-material/Lock';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          pt: 8,
          pb: 6,
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          color="text.primary"
          gutterBottom
        >
          PublishJockey
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Transform your manuscript into a professionally formatted book
        </Typography>
        <Box
          sx={{
            pt: 4,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
          }}
        >
          {isAuthenticated ? (
            <>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/dashboard"
                size="large"
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                component={Link} 
                to="/profile"
                size="large"
              >
                Your Profile
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/register"
                size="large"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                component={Link} 
                to="/login"
                size="large"
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Typography
          component="h2"
          variant="h4"
          color="text.primary"
          align="center"
          gutterBottom
        >
          Key Features
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4,
          mt: 2
        }}>
          <Box>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
              }}
              elevation={2}
            >
              <MenuBookIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Beautiful Typography
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ flex: 1 }}>
                Professional typesetting powered by LaTeX creates beautiful books with proper kerning, ligatures and page layouts.
              </Typography>
            </Paper>
          </Box>
          <Box>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
              }}
              elevation={2}
            >
              <NoteAddIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Simple Markdown
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ flex: 1 }}>
                Write using simple markdown syntax and let us handle the complexity of formatting for print and e-readers.
              </Typography>
            </Paper>
          </Box>
          <Box>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
              }}
              elevation={2}
            >
              <LockIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Secure Storage
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ flex: 1 }}>
                Your manuscripts are securely stored in the cloud with regular backups.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
      
      {/* Call to Action */}
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Paper
          sx={{
            p: 6,
            borderRadius: 2,
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
          }}
          elevation={3}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to start your writing journey?
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
            Join thousands of authors who have already simplified their publishing process.
          </Typography>
          {isAuthenticated ? (
            <Button 
              variant="contained" 
              color="secondary" 
              component={Link} 
              to="/dashboard"
              size="large"
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="secondary" 
              component={Link} 
              to="/register"
              size="large"
            >
              Create Your Free Account
            </Button>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage; 