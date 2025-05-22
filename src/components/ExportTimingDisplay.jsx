import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import SecurityIcon from '@mui/icons-material/Security';

/**
 * Displays generation times for exported files and provides download buttons
 * @param {Object} props
 * @param {Object} props.timings - Object containing generation times (e.g. {pdf: 15.2, epub: 8.4, word: 7.1})
 * @param {Function} props.onDownload - Function to call when download button is clicked, receives format as parameter
 * @param {boolean} props.loading - Whether files are still being generated
 * @param {string} props.projectTitle - Title of the project for file naming
 */
const ExportTimingDisplay = ({ timings, onDownload, loading = false, projectTitle = 'export' }) => {
  // Format timing to always show exactly one decimal place
  const formatTime = (time) => {
    // Convert to number if it's a string
    const numTime = typeof time === 'string' ? parseFloat(time) : time;
    
    // Format to always show exactly one decimal place
    return numTime.toFixed(1);
  };
  
  const formatItems = [
    { 
      format: 'pdf', 
      label: 'PDF', 
      time: timings?.pdf || 0,
      color: '#4caf50' // green
    },
    { 
      format: 'epub', 
      label: 'EPUB', 
      time: timings?.epub || 0,
      color: '#2196f3' // blue
    },
    { 
      format: 'word', 
      label: 'Word document', 
      time: timings?.word || 0,
      color: '#ff9800' // orange
    }
  ];
  
  // Only show formats that have been generated (time > 0)
  const availableFormats = formatItems.filter(item => item.time > 0);
  
  return (
    <Box sx={{ mt: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Export Complete
      </Typography>
      
      <List sx={{ width: '100%' }}>
        {availableFormats.map((item) => (
          <ListItem 
            key={item.format}
            sx={{ 
              py: 1.5, 
              px: 2,
              borderRadius: 1,
              mb: 1,
              backgroundColor: `${item.color}10`,
              border: `1px solid ${item.color}30`,
            }}
            secondaryAction={
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={() => onDownload(item.format, projectTitle)}
                disabled={loading}
                size="small"
                sx={{ 
                  borderRadius: '20px',
                  px: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: 1
                }}
              >
                Download
              </Button>
            }
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleIcon sx={{ color: item.color }} />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.label} generated in <Box component="span" sx={{ fontWeight: 700 }}>{formatTime(item.time)} seconds</Box>
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
      
      <Alert 
        severity="info" 
        icon={<SecurityIcon />}
        sx={{ mt: 3, mb: 1 }}
      >
        Files will be automatically deleted in 15 minutes for security - please download now.
      </Alert>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.85rem' }}>
        All files are ready for download. Files are not stored on our servers - please download them now.
      </Typography>
    </Box>
  );
};

export default ExportTimingDisplay; 