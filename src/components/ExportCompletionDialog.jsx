import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  IconButton,
  Typography,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExportTimingDisplay from './ExportTimingDisplay';

/**
 * Dialog that displays when export is complete with generation times and download buttons
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when dialog is closed
 * @param {Object} props.timings - Object containing generation times (e.g. {pdf: 15.2, epub: 8.4, word: 7.1})
 * @param {Function} props.onDownload - Function to call when download button is clicked
 * @param {string} props.projectTitle - Title of the project for file naming
 */
const ExportCompletionDialog = ({ open, onClose, timings, onDownload, projectTitle = 'export' }) => {
  console.log('ExportCompletionDialog render:', { 
    open, 
    timings, 
    projectTitle,
    hasOnDownload: !!onDownload 
  });
  
  // Example implementation of the download handler
  const handleDownload = (format) => {
    console.log(`Download button clicked for ${format} file...`);
    
    // Call the provided onDownload function
    if (onDownload) {
      console.log('Calling provided onDownload function');
      onDownload(format, projectTitle);
    } else {
      console.warn('No onDownload handler provided!');
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="export-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="export-dialog-title" sx={{ pr: 6 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
          Export Complete
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          For security reasons, files are not automatically downloaded. 
          Please click the download button below to save your file.
        </Alert>
        
        <ExportTimingDisplay 
          timings={timings} 
          onDownload={handleDownload}
          projectTitle={projectTitle}
        />
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ borderRadius: '20px', px: 3 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportCompletionDialog; 