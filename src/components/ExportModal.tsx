import React, { useState, useEffect } from 'react'; // Yancy Dennis
import { realImageService } from '../services/realImageService';
import { http } from '../services/http';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import Alert from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from 'react-i18next';

import ExportInstructionsTabs from './ExportInstructionsTabs';

// Import paper sizes
// These should match the sizes in ProjectWorkspace.tsx
const paperbackSizes = [
  { value: '6x9', label: '6" x 9" (15.24 x 22.86 cm)' },
  { value: '5x8', label: '5" x 8" (12.7 x 20.32 cm)' },
  { value: '5.06x7.81', label: '5.06" x 7.81" (12.85 x 19.84 cm)' },
  { value: '5.25x8', label: '5.25" x 8" (13.34 x 20.32 cm)' },
  { value: '5.5x8.5', label: '5.5" x 8.5" (13.97 x 21.59 cm)' },
  { value: '6.14x9.21', label: '6.14" x 9.21" (15.6 x 23.39 cm)' },
  { value: '6.69x9.61', label: '6.69" x 9.61" (16.99 x 24.41 cm)' },
  { value: '7x10', label: '7" x 10" (17.78 x 25.4 cm)' },
  { value: '7.44x9.69', label: '7.44" x 9.69" (18.9 x 24.61 cm)' },
  { value: '7.5x9.25', label: '7.5" x 9.25" (19.05 x 23.5 cm)' },
  { value: '8x10', label: '8" x 10" (20.32 x 25.4 cm)' },
  { value: '8.5x11', label: '8.5" x 11" (21.59 x 27.94 cm)' },
];

const hardcoverSizes = [
  { value: '6x9', label: '6" x 9" (15.24 x 22.86 cm)' },
  { value: '5.5x8.5', label: '5.5" x 8.5" (13.97 x 21.59 cm)' },
  { value: '6.14x9.21', label: '6.14" x 9.21" (15.6 x 23.39 cm)' },
  { value: '7x10', label: '7" x 10" (17.78 x 25.4 cm)' },
  { value: '8.25x11', label: '8.25" x 11" (20.96 x 27.94 cm)' },
  { value: '8.5x11', label: '8.5" x 11" (21.59 x 27.94 cm)' },
];

// Font options for different platforms
const windowsFonts = [
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
];

// Language-specific font recommendations based on system analysis
const fontRecommendations = {
  // English - Top 10 Book Fonts
  'en': [
    { value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' },
    { value: 'Nimbus Roman', label: 'Nimbus Roman (Book Quality)' },
    { value: 'Latin Modern Roman', label: 'Latin Modern Roman (Professional)' },
    { value: 'TeX Gyre Pagella', label: 'TeX Gyre Pagella' },
    { value: 'TeX Gyre Termes', label: 'TeX Gyre Termes' },
    { value: 'Liberation Serif', label: 'Liberation Serif (Latin/Cyrillic)' },
    { value: 'Noto Serif', label: 'Noto Serif' },
    { value: 'Gentium Plus', label: 'Gentium Plus' },
    { value: 'DejaVu Serif', label: 'DejaVu Serif (Latin/Cyrillic)' },
    { value: 'Charis SIL', label: 'Charis SIL' }
  ],
  
  // African Languages (Latin script)
  'sw': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'ha': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'yo': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'zu': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'xh': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'ig': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'ki': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'lg': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'sn': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'st': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'nso': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'tn': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'rw': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'rn': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'mg': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  
  // European Languages (Latin script)
  'fr': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'fr-FR': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'fr-CA': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'fr-BE': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'fr-CH': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'fr-SN': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'fr-CI': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'fr-MA': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'fr-HT': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'de': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'de-DE': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'de-AT': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'de-CH': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'es': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'es-ES': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'es-MX': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'es-AR': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'es-CO': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'es-CL': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'es-PE': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'es-VE': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'es-PR': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'it': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'pt': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'pt-AO': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'pt-MZ': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'pt-CV': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'nl': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'da': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'sv': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'no': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'fi': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'et': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'gl': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'ca': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'oc': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'is': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  
  // Greek
  'el': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'GFS Artemisia', label: 'GFS Artemisia' }, { value: 'Noto Serif', label: 'Noto Serif' }],
  
  // Cyrillic Languages
  'ru': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'DejaVu Serif', label: 'DejaVu Serif' }],
  'mk': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'DejaVu Serif', label: 'DejaVu Serif' }],
  'sr': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'DejaVu Serif', label: 'DejaVu Serif' }],
  
  // Central/Eastern European
  'pl': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'cs': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'sk': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'hr': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'hu': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'ro': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'lt': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'lv': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'sl': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  'tr': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Liberation Serif', label: 'Liberation Serif' }],
  
  // Indian Languages (Devanagari)
  'hi': [{ value: 'Noto Serif Devanagari', label: 'Noto Serif Devanagari (Recommended)' }, { value: 'Noto Sans Devanagari UI', label: 'Noto Sans Devanagari UI' }, { value: 'FreeSerif', label: 'FreeSerif' }],
  
  // Bengali
  'bn': [{ value: 'Noto Serif Bengali', label: 'Noto Serif Bengali (Recommended)' }, { value: 'Noto Sans Bengali UI', label: 'Noto Sans Bengali UI' }, { value: 'FreeSerif', label: 'FreeSerif' }],
  
  // Tamil
  'ta': [{ value: 'Noto Serif Tamil', label: 'Noto Serif Tamil (Recommended)' }, { value: 'Noto Sans Tamil UI', label: 'Noto Sans Tamil UI' }, { value: 'FreeSerif', label: 'FreeSerif' }],
  
  // Telugu
  'te': [{ value: 'Noto Serif Telugu', label: 'Noto Serif Telugu (Recommended)' }, { value: 'Noto Sans Telugu UI', label: 'Noto Sans Telugu UI' }, { value: 'FreeSerif', label: 'FreeSerif' }],
  
  // Kannada
  'kn': [{ value: 'Noto Serif Kannada', label: 'Noto Serif Kannada (Recommended)' }, { value: 'Noto Sans Kannada UI', label: 'Noto Sans Kannada UI' }, { value: 'FreeSerif', label: 'FreeSerif' }],
  
  // Malayalam
  'ml': [{ value: 'Noto Serif Malayalam', label: 'Noto Serif Malayalam (Recommended)' }, { value: 'Noto Sans Malayalam UI', label: 'Noto Sans Malayalam UI' }, { value: 'FreeSerif', label: 'FreeSerif' }],
  
  // Gujarati
  'gu': [{ value: 'Noto Serif Gujarati', label: 'Noto Serif Gujarati (Recommended)' }, { value: 'Noto Sans Gujarati UI', label: 'Noto Sans Gujarati UI' }, { value: 'FreeSerif', label: 'FreeSerif' }],
  
  // Oriya
  'or': [{ value: 'Noto Sans Oriya UI', label: 'Noto Sans Oriya UI (Recommended)' }, { value: 'Noto Sans Oriya', label: 'Noto Sans Oriya' }, { value: 'FreeSerif', label: 'FreeSerif' }],
  
  // Punjabi (Gurmukhi)
  'pa': [{ value: 'Noto Serif Gurmukhi', label: 'Noto Serif Gurmukhi (Recommended)' }, { value: 'Noto Sans Gurmukhi UI', label: 'Noto Sans Gurmukhi UI' }, { value: 'FreeSerif', label: 'FreeSerif' }],
  
  // Southeast Asian Languages
  'vi': [{ value: 'Linux Libertine O', label: 'Linux Libertine O (Recommended)' }, { value: 'Noto Serif', label: 'Noto Serif' }, { value: 'Gentium Plus', label: 'Gentium Plus' }],
  'id': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'ms': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }],
  'tl': [{ value: 'Noto Serif', label: 'Noto Serif (Recommended)' }, { value: 'Charis SIL', label: 'Charis SIL' }, { value: 'Linux Libertine O', label: 'Linux Libertine O' }]
};

