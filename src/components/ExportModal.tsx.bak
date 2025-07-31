import React, { useState, useEffect } from 'react'; // YD Dennis
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
];

// FONT OPTIONS (split by OS)
const WINDOWS_FONTS = [
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Tahoma', value: 'Tahoma' },
  { label: 'Courier New', value: 'Courier New' },
];
const LINUX_FONTS = [
  { label: 'Liberation Serif', value: 'Liberation Serif' },
  { label: 'TeX Gyre Termes', value: 'TeX Gyre Termes' },
  { label: 'TeX Gyre Pagella', value: 'TeX Gyre Pagella' },
  { label: 'Linux Libertine', value: 'Linux Libertine O' },
  { label: 'DejaVu Serif', value: 'DejaVu Serif' },
];

// Detect platform for font list using environment variable first, then browser as fallback
const getPlatformFonts = () => {
  // Use the environment variable if set, otherwise fallback to browser detection
  const envPlatform = (process.env.NEXT_PUBLIC_EXPORT_PLATFORM || process.env.REACT_APP_EXPORT_PLATFORM || '').toLowerCase();
  if (envPlatform.includes('win')) return { fonts: WINDOWS_FONTS, defaultFont: 'Times New Roman' };
  if (envPlatform.includes('ubuntu') || envPlatform.includes('linux')) return { fonts: LINUX_FONTS, defaultFont: 'Liberation Serif' };

  // Fallback to browser detection if env not set
  const platform = window.navigator.platform.toLowerCase();
  if (platform.includes('win')) return { fonts: WINDOWS_FONTS, defaultFont: 'Times New Roman' };
  if (platform.includes('linux')) return { fonts: LINUX_FONTS, defaultFont: 'Liberation Serif' };
  return { fonts: LINUX_FONTS, defaultFont: 'Liberation Serif' };
};

const { fonts: FONT_OPTIONS, defaultFont } = getPlatformFonts();

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
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (settings: ExportSettings) => void;
  isLoading?: boolean;
  loadingMessage?: string; // Add support for custom loading messages
  projectName?: string;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  isLoading = false,
  loadingMessage = 'Processing export...',
  projectName = 'My Book'
}) => {
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
    forceTitleFirst: true
  });

  // State for cover image (EPUB only)
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageFilename, setCoverImageFilename] = useState<string | null>(null);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState<boolean>(false);
  const [coverRequiredError, setCoverRequiredError] = useState<string | null>(null);

  const [tocDepth, setTocDepth] = useState<number>(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedFont, setSelectedFont] = useState(defaultFont);

  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const API_URL = process.env.REACT_APP_EXPORT_API_URL || 'https://publishjockey-export.onrender.com';

  // Get book sizes based on binding type
  const getBookSizes = () => {
    return settings.bindingType === 'paperback' ? paperbackSizes : hardcoverSizes;
  };

  // Handle cover image selection and upload
  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setCoverImage(file);
    setCoverImageFilename(null);
    setCoverUploadError(null);
    if (file) {
      setCoverUploading(true);
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
      
      // Call parent onExport handler with settings
      const exportSettings = { ...settings, tocDepth, fontFamily: selectedFont };
      if (settings.format === 'epub' && coverImageFilename) {
        exportSettings.coverImage = coverImageFilename;
      }
      // Always include TOC for EPUB
      if (settings.format === 'epub') {
        exportSettings.includeToc = true;
      }
      
      console.log('Calling parent onExport with settings:', exportSettings);
      onExport(exportSettings);
      
      // DON'T close the modal here - let the parent component close it after export completes
      // The parent should call onClose() when export finishes (success or error)
      
      // Log export settings for debugging
      console.log('Exporting with settings:', exportSettings);
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

  const handleNumberedHeadings = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      numberedHeadings: event.target.checked
    });
  };

  const handleBindingTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      bindingType: event.target.value,
      // Reset book size to a default for the new binding type
      bookSize: event.target.value === 'paperback' ? '6x9' : '6x9'
    });
  };

  const handleBookSizeChange = (event: SelectChangeEvent) => {
    setSettings({
      ...settings,
      bookSize: event.target.value
    });
  };

  const handleBleedToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      bleed: event.target.checked
    });
  };

  const handleMarginSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      marginSize: event.target.value as 'narrow' | 'normal' | 'wide'
    });
  };

  const handleCustomMarginsToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      customMargins: event.target.checked
    });
  };

  // Handlers for new book structure options
  const handleTitlePageToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      includeTitlePage: event.target.checked
    });
  };

  const handleChapterPrefixToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      useChapterPrefix: event.target.checked,
      chapterLabelFormat: event.target.checked ? 'number' : 'none',
    });
  };

  const handleSeparatorPagesToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      noSeparatorPages: event.target.checked
    });
  };

  const handleFrontMatterContinuousToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            {/* Format */}
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Format</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Select value={settings.format} onChange={handleFormatChange}>
                <MenuItem value="pdf">PDF (Print)</MenuItem>
                <MenuItem value="epub">EPUB (eBook)</MenuItem>
                <MenuItem value="docx">Word (DOCX)</MenuItem>
              </Select>
            </FormControl>

            {/* Book Size */}
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Book Size</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Select value={settings.bookSize} onChange={handleBookSizeChange}>
                {getBookSizes().map(size => (
                  <MenuItem key={size.value} value={size.value}>{size.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Font Selection */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Font Family</Typography>
              <FormControl fullWidth>
                <Select value={selectedFont} onChange={e => setSelectedFont(e.target.value)}>
                  {FONT_OPTIONS.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                {`Default: ${defaultFont}. Only fonts available on your current OS are shown.`}
              </Typography>
            </Box>

            {/* Cover Image Upload (EPUB only) */}
            {settings.format === 'epub' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Cover Image (JPG or PNG)</Typography>
                <Button
                  variant="outlined"
                  component="label"
                  disabled={coverUploading}
                  sx={{ mr: 2 }}
                >
                  {coverImage ? 'Change Cover Image' : 'Upload Cover Image'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    hidden
                    onChange={handleCoverImageChange}
                  />
                </Button>
                {coverUploading && (
                  <CircularProgress size={20} sx={{ ml: 1, verticalAlign: 'middle' }} />
                )}
                {coverImage && (
                  <Typography variant="body2" sx={{ display: 'inline', ml: 1 }}>
                    {coverImage.name}
                  </Typography>
                )}
                {coverUploadError && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {coverUploadError}
                  </Typography>
                )}
                {coverRequiredError && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {coverRequiredError}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                  Recommended: at least 1600px on the shortest side. Supported: JPG, PNG.
                </Typography>
              </Box>
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