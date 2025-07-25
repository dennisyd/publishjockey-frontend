import React, { useState, useEffect } from 'react';
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
  SelectChangeEvent
} from '@mui/material';

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
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (settings: ExportSettings) => void;
  isLoading?: boolean;
  projectName?: string;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  isLoading = false,
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
      const exportSettings = { ...settings };
      if (settings.format === 'epub' && coverImageFilename) {
        exportSettings.coverImage = coverImageFilename;
      }
      // Always include TOC for EPUB
      if (settings.format === 'epub') {
        exportSettings.includeToc = true;
      }
      
      console.log('Calling parent onExport with settings:', exportSettings);
      onExport(exportSettings);
      
      // Close the modal after submitting
      onClose();
      
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
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" fontWeight="medium">Export Book</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {projectName}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Format Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Choose an export format:
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              name="export-format"
              value={settings.format}
              onChange={handleFormatChange}
            >
              <FormControlLabel 
                value="pdf" 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    PDF Document
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      (Best for printing & publishing)
                    </Typography>
                  </Box>
                } 
              />
              <FormControlLabel 
                value="epub" 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    EPUB eBook
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      (For e-readers & digital stores)
                    </Typography>
                  </Box>
                } 
              />
              <FormControlLabel 
                value="docx" 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Microsoft Word
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      (For editing & sharing)
                    </Typography>
                  </Box>
                } 
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />
        
        {/* Instructions button: show for all formats, before Book Structure section */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="outlined" color="info" onClick={() => setInstructionsOpen(true)}>
            Instructions
          </Button>
        </Box>
        {/* EPUB Cover Image Upload: show only for EPUB, immediately after Instructions button */}
        {settings.format === 'epub' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Cover Image (EPUB only):
            </Typography>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleCoverImageChange}
              disabled={coverUploading}
            />
            {coverUploading && (
              <Typography variant="caption" color="text.secondary">
                Uploading cover image...
              </Typography>
            )}
            {coverImage && !coverUploading && coverImageFilename && (
              <Typography variant="caption" color="text.secondary">
                Uploaded: {coverImage.name}
              </Typography>
            )}
            {coverUploadError && (
              <Typography variant="caption" color="error">
                {coverUploadError}
              </Typography>
            )}
            {coverRequiredError && (
              <Typography variant="caption" color="error">
                {coverRequiredError}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              You must upload a cover image (JPG or PNG, max 10MB) to export EPUB. If you do not select one, a default cover will be used.
            </Typography>
          </Box>
        )}
        
        {/* Book Size Options - Show for PDF and DOCX */}
        {(settings.format === 'pdf' || settings.format === 'docx') && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Book Format Settings:
            </Typography>
            
            {/* Binding Type - PDF only */}
            {settings.format === 'pdf' && (
              <FormControl component="fieldset" sx={{ mb: 2, display: 'block' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Binding Type:
                </Typography>
                <RadioGroup
                  row
                  name="binding-type"
                  value={settings.bindingType}
                  onChange={handleBindingTypeChange}
                >
                  <FormControlLabel 
                    value="paperback" 
                    control={<Radio size="small" />} 
                    label="Paperback" 
                  />
                  <FormControlLabel 
                    value="hardcover" 
                    control={<Radio size="small" />} 
                    label="Hardcover" 
                  />
                </RadioGroup>
              </FormControl>
            )}
            
            {/* Book Size */}
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel id="book-size-label">Book Size</InputLabel>
              <Select
                labelId="book-size-label"
                id="book-size-select"
                value={settings.bookSize}
                onChange={handleBookSizeChange}
                label="Book Size"
              >
                {getBookSizes().map((size) => (
                  <MenuItem key={size.value} value={size.value}>
                    {size.label}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Margins will be automatically optimized based on book size
              </Typography>
            </FormControl>
            
            {/* Custom Margins Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={settings.customMargins}
                  onChange={handleCustomMarginsToggle}
                  color="primary"
                  size="small"
                />
              }
              label="Override automatic margins"
            />
            
            {/* Margins (only shown if customMargins is true) */}
            {settings.customMargins && (
              <FormControl component="fieldset" sx={{ mt: 1, ml: 3, display: 'block' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Custom Margin Size:
                </Typography>
                <RadioGroup
                  row
                  name="margin-size"
                  value={settings.marginSize}
                  onChange={handleMarginSizeChange}
                >
                  <FormControlLabel 
                    value="narrow" 
                    control={<Radio size="small" />} 
                    label="Narrow" 
                  />
                  <FormControlLabel 
                    value="normal" 
                    control={<Radio size="small" />} 
                    label="Normal" 
                  />
                  <FormControlLabel 
                    value="wide" 
                    control={<Radio size="small" />} 
                    label="Wide" 
                  />
                </RadioGroup>
              </FormControl>
            )}
            
            {/* Bleed - PDF only */}
            {settings.format === 'pdf' && (
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.bleed}
                    onChange={handleBleedToggle}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">
                      Include bleed (for professional printing)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Extends images and backgrounds to the edge of the page
                    </Typography>
                  </Box>
                }
              />
            )}
          </Box>
        )}
        
        {/* HTML Style Options - Show only for HTML format */}
        {settings.format === 'html' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              HTML Style Settings:
            </Typography>
            
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel id="html-stylesheet-label">Stylesheet</InputLabel>
              <Select
                labelId="html-stylesheet-label"
                id="html-stylesheet-select"
                value={settings.htmlStylesheet || 'default'}
                onChange={(event: SelectChangeEvent) => {
                  setSettings({
                    ...settings,
                    htmlStylesheet: event.target.value
                  });
                }}
                label="Stylesheet"
              >
                <MenuItem value="default">Default (Modern)</MenuItem>
                <MenuItem value="minimal">Minimal</MenuItem>
                <MenuItem value="print">Print-friendly</MenuItem>
                <MenuItem value="ebook">E-Book</MenuItem>
              </Select>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Stylesheet controls the appearance of the exported HTML
              </Typography>
            </FormControl>
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />

        {/* Book Structure Settings - Only show for non-EPUB formats */}
        {settings.format !== 'epub' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Book Structure:
            </Typography>
            {/* Only show toggles for non-PDF formats */}
            {settings.format !== 'pdf' && (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.includeTitlePage}
                      onChange={handleTitlePageToggle}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2">
                        Include Title Page
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Always placed first in document
                      </Typography>
                    </Box>
                  }
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
                  label={
                    <Box>
                      <Typography variant="body2">
                        No separator pages between sections
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Sections flow continuously without blank pages
                      </Typography>
                    </Box>
                  }
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
                  label={
                    <Box>
                      <Typography variant="body2">
                        Front matter flows continuously
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Title page, disclaimer, copyright, etc. flow without page breaks
                      </Typography>
                    </Box>
                  }
                />
              </>
            )}
            {/* Chapter Display Option (always shown) */}
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.useChapterPrefix}
                    onChange={handleChapterPrefixToggle}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    Add chapter labels to sections
                  </Typography>
                }
              />
            </Box>
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />

        {/* Table of Contents Options */}
        <Box sx={{ mb: 3 }}>
          {/* Only show TOC switch for non-EPUB formats */}
          {settings.format !== 'epub' && (
            <FormControlLabel
              control={
                <Switch
                  checked={settings.includeToc}
                  onChange={handleTocToggle}
                  color="primary"
                />
              }
              label={
                <Typography variant="subtitle1" fontWeight="medium">
                  Include Table of Contents
                </Typography>
              }
            />
          )}
          {/* For EPUB, always include TOC and show as static info */}
          {settings.format === 'epub' && (
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
              Table of Contents will always be included in EPUB exports.
            </Typography>
          )}

          {/* Only show numbered headings toggle for non-EPUB formats */}
          {settings.includeToc && settings.format !== 'epub' && (
            <Box 
              sx={{ 
                ml: 3, 
                mt: 1, 
                p: 2, 
                bgcolor: 'background.paper', 
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 1,
                transition: 'all 0.2s ease',
              }}
            >
              <Divider sx={{ my: 1.5 }} />
              {/* Only show numbered headings if Add chapter labels to sections is OFF */}
              {!settings.useChapterPrefix && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.numberedHeadings}
                      onChange={handleNumberedHeadings}
                      color="primary"
                    />
                  }
                  label="Use numbered headings (e.g., 1.1, 1.2)"
                />
              )}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ borderRadius: 1.5 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ 
            borderRadius: 1.5,
            px: 3,
            position: 'relative'
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress 
                size={24} 
                color="inherit" 
                sx={{ 
                  position: 'absolute', 
                  left: '50%', 
                  top: '50%', 
                  marginLeft: '-12px', 
                  marginTop: '-12px' 
                }} 
              />
              <span style={{ visibility: 'hidden' }}>Export</span>
            </>
          ) : 'Export'}
        </Button>
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