import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  TextField, 
  Button, 
  Divider, 
  Alert, 
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import { ENV } from '../config/env';

interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  user?: {
    name: string;
    email: string;
  };
}

const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  const { settings, updateSettings, saveSettings } = useSettings();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [editorFontSize, setEditorFontSize] = useState(settings.fontSize);
  const [editorTheme, setEditorTheme] = useState(settings.theme);
  const [autoSave, setAutoSave] = useState(settings.autoSave);
  const [autosaveInterval, setAutosaveInterval] = useState(settings.autosaveInterval);
  const [defaultExportFormat, setDefaultExportFormat] = useState(settings.defaultExportFormat);
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    const newSize = event.target.value as string;
    setEditorFontSize(newSize);
    updateSettings({ fontSize: newSize });
  };
  
  const handleThemeChange = (event: SelectChangeEvent) => {
    const newTheme = event.target.value as string;
    setEditorTheme(newTheme);
    updateSettings({ theme: newTheme });
  };
  
  const handleExportFormatChange = (event: SelectChangeEvent) => {
    const newFormat = event.target.value as string;
    setDefaultExportFormat(newFormat);
    updateSettings({ defaultExportFormat: newFormat });
  };
  
  const handleAutosaveIntervalChange = (event: SelectChangeEvent) => {
    const newInterval = event.target.value as string;
    setAutosaveInterval(newInterval);
    updateSettings({ autosaveInterval: newInterval });
  };

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    updateSettings({ darkMode: checked });
  };

  const handleAutoSaveChange = (checked: boolean) => {
    setAutoSave(checked);
    updateSettings({ autoSave: checked });
  };

  const handleSaveSettings = () => {
    saveSettings();
    setSuccessMessage('Settings saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Language Support Disclaimer */}
      <Alert 
        severity="info" 
        sx={{ 
          mb: 4, 
          p: 3,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          🌍 Language Support Notice
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Important:</strong> Publish Jockey supports multiple languages, but users have important responsibilities:
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Content Responsibility:</strong> You are responsible for ensuring your content is appropriate, accurate, and compliant with all applicable laws and regulations.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>RTL Languages (Arabic, Hebrew, Yiddish):</strong> For best results, use pure language content only. Mixed content may not render correctly.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Professional Review:</strong> For important publications, we recommend having your content reviewed by native speakers or professional translators.
          </Typography>
          <Typography component="li" variant="body2">
            <strong>Testing:</strong> Always test your exports thoroughly before publishing to ensure proper rendering.
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          By using our language features, you acknowledge these limitations and accept responsibility for your content's appropriateness and accuracy.
        </Typography>
      </Alert>

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
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="theme-label">Theme</InputLabel>
                <Select
                  labelId="theme-label"
                  id="theme-select"
                  value={editorTheme}
                  label="Theme"
                  onChange={handleThemeChange}
                  size="small"
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ mb: 3 }}>
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
                  <MenuItem value="epub">EPUB</MenuItem>
                  <MenuItem value="html">HTML</MenuItem>
                  <MenuItem value="docx">DOCX</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoSave}
                    onChange={(e) => handleAutoSaveChange(e.target.checked)}
                  />
                }
                label="Auto Save"
              />
              {autoSave && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="autosave-interval-label">Auto Save Interval</InputLabel>
                  <Select
                    labelId="autosave-interval-label"
                    id="autosave-interval-select"
                    value={autosaveInterval}
                    label="Auto Save Interval"
                    onChange={handleAutosaveIntervalChange}
                    size="small"
                  >
                    <MenuItem value="1">1 minute</MenuItem>
                    <MenuItem value="5">5 minutes</MenuItem>
                    <MenuItem value="10">10 minutes</MenuItem>
                    <MenuItem value="30">30 minutes</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={(e) => handleDarkModeChange(e.target.checked)}
                  />
                }
                label="Dark Mode"
              />
            </Box>
            
            <Button 
              variant="contained" 
              onClick={handleSaveSettings}
              fullWidth
              sx={{ borderRadius: '8px' }}
            >
              Save Settings
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Settings; 