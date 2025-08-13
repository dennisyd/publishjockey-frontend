import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  FormControl, 
  FormControlLabel, 
  Switch, 
  Select, 
  MenuItem, 
  InputLabel,
  Button,
  TextField,
  Alert,
  Stack,
  SelectChangeEvent,
  Container
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import { ENV } from '../config/env';

interface ProfileUpdateResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState('16');
  const [editorTheme, setEditorTheme] = useState('light');
  const [autoSave, setAutoSave] = useState(true);
  const [autosaveInterval, setAutosaveInterval] = useState('5');
  const [defaultExportFormat, setDefaultExportFormat] = useState('pdf');
  
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.put<ProfileUpdateResponse>(`${ENV.API_URL}/users/profile`, {
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
  
  const handleFontSizeChange = (event: SelectChangeEvent) => {
    setEditorFontSize(event.target.value as string);
  };
  
  const handleThemeChange = (event: SelectChangeEvent) => {
    setEditorTheme(event.target.value as string);
  };
  
  const handleExportFormatChange = (event: SelectChangeEvent) => {
    setDefaultExportFormat(event.target.value as string);
  };
  
  const handleAutosaveIntervalChange = (event: SelectChangeEvent) => {
    setAutosaveInterval(event.target.value as string);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      
      {/* Messages */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Stack>
      
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3
      }}>
        {/* Account Settings */}
        <Box>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Account Settings</Typography>
            <Divider sx={{ mb: 3 }} />
            
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
                sx={{ borderRadius: '8px' }}
              >
                Update Profile
              </Button>
            </Box>
          </Paper>
        </Box>
        
        {/* Editor Settings */}
        <Box>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Editor Settings</Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="font-size-label">Font Size</InputLabel>
                <Select
                  labelId="font-size-label"
                  id="font-size-select"
                  value={editorFontSize}
                  label="Font Size"
                  onChange={handleFontSizeChange}
                  size="small"
                >
                  <MenuItem value="12">12px</MenuItem>
                  <MenuItem value="14">14px</MenuItem>
                  <MenuItem value="16">16px</MenuItem>
                  <MenuItem value="18">18px</MenuItem>
                  <MenuItem value="20">20px</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="theme-label">Editor Theme</InputLabel>
                <Select
                  labelId="theme-label"
                  id="theme-select"
                  value={editorTheme}
                  label="Editor Theme"
                  onChange={handleThemeChange}
                  size="small"
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="sepia">Sepia</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel 
                control={
                  <Switch 
                    checked={darkMode} 
                    onChange={(e) => setDarkMode(e.target.checked)} 
                  />
                } 
                label="Dark Mode (App Theme)" 
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel 
                control={
                  <Switch 
                    checked={autoSave} 
                    onChange={(e) => setAutoSave(e.target.checked)} 
                  />
                } 
                label="Auto Save" 
                sx={{ mb: 2, display: 'block' }}
              />
              
              {autoSave && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="autosave-label">Autosave Interval</InputLabel>
                  <Select
                    labelId="autosave-label"
                    id="autosave-select"
                    value={autosaveInterval}
                    label="Autosave Interval"
                    onChange={handleAutosaveIntervalChange}
                    size="small"
                  >
                    <MenuItem value="1">Every 1 minute</MenuItem>
                    <MenuItem value="5">Every 5 minutes</MenuItem>
                    <MenuItem value="10">Every 10 minutes</MenuItem>
                    <MenuItem value="15">Every 15 minutes</MenuItem>
                    <MenuItem value="30">Every 30 minutes</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          </Paper>
        </Box>
        
        {/* Export Settings */}
        <Box sx={{ gridColumn: { xs: 'auto', md: 'span 2' } }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Export Settings</Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3
            }}>
              <Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="export-format-label">Default Export Format</InputLabel>
                  <Select
                    labelId="export-format-label"
                    id="export-format-select"
                    value={defaultExportFormat}
                    label="Default Export Format"
                    onChange={handleExportFormatChange}
                    size="small"
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="docx">DOCX</MenuItem>
                    <MenuItem value="epub">EPUB</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box>
                <FormControlLabel 
                  control={<Switch defaultChecked />} 
                  label="Include Table of Contents" 
                />
              </Box>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ borderRadius: '8px' }}
              >
                Save Settings
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Settings; 