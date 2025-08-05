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
import { useAuth } from '../contexts/AuthContext';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import ImageUsageDisplay from '../components/ImageUsageDisplay';
import ImageSlotPurchaseModal from '../components/ImageSlotPurchaseModal';

// Types
interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const AccountSettings: React.FC = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showImagePurchaseModal, setShowImagePurchaseModal] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.put<ProfileUpdateResponse>('http://localhost:3001/api/users/profile', {
        name
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Update localStorage with new user data
        const updatedUser = { ...currentUser, name };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setSuccessMessage('Profile updated successfully!');
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to update profile. Please try again.');
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
            {currentUser?.subscription ? currentUser.subscription.charAt(0).toUpperCase() + currentUser.subscription.slice(1) : 'Free'}
          </Typography>
          {currentUser?.subscriptionExpires && (
            <Typography variant="body2" color="text.secondary">
              Expires: {new Date(currentUser.subscriptionExpires).toLocaleDateString()}
            </Typography>
          )}
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Image Usage
          </Typography>
          <ImageUsageDisplay 
            onUpgradeClick={() => setShowImagePurchaseModal(true)}
            compact={false}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Email Address
          </Typography>
          <Typography variant="body1">{currentUser?.email}</Typography>
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
      
      {/* Image Slot Purchase Modal */}
      <ImageSlotPurchaseModal
        open={showImagePurchaseModal}
        onClose={() => setShowImagePurchaseModal(false)}
        onSuccess={() => {
          setShowImagePurchaseModal(false);
          // Refresh the page to update image usage stats
          window.location.reload();
        }}
      />
    </Container>
  );
};

export default AccountSettings; 