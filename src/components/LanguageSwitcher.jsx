import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

const LanguageSwitcher = ({ variant = 'select', sx = {} }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'yi', name: 'יידיש', flag: '🇮🇱' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
  ];

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    
    // Update document direction for RTL languages
    if (newLang === 'ar' || newLang === 'he' || newLang === 'yi') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = newLang;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = newLang;
    }
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
        <LanguageIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        <Select
          value={i18n.language}
          onChange={handleLanguageChange}
          size="small"
          sx={{ 
            minWidth: 60,
            '& .MuiSelect-select': { 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              py: 0.5
            }
          }}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2">{lang.flag}</Typography>
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {lang.code.toUpperCase()}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </Box>
    );
  }

  return (
    <FormControl size="small" sx={{ minWidth: 120, ...sx }}>
      <InputLabel>Language</InputLabel>
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        label="Language"
        startAdornment={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
            <LanguageIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2">{currentLanguage.flag}</Typography>
          </Box>
        }
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">{lang.flag}</Typography>
              <Typography variant="body2">{lang.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