// Get font recommendations for a specific language
const getFontRecommendations = (languageCode: string) => {
  return fontRecommendations[languageCode] || fontRecommendations['en']; // Default to English fonts
};

// Language options for document export
// Note: RTL languages (Arabic, Hebrew, Yiddish) temporarily disabled for launch
const languageOptions = [
  { value: 'en', label: '🇺🇸 English', description: 'English' },
  { value: 'es-ES', label: '🇪🇸 Español (España)', description: 'Spanish (Spain)' },
  { value: 'es-MX', label: '🇲🇽 Español (México)', description: 'Spanish (Mexico)' },
  { value: 'es-AR', label: '🇦🇷 Español (Argentina)', description: 'Spanish (Argentina)' },
  { value: 'es-CO', label: '🇨🇴 Español (Colombia)', description: 'Spanish (Colombia)' },
  { value: 'es-CL', label: '🇨🇱 Español (Chile)', description: 'Spanish (Chile)' },
  { value: 'es-PE', label: '🇵🇪 Español (Perú)', description: 'Spanish (Peru)' },
  { value: 'es-VE', label: '🇻🇪 Español (Venezuela)', description: 'Spanish (Venezuela)' },
  { value: 'es-PR', label: '🇵🇷 Español (Puerto Rico)', description: 'Spanish (Puerto Rico)' },
  { value: 'fr-FR', label: '🇫🇷 Français (France)', description: 'French (France)' },
  { value: 'fr-CA', label: '🇨🇦 Français (Canada)', description: 'French (Canada)' },
  { value: 'fr-BE', label: '🇧🇪 Français (Belgique)', description: 'French (Belgium)' },
  { value: 'fr-CH', label: '🇨🇭 Français (Suisse)', description: 'French (Switzerland)' },
  { value: 'fr-SN', label: '🇸🇳 Français (Sénégal)', description: 'French (Senegal)' },
  { value: 'fr-CI', label: '🇨🇮 Français (Côte d\'Ivoire)', description: 'French (Ivory Coast)' },
  { value: 'fr-MA', label: '🇲🇦 Français (Maroc)', description: 'French (Morocco)' },
  { value: 'fr-HT', label: '🇭🇹 Français (Haïti)', description: 'French (Haiti)' },
  { value: 'ca', label: '🏴󠁥󠁳󠁣󠁴󠁿 Català', description: 'Catalan' },
  { value: 'oc', label: '🇫🇷 Occitan', description: 'Occitan' },
  { value: 'de-DE', label: '🇩🇪 Deutsch (Deutschland)', description: 'German (Germany)' },
  { value: 'de-AT', label: '🇦🇹 Deutsch (Österreich)', description: 'German (Austria)' },
  { value: 'de-CH', label: '🇨🇭 Deutsch (Schweiz)', description: 'German (Switzerland)' },
  { value: 'it', label: '🇮🇹 Italiano', description: 'Italian' },
  { value: 'id', label: '🇮🇩 Bahasa Indonesia', description: 'Indonesian' },
  { value: 'is', label: '🇮🇸 Íslenska', description: 'Icelandic' },
  { value: 'pt-PT', label: '🇵🇹 Português (Portugal)', description: 'European Portuguese' },
  { value: 'pt-BR', label: '🇧🇷 Português (Brasil)', description: 'Brazilian Portuguese' },
  { value: 'pt-AO', label: '🇦🇴 Português (Angola)', description: 'Angolan Portuguese' },
  { value: 'pt-MZ', label: '🇲🇿 Português (Moçambique)', description: 'Mozambican Portuguese' },
  { value: 'pt-CV', label: '🇨🇻 Português (Cabo Verde)', description: 'Cape Verdean Portuguese' },
  { value: 'hr', label: '🇭🇷 Hrvatski', description: 'Croatian' },
  { value: 'ru', label: '🇷🇺 Русский', description: 'Russian' },
  { value: 'ro', label: '🇷🇴 Română', description: 'Romanian' },
  { value: 'hi', label: '🇮🇳 हिन्दी', description: 'Hindi' },
  { value: 'bn', label: '🇧🇩 বাংলা', description: 'Bengali' },
  { value: 'gu', label: '🇮🇳 ગુજરાતી', description: 'Gujarati' },
  { value: 'ta', label: '🇮🇳 தமিழ்', description: 'Tamil' },
  { value: 'te', label: '🇮🇳 తెలుగు', description: 'Telugu' },
  { value: 'kn', label: '🇮🇳 ಕನ್ನಡ', description: 'Kannada' },
  { value: 'ml', label: '🇮🇳 മലയാളം', description: 'Malayalam' },
  { value: 'pa', label: '🇮🇳 ਪੰਜਾਬੀ', description: 'Punjabi' },
  { value: 'or', label: '🇮🇳 ଓଡ଼ିଆ', description: 'Oriya' },
  
  // African Languages (missing from export)
  { value: 'ha', label: '🇳🇬 Hausa', description: 'Hausa' },
  { value: 'ig', label: '🇳🇬 Igbo', description: 'Igbo' },
  { value: 'ki', label: '🇰🇪 Gĩkũyũ', description: 'Kikuyu' },
  { value: 'rw', label: '🇷🇼 Ikinyarwanda', description: 'Kinyarwanda' },
  { value: 'rn', label: '🇧🇮 Ikirundi', description: 'Kirundi' },
  { value: 'lg', label: '🇺🇬 Luganda', description: 'Luganda' },
  { value: 'mg', label: '🇲🇬 Malagasy', description: 'Malagasy' },
  { value: 'sn', label: '🇿🇼 chiShona', description: 'Shona' },
  { value: 'st', label: '🇱🇸 Sesotho', description: 'Southern Sotho' },
  { value: 'nso', label: '🇿🇦 Sepedi', description: 'Northern Sotho' },
  { value: 'sw', label: '🇹🇿 Kiswahili', description: 'Swahili' },
  { value: 'tn', label: '🇧🇼 Setswana', description: 'Tswana' },
  { value: 'xh', label: '🇿🇦 isiXhosa', description: 'Xhosa' },
  { value: 'yo', label: '🇳🇬 Yorùbá', description: 'Yoruba' },
  { value: 'zu', label: '🇿🇦 isiZulu', description: 'Zulu' },
  
  // European Languages (missing from export)
  { value: 'cs', label: '🇨🇿 Čeština', description: 'Czech' },
  { value: 'da', label: '🇩🇰 Dansk', description: 'Danish' },
  { value: 'nl', label: '🇳🇱 Nederlands', description: 'Dutch' },
  { value: 'et', label: '🇪🇪 Eesti', description: 'Estonian' },
  { value: 'fi', label: '🇫🇮 Suomi', description: 'Finnish' },
  { value: 'gl', label: '🇪🇸 Galego', description: 'Galician' },
  { value: 'el', label: '🇬🇷 Ελληνικά', description: 'Greek' },
  { value: 'hu', label: '🇭🇺 Magyar', description: 'Hungarian' },
  { value: 'lv', label: '🇱🇻 Latviešu', description: 'Latvian' },
  { value: 'lt', label: '🇱🇹 Lietuvių', description: 'Lithuanian' },
  { value: 'mk', label: '🇲🇰 Македонски', description: 'Macedonian' },
  { value: 'no', label: '🇳🇴 Norsk', description: 'Norwegian' },
  { value: 'pl', label: '🇵🇱 Polski', description: 'Polish' },
  { value: 'sr', label: '🇷🇸 Српски', description: 'Serbian' },
  { value: 'sk', label: '🇸🇰 Slovenčina', description: 'Slovak' },
  { value: 'sl', label: '🇸🇮 Slovenščina', description: 'Slovenian' },
  { value: 'sv', label: '🇸🇪 Svenska', description: 'Swedish' },
  { value: 'tr', label: '🇹🇷 Türkçe', description: 'Turkish' },
  
  // Asian Languages (missing from export)
  { value: 'tl', label: '🇵🇭 Filipino', description: 'Filipino' },
  { value: 'ms', label: '🇲🇾 Bahasa Melayu', description: 'Malaysian' },
  { value: 'vi', label: '🇻🇳 Tiếng Việt', description: 'Vietnamese' }
  
  // RTL languages (Arabic, Hebrew, Yiddish) coming soon!
  // CJK languages (Chinese, Japanese, Korean) coming soon!
];






