import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Paper, 
  Alert,
  Divider,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import useBookExport from '../hooks/useBookExport';
import FairUseWarning from './FairUseWarning';

/**
 * Component that demonstrates exporting a book with fair use protection
 */
const BookExportWithProtection = ({ 
  projectId, 
  userId, 
  sections, 
  projectTitle,
  onPurchaseBook 
}) => {
  const [exportFormat, setExportFormat] = useState('PDF');
  const { 
    exportBook, 
    loading, 
    error, 
    fairUseViolation,
    clearFairUseViolation 
  } = useBookExport();
  
  // Handle export button click
  const handleExport = async () => {
    if (!sections || sections.length === 0) {
      console.error('No sections to export');
      return;
    }
    
    const exportOptions = {
      projectId,
      userId,
      projectTitle,
      metadata: {
        title: projectTitle || 'Untitled Book',
        author: 'Author Name',
      },
      includeToc: true,
      useChapterPrefix: true,
      numberedHeadings: true
    };
    
    await exportBook(exportFormat, sections, exportOptions);
  };
  
  // Handle format change
  const handleFormatChange = (event) => {
    setExportFormat(event.target.value);
  };
  
  // Handle purchase click from fair use warning
  const handlePurchase = () => {
    if (onPurchaseBook) {
      onPurchaseBook();
    }
    clearFairUseViolation();
  };
  
  // Handle continue anyway click
  const handleContinueAnyway = () => {
    clearFairUseViolation();
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 3 }}>
      <Typography variant="h5" gutterBottom>
        Export Book
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="format-label">Export Format</InputLabel>
            <Select
              labelId="format-label"
              id="format-select"
              value={exportFormat}
              onChange={handleFormatChange}
              label="Export Format"
              disabled={loading}
            >
              <MenuItem value="PDF">PDF</MenuItem>
              <MenuItem value="EPUB">EPUB</MenuItem>
              <MenuItem value="DOCX">Word (DOCX)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
              onClick={handleExport}
              disabled={loading || !sections || sections.length === 0}
            >
              {loading ? 'Processing...' : `Export ${exportFormat}`}
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      <Box mt={3} display="flex" alignItems="center">
        <InfoIcon color="info" fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Each book exported is tracked for fair use compliance. Substantial changes to 
          create a different book require a new purchase.
        </Typography>
      </Box>
      
      {/* Fair Use Warning Dialog */}
      <FairUseWarning
        open={!!fairUseViolation}
        onClose={handleContinueAnyway}
        warningMessage={fairUseViolation?.warningMessage}
        similarityScore={fairUseViolation?.similarityScore}
        onPurchaseClick={handlePurchase}
      />
    </Paper>
  );
};

export default BookExportWithProtection; 