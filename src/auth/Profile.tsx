import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

const Profile: React.FC = () => {
  const { user, loading, error, updateProfile, clearError } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [editing, setEditing] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      setFormError('Name cannot be empty');
      return;
    }
    
    // Clear any previous errors
    setFormError('');
    clearError();
    setSuccess(false);
    
    try {
      await updateProfile(name);
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      // Error will be handled by the auth context
      console.error('Profile update failed:', err);
    }
  };

  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <Container component="main" maxWidth="md">
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 2, 
            borderRadius: '50%', 
            mb: 1.5 
          }}>
            <PersonIcon fontSize="large" />
          </Box>
          <Typography component="h1" variant="h5">
            Your Profile
          </Typography>
        </Box>
        
        {(error || formError) && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {formError || error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            Profile updated successfully!
          </Alert>
        )}
        
        <Card sx={{ width: '100%', mb: 4 }}>
          <CardContent>
            <div style={{ marginBottom: '16px' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Account Information
              </Typography>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: '1 1 30%', minWidth: '200px' }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {user.email}
                </Typography>
              </div>
              
              <div style={{ flex: '1 1 30%', minWidth: '200px' }}>
                <Typography variant="body2" color="text.secondary">
                  Subscription
                </Typography>
                <Chip 
                  label={user.subscription === 'free' ? 'Free' : 
                         user.subscription === 'basic' ? 'Basic' : 'Premium'} 
                  color={user.subscription === 'free' ? 'default' : 
                         user.subscription === 'basic' ? 'primary' : 'secondary'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </div>
              
              <div style={{ flex: '1 1 30%', minWidth: '200px' }}>
                <Typography variant="body2" color="text.secondary">
                  Subscription Expires
                </Typography>
                <Typography variant="body1">
                  {formatDate(user.subscriptionExpires)}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Divider sx={{ width: '100%', mb: 4 }} />
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <div style={{ marginBottom: '16px' }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Personal Information
            </Typography>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ flex: editing ? '1 1 100%' : '1 1 70%', minWidth: '200px' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Name
              </Typography>
              {editing ? (
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  variant="outlined"
                  size="small"
                />
              ) : (
                <Typography variant="body1">
                  {user.name}
                </Typography>
              )}
            </div>
            
            {editing ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px', width: '100%' }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CloseIcon />}
                  onClick={() => {
                    setEditing(false);
                    setName(user.name);
                    setFormError('');
                    clearError();
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<DoneIcon />}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
              </div>
            ) : (
              <div style={{ flex: '1 1 30%', display: 'flex', justifyContent: 'flex-end', minWidth: '100px' }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 