export interface ExportSettings {
  format: 'pdf' | 'epub' | 'docx' | 'html';
  includeToc: boolean;
  numberedHeadings: boolean;
  bookSize?: string;
  bleed?: boolean;
  bindingType?: string;
  customMargins?: boolean;
  marginSize?: 'narrow' | 'normal' | 'wide';
  // New book structure options
  includeTitlePage: boolean;
  useChapterPrefix: boolean;
  chapterLabelFormat: 'number' | 'none';
  noSeparatorPages: boolean;
  frontMatterContinuous: boolean;
  htmlStylesheet?: string;
  forceTitleFirst?: boolean;
  coverImage?: string;
  author?: string;
  subtitle?: string;
  useAutomaticTitlePage?: boolean;
  generateTitlePage?: boolean;
  isbn?: string; // Optional ISBN
  tocDepth?: number; // Add this line
  fontFamily?: string; // Add this line
  language?: string; // Language for export (auto-detected from i18n)
  t?: any; // Translation function - using any to accommodate i18n.t signature
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (settings: ExportSettings) => void;
  isLoading?: boolean;
  loadingMessage?: string; // Add support for custom loading messages
  projectName?: string;
  estimatedPages?: number; // Estimated total pages for current project
  exportError?: string | null;
  t?: any; // Translation function - using any to accommodate i18n.t signature
  projectId?: string; // Project ID for word count validation
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  isLoading = false,
  loadingMessage = 'Processing export...',
  projectName = 'My Book'
  , estimatedPages,
  exportError,
  t,
  projectId
}) => {
  console.log('ExportModal component rendered, isOpen:', isOpen, 'props:', { isOpen, isLoading, projectName });
  const { currentUser } = useAuth();
  const { settings: userSettings } = useSettings();
  const { i18n } = useTranslation();
  const isFreePlan = (currentUser?.subscription || 'free') === 'free';

  type ImageUsageStats = {
    used: number;
    allowed: number;
    additional: number;
    total: number;
    remaining: number;
    canUpload: boolean;
  } | null;

  const [imageUsage, setImageUsage] = useState<ImageUsageStats>(null);
  const [usageLoading, setUsageLoading] = useState<boolean>(false);
  
  // Word count tracking for ebook limits
  const [wordCount, setWordCount] = useState<number>(0);
  const [wordLimit, setWordLimit] = useState<number | null>(null);
  const [isOverWordLimit, setIsOverWordLimit] = useState<boolean>(false);

  // State for export settings
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'pdf',
    includeToc: true,
    numberedHeadings: false,
    bookSize: '6x9',
    bleed: false,
    bindingType: 'paperback',
    customMargins: false,
    marginSize: 'normal',
    // Default values for new book structure options
    includeTitlePage: true,
    useChapterPrefix: false,
    chapterLabelFormat: 'number',
    noSeparatorPages: true,
    frontMatterContinuous: true,
    // HTML specific settings
    htmlStylesheet: 'default',
    // Force title page to be first
    forceTitleFirst: true,
         // Language and font settings - use current interface language from Dashboard as default
     language: i18n.language || 'en',
           fontFamily: 'Liberation Serif', // Default font for server/Linux systems
     tocDepth: 1
  });

  // State for cover image (EPUB only)
  const [coverImageFilename, setCoverImageFilename] = useState<string | null>(null);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState<boolean>(false);
  const [coverRequiredError, setCoverRequiredError] = useState<string | null>(null);

  const [tocDepth, setTocDepth] = useState<number>(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Platform detection - use same variable as backend for consistency
  const exportPlatform = process.env.REACT_APP_EXPORT_PLATFORM || 
                        (navigator.platform.includes('Win') ? 'windows' : 'server');
  // Legacy font options - now using language-specific recommendations
  const fontOptions = exportPlatform === 'windows' ? windowsFonts : [];
  
  // Debug platform detection
  console.log('[FRONTEND PLATFORM DEBUG]', {
    REACT_APP_EXPORT_PLATFORM: process.env.REACT_APP_EXPORT_PLATFORM,
    navigator_platform: navigator.platform,
    exportPlatform: exportPlatform,
    fontOptions: fontOptions.map(f => f.value)
  });

  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const API_URL = process.env.REACT_APP_EXPORT_API_URL || 'https://publishjockey-export.onrender.com';
  
  // Get available fonts for a given language and format
  const getAvailableFonts = (language: string, format: string) => {
    console.log(`getAvailableFonts called with language: "${language}", format: "${format}", platform: "${exportPlatform}"`);
    
    // Use language-specific font recommendations
    const recommendedFonts = getFontRecommendations(language);
    console.log(`[FONT] Using curated recommendations for ${language}:`, recommendedFonts.map(f => f.value));
    
    return recommendedFonts;
  };
  


  // Get recommended font for a given language (first recommendation)
  const getRecommendedFont = (language: string, format: string = 'pdf'): string => {
    console.log(`getRecommendedFont called with language: "${language}", format: "${format}"`);
    
    const recommendedFonts = getFontRecommendations(language);
    const topRecommendation = recommendedFonts[0]?.value || 'Linux Libertine O';
    
    console.log(`Top font recommendation for ${language}: "${topRecommendation}"`);
    return topRecommendation;
  };

  // Fetch image usage stats when modal opens (for free plan clarity)
  useEffect(() => {
    let cancelled = false;
    const fetchUsage = async () => {
      try {
        setUsageLoading(true);
        const stats = await realImageService.getImageUsageStats();
        if (!cancelled) {
          setImageUsage(stats);
        }
      } catch (err: any) {
        if (!cancelled) {
          // silently ignore in UI
        }
      } finally {
        if (!cancelled) setUsageLoading(false);
      }
    };
    if (isOpen) fetchUsage();
    return () => { cancelled = true; };
  }, [isOpen]);

     // Single initialization effect - runs only when modal opens
   useEffect(() => {
     if (isOpen) {
       const language = i18n.language || 'en';
       const format = 'pdf'; // Default format for initialization
       console.log(`Initialization effect - i18n.language: "${i18n.language}", final language: "${language}", format: "${format}"`);
       
       const recommendedFont = getRecommendedFont(language, format);
       const userFont = userSettings.exportFontFamily;
       
       // Validate user's saved font against available fonts
       const availableFonts = getAvailableFonts(language, format);
       const isUserFontValid = userFont && availableFonts.some(font => font.value === userFont);
       
       // Use user's saved font if it's valid, otherwise use recommended font
       const initialFont = isUserFontValid ? userFont : recommendedFont;
       
       console.log(`Initializing ExportModal - Language: ${language}, User font: ${userFont}, Is valid: ${isUserFontValid}, Recommended: ${recommendedFont}, Final: ${initialFont}`);
       
       setSettings(prev => ({
         ...prev,
         language: language,
         fontFamily: initialFont
       }));
     }
   }, [isOpen]); // Only depend on isOpen to avoid race conditions


  // Get book sizes based on binding type
  const getBookSizes = () => {
    return settings.bindingType === 'paperback' ? paperbackSizes : hardcoverSizes;
  };

  // Handle cover image selection and upload
  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setCoverUploadError('Please upload a valid image file (JPEG, PNG)');
        return;
      }
      
      // Validate file size (15MB = 15 * 1024 * 1024 bytes)
      const maxSize = 15 * 1024 * 1024; // 15MB in bytes
      if (file.size > maxSize) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setCoverUploadError(`Image file is too large (${fileSizeMB} MB). Maximum file size is 15 MB. Please choose a smaller image.`);
        return;
      }
      
      setCoverUploading(true);
      setCoverUploadError(null); // Clear any previous errors
      try {
        const formData = new FormData();
        formData.append('cover', file);
        const res = await fetch(`${API_URL}/upload-cover`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok && data.success && data.filePath) {
          // Extract just the filename for backend export
          const filename = data.filePath.split(/[/\\]/).pop();
          setCoverImageFilename(filename);
        } else {
          setCoverUploadError(data.error || 'Upload failed');
        }
      } catch (err) {
        setCoverUploadError('Upload failed');
      } finally {
        setCoverUploading(false);
      }
    }
  };

  // Handle export button click
  const handleExport = () => {
    console.log('Export button clicked, settings:', settings);
    setCoverRequiredError(null);
    // If EPUB, require cover image
    if (settings.format === 'epub' && !coverImageFilename) {
      setCoverRequiredError('Please upload a cover image (JPG or PNG) before exporting EPUB.');
      return;
    }
    // First, let's test the connection to the export backend
    const testBackendConnection = async () => {
      try {
        console.log('Testing connection to export backend...');
        const pingResponse = await fetch(`${API_URL}/ping`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (pingResponse.ok) {
          const data = await pingResponse.json();
          console.log('Backend connection test successful:', data);
          return true;
        } else {
          console.error('Backend ping failed:', pingResponse.status, pingResponse.statusText);
          return false;
        }
      } catch (error) {
        console.error('Backend connection test failed:', error);
        return false;
      }
    };
    
    // Run the test and then continue with export
    testBackendConnection().then(connectionOk => {
      if (!connectionOk) {
        alert('Cannot connect to export server. Please ensure the export backend server is running on port 3002.');
        return;
      }
      
      // Validate image usage before export
      const validateAndExport = async () => {
        try {
          console.log('Validating image usage before export...');
          const validation = await realImageService.validateExport();
          
          if (!validation.valid) {
            // Show image limit exceeded dialog
            const userConfirmed = window.confirm(
              `${validation.message}\n\n` +
              'Would you like to:\n' +
              '• Click OK to upgrade your plan\n' +
              '• Click Cancel to remove images and try again'
            );
            
            if (userConfirmed) {
              // Redirect to pricing page
              window.open('/pricing', '_blank');
            }
            return; // Stop export
          }
          
          console.log('Image validation passed, checking word limit...');
          
          // Check word limit for ebook subscriptions (all exports)
          if (currentUser?.subscription?.startsWith('e') && projectId) {
            try {
              const wordCountResponse = await http.get(`/projects/${projectId}/wordcount`);
              if (wordCountResponse.data.success) {
                const wordData = wordCountResponse.data.data;
                if (wordData.wordLimit && !wordData.isValid) {
                  alert(
                    `Export blocked: Your book contains ${wordData.wordCount.toLocaleString()} words, ` +
                    `which exceeds the ${wordData.wordLimit.toLocaleString()}-word limit for ebook subscriptions.\n\n` +
                    `Please reduce your content by ${(wordData.wordCount - wordData.wordLimit).toLocaleString()} words and try again.\n\n` +
                    `Note: Regular book subscriptions have no word limits if you need to create longer content.`
                  );
                  return; // Stop export
                }
              }
            } catch (error) {
              console.error('Error checking word limit:', error);
              // Allow export to continue if word limit check fails
            }
          }
          
          console.log('All validations passed, proceeding with export...');
          
          // Call parent onExport handler with settings
          const exportSettings = { 
            ...settings, 
            tocDepth, 
            fontFamily: settings.fontFamily,
            t: t || i18n.t // Use passed translation function or fallback to i18n.t
          };
          if (settings.format === 'epub' && coverImageFilename) {
            exportSettings.coverImage = coverImageFilename;
          }
          // Always include TOC for EPUB
          if (settings.format === 'epub') {
            exportSettings.includeToc = true;
          }
          
          console.log('Calling parent onExport with settings:', exportSettings);
          onExport(exportSettings);
          
        } catch (error) {
          console.error('Error validating export:', error);
          alert('Unable to validate image usage. Please try again.');
        }
      };
      
      // Run validation and export
      validateAndExport();
    });
  };

  // Handle changes to settings
  const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      format: (event.target.value as 'pdf' | 'epub' | 'docx' | 'html')
    });
  };

  const handleTocToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      includeToc: event.target.checked
    });
  };

  // Restore handlers and state that are actually used in the JSX
  const handleBookSizeChange = (event: any) => {
    setSettings({
      ...settings,
      bookSize: event.target.value
    });
  };
  const handleBindingTypeChange = (event: any) => {
    setSettings({
      ...settings,
      bindingType: event.target.value,
      bookSize: event.target.value === 'paperback' ? '6x9' : '6x9'
    });
  };
  const handleTitlePageToggle = (event: any) => {
    setSettings({
      ...settings,
      includeTitlePage: event.target.checked
    });
  };
  const handleSeparatorPagesToggle = (event: any) => {
    setSettings({
      ...settings,
      noSeparatorPages: event.target.checked
    });
  };
  const handleFrontMatterContinuousToggle = (event: any) => {
    setSettings({
      ...settings,
      frontMatterContinuous: event.target.checked
    });
  };

  // Enforce default Book Structure values for EPUB (no chapter labels, no numbered headings, etc.)
  useEffect(() => {
    if (settings.format === 'epub') {
      setSettings(prev => ({
        ...prev,
        includeTitlePage: false,
        useChapterPrefix: false, // No chapter labels for EPUB
        chapterLabelFormat: 'none', // Explicitly set to 'none' for EPUB
        noSeparatorPages: true,
        frontMatterContinuous: true,
        numberedHeadings: false, // No numbered headings for EPUB
      }));
    }
  }, [settings.format]);

  // Remove toggles for 'Include Title Page', 'No separator pages between sections', and 'Front matter flows continuously' for PDF export
  // Always set these options to true in export settings when PDF is selected
  useEffect(() => {
    if (settings.format === 'pdf') {
      setSettings(prev => ({
        ...prev,
        includeTitlePage: true,
        noSeparatorPages: true,
        frontMatterContinuous: true,
      }));
    }
  }, [settings.format]);

  // Handle language change and auto-select appropriate font
  const handleLanguageChange = (language: string) => {
    const format = settings.format;
    const recommendedFont = getRecommendedFont(language, format);
    console.log(`Language changed to ${language}, format: ${format}, setting font to ${recommendedFont}`);
    setSettings(prev => ({
      ...prev,
      language,
      fontFamily: recommendedFont
    }));
  };



  console.log('ExportModal about to render JSX, isOpen:', isOpen);
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
        {isLoading ? 'Exporting Your Book...' : 'Export Book'}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {!isLoading && exportError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              {exportError}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tip: If exporting to PDF and a heading contains an ampersand (&), escape it as \\& in the heading title. Plain text body content does not need escaping.
            </Typography>
          </Alert>
        )}
        {isLoading ? (
          // Show prominent loading state when exporting
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 4,
              minHeight: '200px'
            }}
          >
            <CircularProgress 
              size={60} 
              sx={{ 
                mb: 3,
                color: 'primary.main'
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 1,
                fontWeight: 500,
                textAlign: 'center'
              }}
            >
              {loadingMessage}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                textAlign: 'center',
                maxWidth: '300px'
              }}
            >
              {settings.format === 'pdf'
                ? 'This may take around 30 seconds depending on the size of your book and number of images.'
                : 'This may take around 5 seconds depending on the size of your book and number of images.'}
            </Typography>
          </Box>
        ) : (
          <Box component="form" noValidate>
            {isFreePlan && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.primary">
                    Free plan: 12-page export, 2 images.
                  </Typography>
                  {typeof estimatedPages === 'number' && estimatedPages > 0 && (() => {
                    const included = Math.min(12, estimatedPages);
                    const locked = Math.max(0, estimatedPages - 12);
                    return (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Estimated length: {estimatedPages} pages. Sample will include {included} page{included !== 1 ? 's' : ''}.
                        </Typography>
                        {locked > 0 && (
                          <Typography variant="body2" color="text.secondary">
                            Locked pages remaining: {locked}. Upgrade to export the full book.
                          </Typography>
                        )}
                      </>
                    );
                  })()}
                  {imageUsage && (
                    <Typography variant="body2" color="text.secondary">
                      Images remaining: {imageUsage.remaining} of {imageUsage.total}
                    </Typography>
                  )}
                  {!imageUsage && usageLoading && (
                    <Typography variant="body2" color="text.secondary">
                      Checking image usage...
                    </Typography>
                  )}
                  <Button href="/pricing" sx={{ mt: 1 }} size="small">Upgrade</Button>
                </Box>
              </Alert>
            )}
            {/* Format */}
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Format</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Select value={settings.format} onChange={handleFormatChange}>
                <MenuItem value="pdf">PDF (Print)</MenuItem>
                <MenuItem value="epub">EPUB (eBook)</MenuItem>
                <MenuItem value="docx">Word (DOCX)</MenuItem>
              </Select>
            </FormControl>

            {/* Cover Image (EPUB only) */}
            {settings.format === 'epub' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Cover Image (EPUB)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  15 MB Max • Supported formats: JPEG, PNG
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  disabled={coverUploading}
                  sx={{ mb: 1 }}
                >
                  {coverImageFilename ? 'Change Cover Image' : 'Upload Cover Image'}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    hidden
                    onChange={handleCoverImageChange}
                  />
                </Button>
                {coverUploading && (
                  <Typography variant="body2" color="text.secondary">
                    Uploading cover image...
                  </Typography>
                )}
                {coverImageFilename && (
                  <Typography variant="body2" color="success.main">
                    Cover image uploaded: {coverImageFilename}
                  </Typography>
                )}
                {coverUploadError && (
                  <Typography variant="body2" color="error">
                    {coverUploadError}
                  </Typography>
                )}
                {coverRequiredError && (
                  <Typography variant="body2" color="error">
                    {coverRequiredError}
                  </Typography>
                )}
              </Box>
            )}

            {/* Book Size (PDF only) */}
            {settings.format === 'pdf' && (
              <>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Book Size</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select value={settings.bookSize} onChange={handleBookSizeChange}>
                    {getBookSizes().map(size => (
                      <MenuItem key={size.value} value={size.value}>{size.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {/* Binding (PDF only) */}
            {settings.format === 'pdf' && (
              <>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Binding</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select value={settings.bindingType} onChange={handleBindingTypeChange}>
                    <MenuItem value="paperback">Paperback</MenuItem>
                    <MenuItem value="hardcover">Hardcover</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {(settings.format === 'pdf' || settings.format === 'epub') && (
              <>
                {/* Document Language */}
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Document Language</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select value={settings.language} onChange={e => handleLanguageChange(e.target.value as string)}>
                    {languageOptions.map(lang => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                                 {/* Font Family - Show for all languages */}
                 {(
                  <>
                                         <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Font Family</Typography>
                                          <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select 
                          value={settings.fontFamily || ''} 
                          onChange={e => {
                            console.log(`Font changed to: ${e.target.value}`);
                            setSettings({ ...settings, fontFamily: e.target.value });
                          }}
                          displayEmpty
                          renderValue={(selected) => {
                            console.log(`Select renderValue called with: "${selected}"`);
                            return selected || 'Select a font...';
                          }}
                                                 >
                                                  {(() => {
                            const language = settings.language || 'en';
                            const format = settings.format;
                            console.log(`Rendering font options for language: ${language}, format: ${format}`);
                            
                            const availableFonts = getAvailableFonts(language, format);
                            
                            return availableFonts.map(font => (
                              <MenuItem key={font.value} value={font.value}>{font.label}</MenuItem>
                            ));
                                                  })()}
                       </Select>
                    </FormControl>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      {(() => {
                        const language = settings.language || 'en';
                        const format = settings.format;
                        
                                                 if (format === 'epub') {
                           if (['en', 'es', 'fr', 'de', 'it', 'id'].includes(language)) {
                             return '💡 Choose your preferred EPUB-compatible font for Latin-based languages. Keep the selected font or choose your preferred font.';
                           } else if (language === 'ru') {
                             return '💡 Choose your preferred Cyrillic font for Russian (EPUB-compatible). Keep the selected font or choose your preferred font.';
                           } else if (language === 'ta') {
                             return '💡 Choose your preferred Tamil font (EPUB-compatible). Keep the selected font or choose your preferred font.';
                           } else if (language === 'hi') {
                             return '💡 Choose your preferred Devanagari font for Hindi (EPUB-compatible). Keep the selected font or choose your preferred font.';
                           } else if (language === 'ar') {
                             return '💡 Choose your preferred Arabic font (EPUB-compatible). Keep the selected font or choose your preferred font.';
                           } else if (language === 'he' || language === 'yi') {
                             return '💡 Choose your preferred Hebrew font (EPUB-compatible). Keep the selected font or choose your preferred font.';
                           }
                         } else if (format === 'pdf') {
                           if (['en', 'es', 'fr', 'de', 'it', 'id'].includes(language)) {
                             return '💡 Choose your preferred font for Latin-based languages (includes professional book fonts). Keep the selected font or choose your preferred font.';
                           } else if (language === 'ru') {
                             return '💡 Choose your preferred Cyrillic font for Russian. Keep the selected font or choose your preferred font.';
                           } else if (language === 'ta') {
                             return '💡 Choose your preferred Tamil font. Keep the selected font or choose your preferred font.';
                           } else if (language === 'hi') {
                             return '💡 Choose your preferred Devanagari font for Hindi. Keep the selected font or choose your preferred font.';
                           } else if (language === 'ar') {
                             return '💡 Choose your preferred Arabic font. Keep the selected font or choose your preferred font.';
                           } else if (language === 'he' || language === 'yi') {
                             return '💡 Choose your preferred Hebrew font. Keep the selected font or choose your preferred font.';
                           }
                                                  } else {
                           if (['en', 'es', 'fr', 'de', 'it', 'id'].includes(language)) {
                             return '💡 Choose your preferred font for Latin-based languages. Keep the selected font or choose your preferred font.';
                           } else if (language === 'ru') {
                             return '💡 Choose your preferred Cyrillic font for Russian. Keep the selected font or choose your preferred font.';
                           } else if (language === 'ta') {
                             return '💡 Choose your preferred Tamil font. Keep the selected font or choose your preferred font.';
                           } else if (language === 'hi') {
                             return '💡 Choose your preferred Devanagari font for Hindi. Keep the selected font or choose your preferred font.';
                           } else if (language === 'ar') {
                             return '💡 Choose your preferred Arabic font. Keep the selected font or choose your preferred font.';
                           } else if (language === 'he' || language === 'yi') {
                             return '💡 Choose your preferred Hebrew font. Keep the selected font or choose your preferred font.';
                           }
                         }
                        
                        return '💡 The optimal font for your selected language is automatically chosen for best rendering.';
                      })()}
                    </Typography>
                  </>
                )}

                {/* General Language Support Notice */}
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600, mb: 1 }}>
                    🌍 Language Support Notice
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Content Responsibility:</strong> You are responsible for ensuring your content is appropriate, accurate, and compliant with all applicable laws and regulations.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    <strong>Recommendation:</strong> For important publications, consider professional review and always test your exports thoroughly before publishing.
                  </Typography>
                </Alert>

                {/* RTL Language Warning */}
                {['ar', 'he', 'yi'].includes(settings.language || 'en') && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600, mb: 1 }}>
                      ⚠️ Important: {settings.language === 'ar' ? 'Arabic' : settings.language === 'he' ? 'Hebrew' : 'Yiddish'} Language Limitations
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Pure Language Content:</strong> For best results, use only {settings.language === 'ar' ? 'Arabic' : settings.language === 'he' ? 'Hebrew' : 'Yiddish'} text. Mixed content (English text, URLs, email addresses) may not display correctly.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Your Responsibility:</strong> You are responsible for ensuring your content is appropriate, accurate, and compliant with all applicable laws and regulations.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      <strong>Recommendation:</strong> Test your export thoroughly before publishing and consider professional review for important publications.
                    </Typography>
                  </Alert>
                )}


              </>
            )}

            {/* TOC */}
            <FormControlLabel
              control={<Switch checked={settings.includeToc} onChange={handleTocToggle} />}
              label="Include Table of Contents"
              sx={{ mb: 2, ml: 0 }}
            />

            {/* TOC Depth (PDF only, if TOC enabled) */}
            {settings.format === 'pdf' && settings.includeToc && (
              <>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>TOC Depth</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select value={tocDepth} onChange={e => setTocDepth(Number(e.target.value))}>
                    <MenuItem value={1}>Level 1 (Chapters only)</MenuItem>
                    <MenuItem value={2}>Level 2 (Chapters & Sections)</MenuItem>
                    <MenuItem value={3}>Level 3 (Chapters, Sections & Subsections)</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {/* Advanced Options */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                py: 1,
                mb: 2,
                color: 'primary.main',
                fontWeight: 500
              }}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              Advanced Options
              <ExpandMoreIcon sx={{ ml: 1, transition: '0.2s', transform: showAdvanced ? 'rotate(180deg)' : 'none' }} />
            </Box>
            {showAdvanced && (
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.includeTitlePage}
                      onChange={handleTitlePageToggle}
                      color="primary"
                      size="small"
                    />
                  }
                  label="Include Title Page"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.noSeparatorPages}
                      onChange={handleSeparatorPagesToggle}
                      color="primary"
                      size="small"
                    />
                  }
                  label="No separator pages between sections"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.frontMatterContinuous}
                      onChange={handleFrontMatterContinuousToggle}
                      color="primary"
                      size="small"
                    />
                  }
                  label="Front matter flows continuously"
                />
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit" sx={{ mr: 2 }}>CANCEL</Button>
        <Button onClick={handleExport} variant="contained" color="primary" sx={{ minWidth: 120 }}>EXPORT</Button>
      </DialogActions>

      <ExportInstructionsTabs
        open={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
        initialTab={settings.format}
      />
    </Dialog>
  );
};

export default ExportModal;