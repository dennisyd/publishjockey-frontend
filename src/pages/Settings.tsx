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
  Container,
  Chip,
  Grid
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import SaveIcon from '@mui/icons-material/Save';
import LanguageIcon from '@mui/icons-material/Language';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import axios from 'axios';
import { ENV } from '../config/env';
import LanguageSwitcher from '../components/LanguageSwitcher';

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
  const { settings, updateSettings, saveSettings } = useSettings();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [editorFontSize, setEditorFontSize] = useState(settings.fontSize);
  const [editorTheme, setEditorTheme] = useState(settings.theme);
  const [autoSave, setAutoSave] = useState(settings.autoSave);
  const [autosaveInterval, setAutosaveInterval] = useState(settings.autosaveInterval);
  const [defaultExportFormat, setDefaultExportFormat] = useState(settings.defaultExportFormat);
  const [selectedFont, setSelectedFont] = useState(settings.exportFontFamily || 'Liberation Serif');
  const [selectedLanguage, setSelectedLanguage] = useState(settings.documentLanguage || 'en');

  // Font options organized by language
  const fontOptions = {
    // Latin-based languages (English, Spanish, French, German, Italian)
    latin: [
      { value: 'Liberation Serif', label: 'Liberation Serif (Recommended)', description: 'Linux equivalent of Times New Roman' },
      { value: 'DejaVu Serif', label: 'DejaVu Serif', description: 'Excellent Unicode support' },
      { value: 'Liberation Sans', label: 'Liberation Sans', description: 'Linux equivalent of Arial' },
      { value: 'DejaVu Sans', label: 'DejaVu Sans', description: 'Clean sans-serif font' }
    ],
    // Chinese
    chinese: [
      { value: 'Noto Sans CJK SC', label: 'Noto Sans CJK SC (Recommended)', description: 'Simplified Chinese' },
      { value: 'Noto Sans CJK TC', label: 'Noto Sans CJK TC', description: 'Traditional Chinese' }
    ],
    // Japanese
    japanese: [
      { value: 'Noto Sans CJK JP', label: 'Noto Sans CJK JP (Recommended)', description: 'Japanese' }
    ],
    // Korean
    korean: [
      { value: 'Noto Sans CJK KR', label: 'Noto Sans CJK KR (Recommended)', description: 'Korean' }
    ],
    // Arabic
    arabic: [
      { value: 'Noto Sans Arabic', label: 'Noto Sans Arabic (Recommended)', description: 'Arabic script' }
    ],
    // Russian
    russian: [
      { value: 'Liberation Serif', label: 'Liberation Serif (Recommended)', description: 'Good Cyrillic support' },
      { value: 'DejaVu Serif', label: 'DejaVu Serif', description: 'Excellent Cyrillic support' }
    ]
  };

  // Language to font category mapping
  const languageFontMap = {
    en: 'latin',
    es: 'latin',
    fr: 'latin',
    de: 'latin',
    it: 'latin',
    zh: 'chinese',
    ja: 'japanese',
    ko: 'korean',
    ar: 'arabic',
    ru: 'russian'
  };

  // Get recommended fonts for current language
  const getRecommendedFonts = (languageCode: string) => {
    if (!languageCode) return fontOptions.latin;
    const fontCategory = languageFontMap[languageCode as keyof typeof languageFontMap] || 'latin';
    return fontOptions[fontCategory as keyof typeof fontOptions] || fontOptions.latin;
  };
  
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

  const handleFontChange = (event: SelectChangeEvent) => {
    const newFont = event.target.value as string;
    setSelectedFont(newFont);
    updateSettings({ exportFontFamily: newFont });
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    const newLanguage = event.target.value as string;
    setSelectedLanguage(newLanguage);
    updateSettings({ documentLanguage: newLanguage });
    
    // Auto-select recommended font for the language
    const recommendedFonts = getRecommendedFonts(newLanguage);
    if (recommendedFonts.length > 0) {
      const recommendedFont = recommendedFonts[0].value;
      setSelectedFont(recommendedFont);
      updateSettings({ exportFontFamily: recommendedFont });
    }
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
        
        {/* Language & Font Settings */}
        <Box>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              <LanguageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Language & Font Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Interface Language
              </Typography>
              <LanguageSwitcher variant="select" sx={{ mb: 2 }} />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Document Language
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="document-language-label">Document Language</InputLabel>
                <Select
                  labelId="document-language-label"
                  id="document-language-select"
                  value={selectedLanguage}
                  label="Document Language"
                  onChange={handleLanguageChange}
                  size="small"
                >
                  <MenuItem value="en">🇺🇸 English</MenuItem>
                  <MenuItem value="es">🇪🇸 Español</MenuItem>
                  <MenuItem value="fr">🇫🇷 Français</MenuItem>
                  <MenuItem value="de">🇩🇪 Deutsch</MenuItem>
                  <MenuItem value="it">🇮🇹 Italiano</MenuItem>
                  <MenuItem value="ru">🇷🇺 Русский</MenuItem>
                  <MenuItem value="zh">🇨🇳 中文 (Simplified)</MenuItem>
                  <MenuItem value="ja">🇯🇵 日本語</MenuItem>
                  <MenuItem value="ko">🇰🇷 한국어</MenuItem>
                  <MenuItem value="ar">🇸🇦 العربية</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                <FontDownloadIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                Recommended Font for {selectedLanguage?.toUpperCase() || 'EN'}
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="font-family-label">Font Family</InputLabel>
                <Select
                  labelId="font-family-label"
                  id="font-family-select"
                  value={selectedFont}
                  label="Font Family"
                  onChange={handleFontChange}
                  size="small"
                >
                  {getRecommendedFonts(selectedLanguage).map((font) => (
                    <MenuItem key={font.value} value={font.value}>
                      <Box>
                        <Typography variant="body2" fontWeight={font.value.includes('Recommended') ? 600 : 400}>
                          {font.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {font.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  This font will be used for document exports in {selectedLanguage?.toUpperCase() || 'EN'}
                </Typography>
              </Box>
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
                    onChange={(e) => handleDarkModeChange(e.target.checked)} 
                  />
                } 
                label="Dark Mode (App Theme)" 
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel 
                control={
                  <Switch 
                    checked={autoSave} 
                    onChange={(e) => handleAutoSaveChange(e.target.checked)} 
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
                onClick={handleSaveSettings}
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