import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Button, 
  TextField, 
  Alert, 
  Container, 
  Stack 
} from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import SaveIcon from '@mui/icons-material/Save';

const AccountSettings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(name);
      setSuccessMessage('Profile updated successfully!');
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }} elevation={2}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Account Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={2} sx={{ mb: 3 }}>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Stack>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Subscription Plan
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {user?.subscription ? user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1) : 'Free'}
          </Typography>
          {user?.subscriptionExpires && (
            <Typography variant="body2" color="text.secondary">
              Expires: {new Date(user.subscriptionExpires).toLocaleDateString()}
            </Typography>
          )}
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Email Address
          </Typography>
          <Typography variant="body1">{user?.email}</Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Display Name
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />} 
            onClick={handleUpdateProfile}
            sx={{ borderRadius: '8px', fontWeight: 600 }}
          >
            Update Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AccountSettings; 